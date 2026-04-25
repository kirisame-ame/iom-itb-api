const { Merchandises } = require('../../../models');
const {
  renderInvoiceHtml,
  formatDate,
  formatIDR,
  logoAttachment,
  buildOrderStatusUrl,
} = require('./emailLayout');
const { TransactionDto } = require('../../../dtos/payments');

/**
 * @typedef {import('../../../dtos/payments').TransactionDto} TransactionDto
 *
 * @typedef {Object} BuiltInvoice
 * @property {string}   to
 * @property {string}   subject
 * @property {string}   html
 * @property {Array}    attachments
 */

/**
 * @param {TransactionDto} trx
 * @returns {Promise<BuiltInvoice>}
 */
const buildTransactionInvoice = async (trx) => {
  const transactionDto = trx instanceof TransactionDto ? trx : new TransactionDto(trx);
  let merchName = transactionDto.merchandiseName;
  let price = 0;
  const merchandise = await Merchandises.findByPk(transactionDto.merchandiseId);
  if (merchandise) {
    merchName = merchandise.name;
    price = Number(merchandise.price);
  }
  merchName = merchName || `Merchandise #${transactionDto.merchandiseId}`;

  const invoiceCode = transactionDto.getOrderCode();
  const gross = transactionDto.getGrossAmount(price);
  const rows = transactionDto.toInvoiceRows({
    merchandiseName: merchName,
    unitPrice: formatIDR(price),
  }).map((row) => ({
    ...row,
    value: row.label === 'Tanggal' ? formatDate(row.value) : row.value,
  }));

  return {
    to: transactionDto.email,
    subject: `Invoice Pembelian ${invoiceCode} — IOM ITB`,
    html: renderInvoiceHtml({
      title: 'Invoice Pembelian',
      recipientLabel: 'pembayaran pembelian',
      recipientName: transactionDto.username,
      rows,
      grossAmount: gross,
      footer: 'Pesanan Anda akan segera diproses dan dikirim sesuai alamat di atas.',
      orderStatusUrl: buildOrderStatusUrl(transactionDto.id),
    }),
    attachments: [logoAttachment()],
  };
};

module.exports = buildTransactionInvoice;
