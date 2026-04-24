const { Donations, Transactions, Merchandises } = require('../../models');
const { coreApi } = require('../../utils/midtrans');
const sendWhatsApp = require('../../utils/whatsapp');

const handleMidtransNotification = async (body) => {
  const notification = await coreApi.transaction.notification(body);

  const { order_id, transaction_status, fraud_status, gross_amount } = notification;
  const isPaid = transaction_status === 'settlement' ||
    (transaction_status === 'capture' && fraud_status === 'accept');
  const isFailed = ['cancel', 'deny', 'expire'].includes(transaction_status);

  if (order_id.startsWith('DONATION-')) {
    const donation = await Donations.findOne({ where: { midtrans_order_id: order_id } });
    if (!donation) return { message: 'Donation not found' };

    if (isPaid) {
      if (donation.proof && donation.proof.startsWith('midtrans:')) {
        return { message: 'Already processed' };
      }
      await donation.update({
        proof: `midtrans:${notification.transaction_id}`,
        date: new Date(),
      });

      if (donation.noWhatsapp && Array.isArray(donation.notification) && donation.notification.includes('Whatsapp')) {
        const amount = Number(gross_amount).toLocaleString('id-ID');
        const message = `Halo ${donation.name}!\n\nPembayaran donasi Anda sebesar Rp ${amount} telah berhasil dikonfirmasi.\n\nTerima kasih atas kontribusi Anda kepada IOM ITB!\n\nSalam,\nIOM ITB`;
        sendWhatsApp(
          donation.noWhatsapp,
          message,
          `donation-${donation.id}-paid`,
          `donation-${donation.id}`
        );
      }
    }
  } else if (order_id.startsWith('IOM-')) {
    const transaction = await Transactions.findOne({ where: { code: order_id }, include: [Merchandises] });
    if (!transaction) return { message: 'Transaction not found' };

    if (isPaid) {
      if (transaction.payment && transaction.payment.startsWith('midtrans:')) {
        return { message: 'Already processed' };
      }
      await transaction.update({
        status: 'on process',
        payment: `midtrans:${notification.transaction_id}`,
      });

      if (transaction.noTelp) {
        const amount = Number(gross_amount).toLocaleString('id-ID');
        const merchandiseName = transaction.Merchandise?.name || 'Merchandise';
        const message = `Halo ${transaction.username}!\n\nPembayaran pesanan Anda telah berhasil!\n\nKode Pesanan: ${transaction.code}\nProduk: ${merchandiseName} x ${transaction.qty}\nTotal: Rp ${amount}\n\nPesanan Anda sedang diproses.\n\nSalam,\nIOM ITB`;
        sendWhatsApp(
          transaction.noTelp,
          message,
          `transaction-${transaction.id}-paid`,
          `transaction-${transaction.id}`
        );
      }
    } else if (isFailed) {
      await transaction.update({ status: 'canceled' });
    }
  }

  return { message: 'Notification handled' };
};

module.exports = handleMidtransNotification;
