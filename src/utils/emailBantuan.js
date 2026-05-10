const path = require('path');

const LOGO_PATH = path.resolve(
  __dirname,
  '../assets/IOM-ITB-PrimaryLogo-blue.png'
);

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

const escapeHtml = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatDate = (d) => {
  const dt = d ? new Date(d) : new Date();

  return dt.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
};

const STATUS_LABELS = {
  VERIFIKASI_BERKAS: 'Sedang Dalam Proses Verifikasi Berkas',
  DIPANGGIL_WAWANCARA: 'Dipanggil Wawancara',
  KEPUTUSAN_DITERIMA: 'Keputusan Akhir Diterima',
  KEPUTUSAN_DITOLAK: 'Keputusan Akhir Ditolak',
  TIDAK_DIKETAHUI: 'Tidak Diketahui',
};

/**
 * @typedef {Object} PengajuanStatusEmailInput
 * @property {string} recipientName
 * @property {string} tallySubmissionId
 * @property {string} status
 * @property {string} [catatan]
 * @property {Date|string} [updatedAt]
 */

/**
 * @param {PengajuanStatusEmailInput} input
 * @returns {string}
 */
const renderPengajuanStatusHtml = ({
  recipientName,
  tallySubmissionId,
  status,
  catatan,
  updatedAt,
}) => {
  const statusLabel =
    STATUS_LABELS[status] || status || 'Tidak Diketahui';

  const safeRecipientName = escapeHtml(recipientName);
  const safeSubmissionId = escapeHtml(tallySubmissionId);
  const safeStatus = escapeHtml(statusLabel);
  const safeCatatan = escapeHtml(catatan);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
      
      <div style="background: #2563eb; color: #fff; padding: 20px 24px; border-radius: 8px 8px 0 0; text-align: center;">
        <img
          src="cid:${LOGO_CID}"
          alt="IOM ITB"
          style="max-width: 180px; height: auto; margin-bottom: 16px;"
        />

        <h1 style="margin: 0; font-size: 20px;">
          Update Status Pengajuan Bantuan
        </h1>

        <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">
          IOM ITB
        </p>
      </div>

      <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">

        <p style="margin: 0 0 12px;">
          Halo <strong>${safeRecipientName || '-'}</strong>,
        </p>

        <p style="margin: 0 0 20px;">
          Status pengajuan bantuan Anda telah diperbarui.
          Berikut detail terbaru pengajuan Anda:
        </p>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tbody>

            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 40%;">
                ID Pengajuan
              </td>

              <td style="padding: 8px 0; text-align: right; font-weight: 500;">
                ${safeSubmissionId}
              </td>
            </tr>

            <tr>
              <td style="padding: 8px 0; color: #6b7280;">
                Status
              </td>

              <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #2563eb;">
                ${safeStatus}
              </td>
            </tr>

            ${
              catatan
                ? `
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">
                Catatan
              </td>

              <td style="padding: 8px 0; text-align: right;">
                ${safeCatatan}
              </td>
            </tr>
            `
                : ''
            }

            <tr>
              <td style="padding: 8px 0; color: #6b7280;">
                Waktu Update
              </td>

              <td style="padding: 8px 0; text-align: right;">
                ${formatDate(updatedAt)}
              </td>
            </tr>

          </tbody>
        </table>

        <p style="margin: 24px 0 0;">
          Silakan login ke sistem untuk melihat detail pengajuan Anda.
        </p>

        <p style="margin: 24px 0 0;">
          Terima kasih,<br />
          <strong>Tim Pengajuan Bantuan IOM ITB</strong>
        </p>

        <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
          Email ini dikirim otomatis, mohon tidak membalas email ini.
        </p>

      </div>
    </div>
  `;
};

module.exports = {
  LOGO_CID,
  LOGO_PATH,
  logoAttachment,
  renderPengajuanStatusHtml,
  formatDate,
};