const crypto = require('crypto');
const { Donations, Transactions, Merchandises, sequelize } = require('../../models');
const { coreApi } = require('../../utils/midtrans');
const sendWhatsApp = require('../../utils/whatsapp');
const { restoreMerchandiseStock } = require('./stockHelper');

const mapPaymentStatus = (transaction_status, fraud_status) => {
  if (transaction_status === 'settlement') return 'settlement';
  if (transaction_status === 'capture') {
    return fraud_status === 'accept' ? 'settlement' : 'pending';
  }
  if (transaction_status === 'expire') return 'expired';
  if (transaction_status === 'cancel' || transaction_status === 'deny') return 'failed';
  if (transaction_status === 'refund' || transaction_status === 'partial_refund') return 'refunded';
  return 'pending';
};

const verifySignature = (body) => {
  const { order_id, status_code, gross_amount, signature_key } = body || {};
  if (!signature_key) return false;
  const expected = crypto
    .createHash('sha512')
    .update(`${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY || ''}`)
    .digest('hex');
  return expected === signature_key;
};

const handleMidtransNotification = async (body) => {
  if (!verifySignature(body)) {
    return { status: 401, message: 'Invalid signature' };
  }

  const notification = await coreApi.transaction.notification(body);
  const {
    order_id,
    transaction_status,
    fraud_status,
    gross_amount,
    transaction_id,
    payment_type,
    va_numbers,
    settlement_time,
  } = notification;

  const paymentStatus = mapPaymentStatus(transaction_status, fraud_status);
  const isPaid = paymentStatus === 'settlement';
  const isFailed = paymentStatus === 'failed' || paymentStatus === 'expired';
  const vaNumber = Array.isArray(va_numbers) && va_numbers[0] ? va_numbers[0].va_number : null;
  const paidAt = isPaid ? (settlement_time ? new Date(settlement_time) : new Date()) : null;

  if (order_id.startsWith('DONATION-')) {
    return processDonation({
      order_id,
      paymentStatus,
      isPaid,
      gross_amount,
      transaction_id,
      payment_type,
      vaNumber,
      fraud_status,
      paidAt,
      notification,
    });
  }

  if (order_id.startsWith('IOM-')) {
    return processTransaction({
      order_id,
      paymentStatus,
      isPaid,
      isFailed,
      gross_amount,
      transaction_id,
      payment_type,
      vaNumber,
      fraud_status,
      paidAt,
      notification,
    });
  }

  return { message: 'Unknown order type' };
};

const processDonation = async ({
  order_id, paymentStatus, isPaid, gross_amount, transaction_id,
  payment_type, vaNumber, fraud_status, paidAt, notification,
}) => {
  let wasPaid = false;
  let donorCopy = null;

  await sequelize.transaction(async (t) => {
    const donation = await Donations.findOne({
      where: { midtrans_order_id: order_id },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!donation) return;

    if (donation.paymentStatus === 'settlement') return;

    if (donation.grossAmount != null && Number(gross_amount) !== Number(donation.grossAmount)) {
      throw new Error(`Amount mismatch for ${order_id}: expected ${donation.grossAmount}, got ${gross_amount}`);
    }

    const updates = {
      paymentStatus,
      midtransTransactionId: transaction_id,
      paymentType: payment_type || donation.paymentType,
      vaNumber: vaNumber || donation.vaNumber,
      fraudStatus: fraud_status || donation.fraudStatus,
      rawNotification: notification,
    };
    if (isPaid) {
      updates.proof = `midtrans:${transaction_id}`;
      updates.date = paidAt;
      updates.paidAt = paidAt;
      wasPaid = true;
    }

    await donation.update(updates, { transaction: t });
    donorCopy = {
      name: donation.name,
      noWhatsapp: donation.noWhatsapp,
      notification: donation.notification,
      id: donation.id,
    };
  });

  if (wasPaid && donorCopy?.noWhatsapp && Array.isArray(donorCopy.notification) && donorCopy.notification.includes('Whatsapp')) {
    const amount = Number(gross_amount).toLocaleString('id-ID');
    const message = `Halo ${donorCopy.name}!\n\nPembayaran donasi Anda sebesar Rp ${amount} telah berhasil dikonfirmasi.\n\nTerima kasih atas kontribusi Anda kepada IOM ITB!\n\nSalam,\nIOM ITB`;
    sendWhatsApp(donorCopy.noWhatsapp, message, `donation-${donorCopy.id}-paid`, `donation-${donorCopy.id}`);
  }

  return { message: 'Notification handled' };
};

const processTransaction = async ({
  order_id, paymentStatus, isPaid, isFailed, gross_amount, transaction_id,
  payment_type, vaNumber, fraud_status, paidAt, notification,
}) => {
  let wasPaid = false;
  let trxCopy = null;

  await sequelize.transaction(async (t) => {
    const trx = await Transactions.findOne({
      where: { code: order_id },
      include: [{ model: Merchandises, as: 'merchandises' }],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!trx) return;

    if (trx.paymentStatus === 'settlement') return;

    if (trx.grossAmount != null && Number(gross_amount) !== Number(trx.grossAmount)) {
      throw new Error(`Amount mismatch for ${order_id}: expected ${trx.grossAmount}, got ${gross_amount}`);
    }

    const updates = {
      paymentStatus,
      midtransTransactionId: transaction_id,
      paymentType: payment_type || trx.paymentType,
      vaNumber: vaNumber || trx.vaNumber,
      fraudStatus: fraud_status || trx.fraudStatus,
      rawNotification: notification,
    };

    if (isPaid) {
      updates.status = 'on process';
      updates.payment = `midtrans:${transaction_id}`;
      updates.paidAt = paidAt;
      wasPaid = true;
    } else if (isFailed) {
      updates.status = 'canceled';
      if (trx.stockDeducted) {
        await restoreMerchandiseStock(
          { merchandiseId: trx.merchandiseId, qty: trx.qty },
          t
        );
        updates.stockDeducted = false;
      }
    }

    await trx.update(updates, { transaction: t });
    trxCopy = {
      username: trx.username,
      noTelp: trx.noTelp,
      code: trx.code,
      qty: trx.qty,
      id: trx.id,
      merchandiseName: trx.merchandises?.name || 'Merchandise',
    };
  });

  if (wasPaid && trxCopy?.noTelp) {
    const amount = Number(gross_amount).toLocaleString('id-ID');
    const message = `Halo ${trxCopy.username}!\n\nPembayaran pesanan Anda telah berhasil!\n\nKode Pesanan: ${trxCopy.code}\nProduk: ${trxCopy.merchandiseName} x ${trxCopy.qty}\nTotal: Rp ${amount}\n\nPesanan Anda sedang diproses.\n\nSalam,\nIOM ITB`;
    sendWhatsApp(trxCopy.noTelp, message, `transaction-${trxCopy.id}-paid`, `transaction-${trxCopy.id}`);
  }

  return { message: 'Notification handled' };
};

module.exports = handleMidtransNotification;
