const nodemailer = require('nodemailer');

const host = process.env.EMAIL_HOST;
const port = Number(process.env.EMAIL_PORT || 587);
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!host || !user || !pass) {
  // eslint-disable-next-line no-console
  console.warn('[mailer] EMAIL_HOST / EMAIL_USER / EMAIL_PASS not fully set. Emails will fail until configured.');
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

const fromAddress = process.env.EMAIL_FROM || `IOM ITB <${user}>`;

const sendMail = async ({ to, cc, subject, html, text }) => {
  const recipients = Array.isArray(to) ? to.filter(Boolean) : [to].filter(Boolean);
  if (recipients.length === 0) throw new Error('sendMail: no recipients');

  return transporter.sendMail({
    from: fromAddress,
    to: recipients.join(', '),
    cc: cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : undefined,
    subject,
    html,
    text,
  });
};

module.exports = { transporter, sendMail };
