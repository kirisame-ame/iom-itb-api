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

const sendEmail = async ({ to, subject, html }) => {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) return;
    try {
        const info = await transporter.sendMail({
            from: `"IOM ITB" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`[Email] Sent to ${to}: ${info.messageId}`);
    } catch (err) {
        console.error('[Email] Failed to send:', err.message);
    }
};

module.exports = sendEmail;