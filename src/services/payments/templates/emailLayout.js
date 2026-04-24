const path = require('path');

const LOGO_PATH = path.resolve(__dirname, '../../../assets/IOM-ITB-PrimaryLogo-blue.png');
const LOGO_CID = 'iom-itb-logo';

/**
 * @typedef {Object} MailAttachment
 * @property {string} filename
 * @property {string|Buffer} [path]
 * @property {string|Buffer} [content]
 * @property {string} [cid]
 * @property {string} [contentType]
 */

/**
 * Inline image attachment for embedding the logo.
 * @returns {MailAttachment}
 */
const logoAttachment = () => ({
  filename: 'IOM-ITB-PrimaryLogo-blue.png',
  path: LOGO_PATH,
  cid: LOGO_CID,
  contentType: 'image/png',
});

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

/**
 * @typedef {Object} InvoiceRow
 * @property {string} label
 * @property {string} value
 */

/**
 * @typedef {Object} InvoiceLayoutInput
 * @property {string} title
 * @property {string} recipientLabel
 * @property {string} [recipientName]
 * @property {InvoiceRow[]} rows
 * @property {number|string} [grossAmount]
 * @property {string} [footer]
 */

/**
 * @param {InvoiceLayoutInput} input
 * @returns {string}
 */
const renderInvoiceHtml = ({ title, recipientLabel, recipientName, rows, grossAmount, footer }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
    <div style="background: #4f46e5; color: #fff; padding: 20px 24px; border-radius: 8px 8px 0 0; text-align: center;">
      <img src="cid:${LOGO_CID}" alt="IOM ITB" style="max-width: 180px; height: auto; margin-bottom: 16px;" />
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
          ${grossAmount != null ? `
          <tr>
            <td style="padding: 12px 0 0; border-top: 2px solid #4f46e5; font-weight: 700;">Total</td>
            <td style="padding: 12px 0 0; border-top: 2px solid #4f46e5; text-align: right; font-weight: 700; color: #4f46e5; font-size: 16px;">${formatIDR(grossAmount)}</td>
          </tr>` : ''}
        </tbody>
      </table>
      ${footer ? `<p style="margin: 20px 0 0; font-size: 13px; color: #6b7280;">${footer}</p>` : ''}
      <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">Email ini dikirim otomatis, mohon tidak membalas.</p>
    </div>
  </div>
`;

module.exports = {
  LOGO_CID,
  LOGO_PATH,
  logoAttachment,
  renderInvoiceHtml,
  formatIDR,
  formatDate,
};
