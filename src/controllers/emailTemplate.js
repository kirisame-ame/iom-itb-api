const { EmailTemplate } = require('../models');
const { getRenderedEmailTemplate } = require('../services/payments/templates/templateRenderer');
const { wrapPengajuanEmailHtml, logoAttachment, logoWhiteAttachment } = require('../utils/emailBantuan');
const sendEmail = require('../utils/mailer');
const sendWhatsApp = require('../utils/whatsapp');
const { normalizeWhatsAppRecipient } = require('../utils/whatsappPhone');
const { extractRoles } = require('../middlewares/requireRoles');
const { ROLES } = require('../utils/roles');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FINANCE_TEMPLATE_KEYS = new Set([
  'donation_payment_confirmation',
  'transaction_payment_confirmation',
  'donation_payment_whatsapp',
  'transaction_payment_whatsapp',
]);

const FINANCE_TEMPLATE_PATTERNS = [
  /donation/i,
  /donasi/i,
  /payment/i,
  /pembayaran/i,
  /transaction/i,
  /transaksi/i,
  /merchandise/i,
];

const canAccessAllTemplates = (roles = []) =>
  roles.some((role) => [
    ROLES.ADMIN,
    ROLES.PENGURUS_BIDANG_1,
    ROLES.SEKRETARIAT,
  ].includes(role));

const isFinanceTemplate = (template = {}) => {
  if (FINANCE_TEMPLATE_KEYS.has(template.key)) return true;
  const haystack = [template.key, template.title, template.subject].filter(Boolean).join(' ');
  return FINANCE_TEMPLATE_PATTERNS.some((pattern) => pattern.test(haystack));
};

const canAccessTemplate = (template, roles) => (
  canAccessAllTemplates(roles)
  || (roles.includes(ROLES.BENDAHARA) && isFinanceTemplate(template))
);

const getRequestRoles = (req, res) => extractRoles(req.user || res.locals.user);

const getTemplates = async (req, res) => {
  try {
    const { channel } = req.query;
    const roles = getRequestRoles(req, res);
    const where = {};
    if (channel) where.channel = channel;

    const templates = await EmailTemplate.findAll({
      where,
      order: [['channel', 'ASC'], ['id', 'ASC']],
    });

    return res.json(templates.filter((template) => canAccessTemplate(template, roles)));
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const updateTemplate = async (req, res) => {
  try {
    const { key } = req.params;
    const { subject, body } = req.body;
    const roles = getRequestRoles(req, res);

    const template = await EmailTemplate.findOne({ where: { key } });

    if (!template) {
      return res.status(404).json({ message: 'Template tidak ditemukan' });
    }

    if (!canAccessTemplate(template, roles)) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke template ini' });
    }

    const updateData = {};

    if (body !== undefined) updateData.body = body;

    if (template.channel === 'email' && subject !== undefined) {
      updateData.subject = subject;
    }

    await template.update(updateData);

    return res.json({
      message: 'Template berhasil diupdate',
      data: template,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const testSendTemplate = async (req, res) => {
  try {
    const { key } = req.params;
    const { recipient, variables = {} } = req.body;
    const roles = getRequestRoles(req, res);

    if (!recipient) {
      return res.status(400).json({ message: 'Recipient wajib diisi' });
    }

    const template = await EmailTemplate.findOne({ where: { key } });
    if (!template) {
      return res.status(404).json({ message: 'Template tidak ditemukan' });
    }

    if (!canAccessTemplate(template, roles)) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke template ini' });
    }

    if (template.channel === 'email') {
      if (!EMAIL_RE.test(recipient)) {
        return res.status(400).json({ message: 'Format alamat email tidak valid' });
      }

      const { subject, bodyHtml } = await getRenderedEmailTemplate(key, variables, {
        subject: template.subject || 'Test Email',
        body: template.body,
      });

      await sendEmail({
        to: recipient,
        subject: `[TEST ${Date.now()}] ${subject}`,
        html: wrapPengajuanEmailHtml(bodyHtml, template.title),
        attachments: [logoAttachment(), logoWhiteAttachment()],
      });
    } else if (template.channel === 'whatsapp') {
      const phoneResult = normalizeWhatsAppRecipient(recipient, {
        defaultCountryCode: process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || '62',
      });
      if (!phoneResult.isValid) {
        return res.status(400).json({
          message: 'Format nomor WhatsApp tidak valid. Gunakan format internasional, contoh: 628123456789',
        });
      }

      const message = template.body.replace(/{{\s*(\w+)\s*}}/g, (_, k) => variables[k] ?? `{{${k}}}`);
      await sendWhatsApp(phoneResult.normalized, message, `test-${key}-${Date.now()}`, `test-${key}`);
    }

    return res.json({ message: 'Pesan test berhasil dikirim' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  getTemplates,
  updateTemplate,
  testSendTemplate,
};
