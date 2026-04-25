const { logoAttachment, LOGO_CID } = require('./emailLayout');

const buildDonationPaymentEmail = ({ name, amount, donationType, transactionId }) => ({
  subject: 'Konfirmasi Donasi IOM ITB',
  html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
  <div style="text-align:center;margin-bottom:20px;">
    <img src="cid:${LOGO_CID}" alt="IOM ITB" style="max-width:180px;height:auto;" />
  </div>
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
</div>`,
  attachments: [logoAttachment()],
});

const buildTransactionPaymentEmail = ({ username, code, merchandiseName, qty, amount, transactionId }) => ({
  subject: 'Konfirmasi Pesanan IOM ITB',
  html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
  <div style="text-align:center;margin-bottom:20px;">
    <img src="cid:${LOGO_CID}" alt="IOM ITB" style="max-width:180px;height:auto;" />
  </div>
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
</div>`,
  attachments: [logoAttachment()],
});

const buildTransactionProofReceivedEmail = ({ username, code, merchandiseName, qty, amount, transactionId }) => ({
  subject: 'Bukti Pembayaran Diterima — IOM ITB',
  html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
  <div style="text-align:center;margin-bottom:20px;">
    <img src="cid:${LOGO_CID}" alt="IOM ITB" style="max-width:180px;height:auto;" />
  </div>
  <h2 style="color:#1d4ed8;margin-bottom:4px;">IOM ITB</h2>
  <p style="color:#6b7280;margin-top:0;">Bukti Pembayaran Telah Kami Terima</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
  <p>Halo <strong>${username}</strong>,</p>
  <p>Terima kasih, kami telah menerima bukti pembayaran Anda. Tim IOM ITB akan memverifikasi pembayaran dalam 1x24 jam.</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr><td style="padding:8px 0;color:#6b7280;">Kode Pesanan</td><td style="padding:8px 0;font-weight:bold;">${code}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Produk</td><td style="padding:8px 0;">${merchandiseName} x ${qty}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Total</td><td style="padding:8px 0;font-weight:bold;color:#16a34a;">Rp ${amount}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">ID Transaksi</td><td style="padding:8px 0;font-size:12px;color:#6b7280;">${transactionId}</td></tr>
  </table>
  <p>Anda akan mendapat notifikasi lanjutan setelah pembayaran terverifikasi.</p>
  <p style="color:#6b7280;font-size:13px;margin-top:24px;">Salam,<br><strong>IOM ITB</strong></p>
</div>`,
  attachments: [logoAttachment()],
});

module.exports = {
  buildDonationPaymentEmail,
  buildTransactionPaymentEmail,
  buildTransactionProofReceivedEmail,
};
