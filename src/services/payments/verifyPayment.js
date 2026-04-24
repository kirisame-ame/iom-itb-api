const { coreApi } = require('../../utils/midtrans');
const { Donations, Transactions, Merchandises } = require('../../models');
const sendWhatsApp = require('../../utils/whatsapp');
const sendEmail = require('../../utils/mailer');

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

const verifyPayment = async (orderId) => {
  if (!orderId) throw new Error('orderId is required');

  const statusResponse = await coreApi.transaction.status(orderId);
  const { transaction_status, fraud_status, gross_amount, transaction_id } = statusResponse;

  const isPaid = transaction_status === 'settlement' ||
    (transaction_status === 'capture' && fraud_status === 'accept');

  if (!isPaid) {
    return { message: `Payment not confirmed yet. Status: ${transaction_status}` };
  }

  if (orderId.startsWith('DONATION-')) {
    const donation = await Donations.findOne({ where: { midtrans_order_id: orderId } });
    if (!donation) return { message: 'Donation not found' };

    if (donation.paymentStatus === 'settlement') {
      return { message: 'Already processed' };
    }

    await donation.update({
      proof: `midtrans:${transaction_id}`,
      date: new Date(),
      paymentStatus: 'settlement',
      midtransTransactionId: transaction_id,
    });

    const amount = Number(gross_amount).toLocaleString('id-ID');
    const donationType = donation.options?.donationType || null;

    if (donation.noWhatsapp && Array.isArray(donation.notification) && donation.notification.includes('Whatsapp')) {
      const message = `Halo ${donation.name}!\n\nPembayaran donasi Anda sebesar Rp ${amount} telah berhasil dikonfirmasi.\n\nTerima kasih atas kontribusi Anda kepada IOM ITB!\n\nSalam,\nIOM ITB`;
      sendWhatsApp(donation.noWhatsapp, message, `donation-${donation.id}-paid`, `donation-${donation.id}`);
    }

    if (donation.email) {
      sendEmail({
        to: donation.email,
        subject: 'Konfirmasi Donasi IOM ITB',
        html: donationEmailHtml({ name: donation.name, amount, donationType, transactionId: transaction_id }),
      });
    }

    return { message: 'Payment verified and processed' };
  }

  if (orderId.startsWith('IOM-')) {
    const transaction = await Transactions.findOne({
      where: { code: orderId },
      include: [{ model: Merchandises, as: 'merchandises' }],
    });
    if (!transaction) return { message: 'Transaction not found' };

    if (transaction.paymentStatus === 'settlement') {
      return { message: 'Already processed' };
    }

    await transaction.update({
      status: 'on process',
      payment: `midtrans:${transaction_id}`,
      paymentStatus: 'settlement',
      midtransTransactionId: transaction_id,
    });

    const amount = Number(gross_amount).toLocaleString('id-ID');
    const merchandiseName = transaction.merchandises?.name || 'Merchandise';

    if (transaction.noTelp) {
      const message = `Halo ${transaction.username}!\n\nPembayaran pesanan Anda telah berhasil!\n\nKode Pesanan: ${transaction.code}\nProduk: ${merchandiseName} x ${transaction.qty}\nTotal: Rp ${amount}\n\nPesanan Anda sedang diproses.\n\nSalam,\nIOM ITB`;
      sendWhatsApp(transaction.noTelp, message, `transaction-${transaction.id}-paid`, `transaction-${transaction.id}`);
    }

    if (transaction.email) {
      sendEmail({
        to: transaction.email,
        subject: 'Konfirmasi Pesanan IOM ITB',
        html: transactionEmailHtml({ username: transaction.username, code: transaction.code, merchandiseName, qty: transaction.qty, amount, transactionId: transaction_id }),
      });
    }

    return { message: 'Payment verified and processed' };
  }

  return { message: 'Unknown order type' };
};

module.exports = verifyPayment;
