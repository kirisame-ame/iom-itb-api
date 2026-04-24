const { coreApi } = require('../../utils/midtrans');
const { Donations, Transactions, Merchandises, sequelize } = require('../../models');
const sendWhatsApp = require('../../utils/whatsapp');
const sendEmail = require('../../utils/mailer');
const { restoreMerchandiseStock } = require('./stockHelper');
const logPaymentEvent = require('./logPaymentEvent');

const donationEmailHtml = ({ name, amount, donationType, transactionId }) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
  <h2 style="color:#1d4ed8;margin-bottom:4px;">IOM ITB</h2>
  <p style="color:#6b7280;margin-top:0;">Konfirmasi Pembayaran Donasi</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
  <p>Halo <strong>${name}</strong>,</p>
  <p>Pembayaran donasi Anda telah berhasil dikonfirmasi.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr><td style="padding:8px 0;color:#6b7280;">Jenis Donasi</td><td style="padding:8px 0;font-weight:bold;">${donationType || 'Umum'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Jumlah</td><td style="padding:8px 0;font-weight:bold;color:#16a34a;">Rp ${amount}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">ID Transaksi</td><td style="padding:8px 0;font-size:12px;color:#6b7280;">${transactionId}</td></tr>
  </table>
  <p>Terima kasih atas kontribusi Anda kepada IOM ITB!</p>
  <p style="color:#6b7280;font-size:13px;margin-top:24px;">Salam,<br><strong>IOM ITB</strong></p>
</div>`;

const transactionEmailHtml = ({ username, code, merchandiseName, qty, amount, transactionId }) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
  <h2 style="color:#1d4ed8;margin-bottom:4px;">IOM ITB</h2>
  <p style="color:#6b7280;margin-top:0;">Konfirmasi Pembayaran Merchandise</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
  <p>Halo <strong>${username}</strong>,</p>
  <p>Pembayaran pesanan Anda telah berhasil! Pesanan sedang diproses.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr><td style="padding:8px 0;color:#6b7280;">Kode Pesanan</td><td style="padding:8px 0;font-weight:bold;">${code}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Produk</td><td style="padding:8px 0;">${merchandiseName} x ${qty}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Total</td><td style="padding:8px 0;font-weight:bold;color:#16a34a;">Rp ${amount}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">ID Transaksi</td><td style="padding:8px 0;font-size:12px;color:#6b7280;">${transactionId}</td></tr>
  </table>
  <p style="color:#6b7280;font-size:13px;margin-top:24px;">Salam,<br><strong>IOM ITB</strong></p>
</div>`;

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

const verifyPayment = async (orderId, { ipAddress } = {}) => {
  if (!orderId) throw new Error('orderId is required');

  const statusResponse = await coreApi.transaction.status(orderId);
  const {
    transaction_status,
    fraud_status,
    gross_amount,
    transaction_id,
    payment_type,
    va_numbers,
    settlement_time,
  } = statusResponse;

  const paymentStatus = mapPaymentStatus(transaction_status, fraud_status);
  const isPaid = paymentStatus === 'settlement';
  const isFailed = paymentStatus === 'failed' || paymentStatus === 'expired';
  const vaNumber = Array.isArray(va_numbers) && va_numbers[0] ? va_numbers[0].va_number : null;
  const paidAt = isPaid ? (settlement_time ? new Date(settlement_time) : new Date()) : null;

  if (orderId.startsWith('DONATION-')) {
    let donorCopy = null;
    let wasPaid = false;
    let currentStatus = paymentStatus;

    await sequelize.transaction(async (t) => {
      const donation = await Donations.findOne({
        where: { midtransOrderId: orderId },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (!donation) {
        currentStatus = 'not_found';
        return;
      }

      if (donation.paymentStatus === 'settlement') {
        currentStatus = 'settlement';
        return;
      }

      if (donation.grossAmount != null && Number(gross_amount) !== Number(donation.grossAmount)) {
        throw new Error(`Amount mismatch for ${orderId}`);
      }

      const updates = {
        paymentStatus,
        midtransTransactionId: transaction_id,
        paymentType: payment_type || donation.paymentType,
        vaNumber: vaNumber || donation.vaNumber,
        fraudStatus: fraud_status || donation.fraudStatus,
        rawNotification: statusResponse,
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
        email: donation.email,
        noWhatsapp: donation.noWhatsapp,
        notification: donation.notification,
        donationType: donation.options?.donationType || null,
        id: donation.id,
      };
    });

    if (currentStatus === 'not_found') return { message: 'Donation not found' };
    if (!wasPaid) return { message: `Payment status: ${paymentStatus}` };

    const amount = Number(gross_amount).toLocaleString('id-ID');
    if (donorCopy.noWhatsapp && Array.isArray(donorCopy.notification) && donorCopy.notification.includes('Whatsapp')) {
      const message = `Halo ${donorCopy.name}!\n\nPembayaran donasi Anda sebesar Rp ${amount} telah berhasil dikonfirmasi.\n\nTerima kasih atas kontribusi Anda kepada IOM ITB!\n\nSalam,\nIOM ITB`;
      sendWhatsApp(donorCopy.noWhatsapp, message, `donation-${donorCopy.id}-paid`, `donation-${donorCopy.id}`);
    }

    if (donorCopy.email) {
      sendEmail({
        to: donorCopy.email,
        subject: 'Konfirmasi Donasi IOM ITB',
        html: donationEmailHtml({ name: donorCopy.name, amount, donationType: donorCopy.donationType, transactionId: transaction_id }),
      });
    }

    return { message: 'Payment verified and processed' };
  }

  if (orderId.startsWith('IOM-')) {
    let trxCopy = null;
    let wasPaid = false;
    let currentStatus = paymentStatus;

    await sequelize.transaction(async (t) => {
      const trx = await Transactions.findOne({
        where: { code: orderId },
        include: [{ model: Merchandises, as: 'merchandises' }],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (!trx) {
        currentStatus = 'not_found';
        return;
      }

      if (trx.paymentStatus === 'settlement') {
        currentStatus = 'settlement';
        return;
      }

      if (trx.grossAmount != null && Number(gross_amount) !== Number(trx.grossAmount)) {
        throw new Error(`Amount mismatch for ${orderId}`);
      }

      const updates = {
        paymentStatus,
        midtransTransactionId: transaction_id,
        paymentType: payment_type || trx.paymentType,
        vaNumber: vaNumber || trx.vaNumber,
        fraudStatus: fraud_status || trx.fraudStatus,
        rawNotification: statusResponse,
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
        email: trx.email,
        noTelp: trx.noTelp,
        code: trx.code,
        qty: trx.qty,
        id: trx.id,
        merchandiseName: trx.merchandises?.name || 'Merchandise',
      };
    });

    if (currentStatus === 'not_found') return { message: 'Transaction not found' };
    if (!wasPaid) return { message: `Payment status: ${paymentStatus}` };

    const amount = Number(gross_amount).toLocaleString('id-ID');
    if (trxCopy.noTelp) {
      const message = `Halo ${trxCopy.username}!\n\nPembayaran pesanan Anda telah berhasil!\n\nKode Pesanan: ${trxCopy.code}\nProduk: ${trxCopy.merchandiseName} x ${trxCopy.qty}\nTotal: Rp ${amount}\n\nPesanan Anda sedang diproses.\n\nSalam,\nIOM ITB`;
      sendWhatsApp(trxCopy.noTelp, message, `transaction-${trxCopy.id}-paid`, `transaction-${trxCopy.id}`);
    }

    if (trxCopy.email) {
      sendEmail({
        to: trxCopy.email,
        subject: 'Konfirmasi Pesanan IOM ITB',
        html: transactionEmailHtml({
          username: trxCopy.username,
          code: trxCopy.code,
          merchandiseName: trxCopy.merchandiseName,
          qty: trxCopy.qty,
          amount,
          transactionId: transaction_id,
        }),
      });
    }

    return { message: 'Payment verified and processed' };
  }

  return { message: 'Unknown order type' };
};

const verifyPaymentWithLogging = async (orderId, opts = {}) => {
  let result;
  let error = null;
  try {
    result = await verifyPayment(orderId, opts);
    return result;
  } catch (err) {
    error = err.message;
    throw err;
  } finally {
    await logPaymentEvent({
      source: 'verify',
      payload: { order_id: orderId },
      processed: !error,
      error,
      ipAddress: opts.ipAddress,
    });
  }
};

module.exports = verifyPaymentWithLogging;
