const { Faculties } = require('../../../models');
const { renderInvoiceHtml, formatDate, logoAttachment } = require('./emailLayout');
const { DonationDto } = require('../../../dtos/payments');

/**
 * @typedef {import('../../../dtos/payments').DonationDto} DonationDto
 *
 * @typedef {Object} BuiltInvoice
 * @property {string}   to
 * @property {string}   subject
 * @property {string}   html
 * @property {Array}    attachments
 */

/**
 * @param {DonationDto} donation
 * @returns {Promise<BuiltInvoice>}
 */
const buildDonationInvoice = async (donation) => {
  const donationDto = donation instanceof DonationDto ? donation : new DonationDto(donation);
  let facultyName = '-';
  if (donationDto.facultyId) {
    const faculty = await Faculties.findByPk(donationDto.facultyId);
    if (faculty) facultyName = faculty.name;
  }

  const invoiceId = donationDto.getInvoiceId();
  const rows = donationDto.toInvoiceRows(facultyName).map((row) => ({
    ...row,
    value: row.label === 'Tanggal' ? formatDate(row.value) : row.value,
  }));

  return {
    to: donationDto.email,
    subject: `Invoice Donasi ${invoiceId} — IOM ITB`,
    html: renderInvoiceHtml({
      title: 'Invoice Donasi',
      recipientLabel: 'donasi',
      recipientName: donationDto.name,
      rows,
      grossAmount: donationDto.getGrossAmount(),
      footer: 'Terima kasih atas kontribusi Anda untuk IOM ITB.',
    }),
    attachments: [logoAttachment()],
  };
};

module.exports = buildDonationInvoice;
