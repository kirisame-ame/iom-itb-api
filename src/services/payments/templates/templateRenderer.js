const { EmailTemplate } = require('../../../models');

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const replaceVariables = (template, data) => {
  return String(template || '').replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    return escapeHtml(data[key] ?? '');
  });
};

const textToHtml = (text) => {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim()
      ? `<p style="margin:0 0 12px;">${line}</p>`
      : '<br />'
    )
    .join('');
};

const getRenderedEmailTemplate = async (key, data, fallback) => {
  const template = await EmailTemplate.findOne({
    where: { key, isActive: true },
  });

  const subject = template?.subject || fallback.subject;
  const body = template?.body || fallback.body;

  return {
    subject: replaceVariables(subject, data),
    bodyHtml: textToHtml(replaceVariables(body, data)),
  };
};

module.exports = {
  getRenderedEmailTemplate,
  replaceVariables,
};