const { Donations, Transactions, Merchandises } = require('../../models');
const { coreApi } = require('../../utils/midtrans');
const sendWhatsApp = require('../../utils/whatsapp');

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

const handleMidtransNotification = async (body) => {
  const notification = await coreApi.transaction.notification(body);

  const { order_id, transaction_status, fraud_status, gross_amount, transaction_id } = notification;
  const paymentStatus = mapPaymentStatus(transaction_status, fraud_status);
  const isPaid = paymentStatus === 'settlement';
  const isFailed = paymentStatus === 'failed' || paymentStatus === 'expired';

  if (order_id.startsWith('DONATION-')) {
    const donation = await Donations.findOne({ where: { midtrans_order_id: order_id } });
    if (!donation) return { message: 'Donation not found' };

    if (donation.paymentStatus === 'settlement') {
      return { message: 'Already processed' };
    }

    const updates = {
      paymentStatus,
      midtransTransactionId: transaction_id,
    };

    if (isPaid) {
      updates.proof = `midtrans:${transaction_id}`;
      updates.date = new Date();
    }

    await donation.update(updates);

    if (isPaid && donation.noWhatsapp && Array.isArray(donation.notification) && donation.notification.includes('Whatsapp')) {
      const amount = Number(gross_amount).toLocaleString('id-ID');
      const message = `Halo ${donation.name}!\n\nPembayaran donasi Anda sebesar Rp ${amount} telah berhasil dikonfirmasi.\n\nTerima kasih atas kontribusi Anda kepada IOM ITB!\n\nSalam,\nIOM ITB`;
      sendWhatsApp(
        donation.noWhatsapp,
        message,
        `donation-${donation.id}-paid`,
        `donation-${donation.id}`
      );
    }
  } else if (order_id.startsWith('IOM-')) {
    const transaction = await Transactions.findOne({
      where: { code: order_id },
      include: [{ model: Merchandises, as: 'merchandises' }],
    });
    if (!transaction) return { message: 'Transaction not found' };

    if (transaction.paymentStatus === 'settlement') {
      return { message: 'Already processed' };
    }

    const updates = {
      paymentStatus,
      midtransTransactionId: transaction_id,
    };

    if (isPaid) {
      updates.status = 'on process';
      updates.payment = `midtrans:${transaction_id}`;
    } else if (isFailed) {
      updates.status = 'canceled';
    }

    await transaction.update(updates);

    if (isPaid && transaction.noTelp) {
      const amount = Number(gross_amount).toLocaleString('id-ID');
      const merchandiseName = transaction.merchandises?.name || 'Merchandise';
      const message = `Halo ${transaction.username}!\n\nPembayaran pesanan Anda telah berhasil!\n\nKode Pesanan: ${transaction.code}\nProduk: ${merchandiseName} x ${transaction.qty}\nTotal: Rp ${amount}\n\nPesanan Anda sedang diproses.\n\nSalam,\nIOM ITB`;
      sendWhatsApp(
        transaction.noTelp,
        message,
        `transaction-${transaction.id}-paid`,
        `transaction-${transaction.id}`
      );
    }
  }

  return { message: 'Notification handled' };
};

module.exports = handleMidtransNotification;
