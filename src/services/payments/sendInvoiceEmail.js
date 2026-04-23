const { Merchandises, Faculties } = require('../../models');
const { sendMail } = require('../../utils/mailer');

const ADMIN_EMAIL = process.env.INVOICE_ADMIN_EMAIL || 'rizkyfathur326@gmail.com';

const formatIDR = (value) => {
  const num = Number(value || 0);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

const formatDate = (d) => {
  const dt = d ? new Date(d) : new Date();
  return dt.toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
};

const layout = ({ title, recipientLabel, recipientName, rows, grossAmount, footer }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
    <div style="background: #4f46e5; color: #fff; padding: 20px 24px; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; font-size: 20px;">${title}</h1>
      <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">IOM ITB</p>
    </div>
    <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
      <p style="margin: 0 0 12px;">Halo <strong>${recipientName || '-'}</strong>,</p>
      <p style="margin: 0 0 16px;">Terima kasih, ${recipientLabel} Anda telah kami terima dan berhasil diproses. Berikut rinciannya:</p>
      <table style="width:100%; border-collapse: collapse; font-size: 14px;">
        <tbody>
          ${rows.map((r) => `
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 40%;">${r.label}</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 500;">${r.value}</td>
            </tr>
          `).join('')}
          <tr>
            <td style="padding: 12px 0 0; border-top: 2px solid #4f46e5; font-weight: 700;">Total</td>
            <td style="padding: 12px 0 0; border-top: 2px solid #4f46e5; text-align: right; font-weight: 700; color: #4f46e5; font-size: 16px;">${formatIDR(grossAmount)}</td>
          </tr>
        </tbody>
      </table>
      ${footer ? `<p style="margin: 20px 0 0; font-size: 13px; color: #6b7280;">${footer}</p>` : ''}
      <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">Email ini dikirim otomatis, mohon tidak membalas.</p>
    </div>
  </div>
`;

const buildTransactionInvoice = async (trx) => {
  const merchandise = await Merchandises.findByPk(trx.merchandiseId);
  const merchName = merchandise ? merchandise.name : `Merchandise #${trx.merchandiseId}`;
  const price = merchandise ? Number(merchandise.price) : 0;

  const rows = [
    { label: 'Kode Transaksi', value: trx.code || trx.midtransOrderId || '-' },
    { label: 'Tanggal', value: formatDate(trx.updatedAt || trx.createdAt) },
    { label: 'Metode Pembayaran', value: 'Midtrans' },
    { label: 'Nama Pembeli', value: trx.username || '-' },
    { label: 'Email', value: trx.email || '-' },
    { label: 'No. Telp', value: trx.noTelp || '-' },
    { label: 'Alamat Pengiriman', value: trx.address || '-' },
    { label: 'Produk', value: merchName },
    { label: 'Harga Satuan', value: formatIDR(price) },
    { label: 'Jumlah', value: `${trx.qty} pcs` },
  ];

  return {
    subject: `Invoice Pembelian ${trx.code || trx.midtransOrderId} — IOM ITB`,
    html: layout({
      title: 'Invoice Pembelian',
      recipientLabel: 'pembayaran pembelian',
      recipientName: trx.username,
      rows,
      grossAmount: trx.grossAmount || price * Number(trx.qty || 0),
      footer: 'Pesanan Anda akan segera diproses dan dikirim sesuai alamat di atas.',
    }),
    to: trx.email,
  };
};

const DONATION_TYPE_LABEL = {
  iuran_sukarela: 'Iuran Sukarela',
  kontribusi_anggota: 'Kontribusi Anggota',
  kontribusi_donatur: 'Kontribusi Donatur',
  pembelian_merchandise: 'Pembelian Merchandise',
  kontribusi_sukarela: 'Kontribusi Sukarela',
};

const buildDonationInvoice = async (donation) => {
  let facultyName = '-';
  if (donation.facultyId) {
    const faculty = await Faculties.findByPk(donation.facultyId);
    if (faculty) facultyName = faculty.name;
  }

  const rows = [
    { label: 'ID Donasi', value: donation.midtransOrderId || `DON-${donation.id}` },
    { label: 'Tanggal', value: formatDate(donation.date || donation.updatedAt) },
    { label: 'Metode Pembayaran', value: 'Midtrans' },
    { label: 'Nama Donatur', value: donation.name || '-' },
    { label: 'Email', value: donation.email || '-' },
    { label: 'No. WhatsApp', value: donation.noWhatsapp || '-' },
    { label: 'Jenis Donasi', value: DONATION_TYPE_LABEL[donation.donationType] || donation.donationType || '-' },
    { label: 'Fakultas', value: facultyName },
  ];

  return {
    subject: `Invoice Donasi ${donation.midtransOrderId || `DON-${donation.id}`} — IOM ITB`,
    html: layout({
      title: 'Invoice Donasi',
      recipientLabel: 'donasi',
      recipientName: donation.name,
      rows,
      grossAmount: donation.grossAmount || donation.amount,
      footer: 'Terima kasih atas kontribusi Anda untuk IOM ITB.',
    }),
    to: donation.email,
  };
};

const sendTransactionInvoice = async (trx) => {
  const invoice = await buildTransactionInvoice(trx);
  return sendMail({
    to: invoice.to,
    cc: ADMIN_EMAIL,
    subject: invoice.subject,
    html: invoice.html,
  });
};

const sendDonationInvoice = async (donation) => {
  const invoice = await buildDonationInvoice(donation);
  return sendMail({
    to: invoice.to,
    cc: ADMIN_EMAIL,
    subject: invoice.subject,
    html: invoice.html,
  });
};

module.exports = {
  sendTransactionInvoice,
  sendDonationInvoice,
};
