const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * @typedef {Object} MailAttachment
 * @property {string} filename
 * @property {string|Buffer} [path]
 * @property {string|Buffer} [content]
 * @property {string} [cid]
 * @property {string} [contentType]
 */

/**
 * @typedef {Object} SendEmailInput
 * @property {string|string[]} to
 * @property {string|string[]} [cc]
 * @property {string|string[]} [bcc]
 * @property {string} subject
 * @property {string} html
 * @property {string} [text]
 * @property {MailAttachment[]} [attachments]
 */

/**
 * @param {SendEmailInput} input
 */
const sendEmail = async ({ to, cc, bcc, subject, html, text, attachments }) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) return;
  try {
    const info = await transporter.sendMail({
      from: `"IOM ITB" <${process.env.MAIL_USER}>`,
      to,
      cc,
      bcc,
      subject,
      html,
      text,
      attachments,
    });
    console.log(`[Email] Sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error('[Email] Failed to send:', err.message);
  }
};

module.exports = sendEmail;
