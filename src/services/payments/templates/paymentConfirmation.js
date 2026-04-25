const {
  logoAttachment,
  LOGO_CID,
  buildOrderStatusUrl,
  renderOrderStatusCta,
} = require('./emailLayout');

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

const buildTransactionPaymentEmail = ({
  username,
  code,
  merchandiseName,
  qty,
  amount,
  transactionId,
  orderStatusTransactionId,
  orderStatusUrl,
}) => ({
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
  ${renderOrderStatusCta(orderStatusUrl || buildOrderStatusUrl(orderStatusTransactionId))}
  <p style="color:#6b7280;font-size:13px;margin-top:24px;">Salam,<br><strong>IOM ITB</strong></p>
</div>`,
  attachments: [logoAttachment()],
});

const buildTransactionProofReceivedEmail = ({ username, code, merchandiseName, qty, amount, transactionId, orderStatusUrl }) => ({
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
  ${renderOrderStatusCta(orderStatusUrl || buildOrderStatusUrl(transactionId))}
  <p style="color:#6b7280;font-size:13px;margin-top:24px;">Salam,<br><strong>IOM ITB</strong></p>
</div>`,
  attachments: [logoAttachment()],
});

const SHIPPING_STATUS_COPY = {
  'on process': {
    title: 'Pesanan Sedang Diproses',
    headline: 'Pesanan Anda sedang kami siapkan.',
    body: 'Tim IOM ITB sedang menyiapkan pesanan Anda dan akan segera dikirim.',
  },
  'on delivery': {
    title: 'Pesanan Dalam Pengiriman',
    headline: 'Pesanan Anda sudah dalam perjalanan!',
    body: 'Pesanan akan tiba sesuai alamat pengiriman yang Anda berikan. Mohon tunggu beberapa hari kerja.',
  },
  arrived: {
    title: 'Pesanan Telah Tiba',
    headline: 'Pesanan Anda telah sampai di tujuan.',
    body: 'Mohon konfirmasi penerimaan pesanan. Terima kasih atas kepercayaan Anda kepada IOM ITB.',
  },
  done: {
    title: 'Pesanan Selesai',
    headline: 'Pesanan Anda telah selesai.',
    body: 'Terima kasih telah berbelanja di IOM ITB. Semoga produk kami bermanfaat untuk Anda.',
  },
  canceled: {
    title: 'Pesanan Dibatalkan',
    headline: 'Pesanan Anda telah dibatalkan.',
    body: 'Jika ada pertanyaan terkait pembatalan ini, mohon hubungi tim IOM ITB.',
  },
  denied: {
    title: 'Pesanan Ditolak',
    headline: 'Pesanan Anda tidak dapat kami proses.',
    body: 'Jika ada pertanyaan, mohon hubungi tim IOM ITB untuk informasi lebih lanjut.',
  },
};

const buildTransactionShippingStatusEmail = ({ username, code, merchandiseName, qty, address, status, transactionId, orderStatusUrl }) => {
  const copy = SHIPPING_STATUS_COPY[status] || {
    title: 'Update Status Pesanan',
    headline: `Status pesanan Anda diperbarui menjadi: ${status}`,
    body: 'Cek detail pesanan Anda untuk informasi lebih lanjut.',
  };
  return {
    subject: `${copy.title} — IOM ITB`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
  <div style="text-align:center;margin-bottom:20px;">
    <img src="cid:${LOGO_CID}" alt="IOM ITB" style="max-width:180px;height:auto;" />
  </div>
  <h2 style="color:#1d4ed8;margin-bottom:4px;">IOM ITB</h2>
  <p style="color:#6b7280;margin-top:0;">${copy.title}</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
  <p>Halo <strong>${username}</strong>,</p>
  <p><strong>${copy.headline}</strong></p>
  <p>${copy.body}</p>
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    <tr><td style="padding:8px 0;color:#6b7280;">Kode Pesanan</td><td style="padding:8px 0;font-weight:bold;">${code}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Produk</td><td style="padding:8px 0;">${merchandiseName} x ${qty}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Status Saat Ini</td><td style="padding:8px 0;font-weight:bold;color:#1d4ed8;text-transform:capitalize;">${status}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Alamat Pengiriman</td><td style="padding:8px 0;">${address}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">ID Transaksi</td><td style="padding:8px 0;font-size:12px;color:#6b7280;">${transactionId}</td></tr>
  </table>
  ${renderOrderStatusCta(orderStatusUrl || buildOrderStatusUrl(transactionId))}
  <p style="color:#6b7280;font-size:13px;margin-top:24px;">Salam,<br><strong>IOM ITB</strong></p>
</div>`,
    attachments: [logoAttachment()],
  };
};

module.exports = {
  buildDonationPaymentEmail,
  buildTransactionPaymentEmail,
  buildTransactionProofReceivedEmail,
  buildTransactionShippingStatusEmail,
  SHIPPING_STATUS_COPY,
};
