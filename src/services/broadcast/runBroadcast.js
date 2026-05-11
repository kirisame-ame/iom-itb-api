const { BroadcastSettings, BroadcastLogs } = require('../../models');
const sendWhatsApp = require('../../utils/whatsapp');
const sendEmail = require('../../utils/mailer');
const getBroadcastRecipients = require('./getBroadcastRecipients');

const buildMessage = (template, name, jenisIuran) => {
  return template
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{jenisIuran\}\}/g, jenisIuran);
};

const runBroadcast = async (settingId) => {
  const setting = await BroadcastSettings.findByPk(settingId);
  if (!setting) throw new Error('Broadcast setting not found');

  const sentAt = new Date();
  const logs = [];

  // Use recipients from setting; if empty, fall back to all users with Biodates
  let recipients = setting.recipients || [];
  if (!recipients.length) {
    recipients = await getBroadcastRecipients();
  }

  for (const recipient of recipients) {
    const { name, noWhatsapp, email } = recipient;
    // Ensure we don't send to users with completely empty contacts
    if (!noWhatsapp && !email) continue;

    const message = buildMessage(setting.template, name || 'Anggota', setting.jenisIuran);
    const idempotencyKey = `broadcast-${settingId}-${sentAt.toISOString().slice(0, 10)}-${noWhatsapp || email}`;

    let waStatus = 'skipped';
    let emailStatus = 'skipped';
    let waError = null;
    let emailError = null;

    if (noWhatsapp) {
      try {
        await sendWhatsApp(noWhatsapp, message, idempotencyKey);
        waStatus = 'sent';
      } catch (err) {
        waStatus = 'failed';
        waError = err.message;
      }
    }

    if (email) {
      try {
        await sendEmail({
          to: email,
          subject: `Pengingat ${setting.jenisIuran} - IOM ITB`,
          html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
        });
        emailStatus = 'sent';
      } catch (err) {
        emailStatus = 'failed';
        emailError = err.message;
      }
    }

    logs.push({
      broadcastSettingId: settingId,
      broadcastName: setting.name,
      recipientName: name || null,
      waNumber: noWhatsapp || null,
      email: email || null,
      waStatus,
      emailStatus,
      waError,
      emailError,
      sentAt,
    });
  }

  await BroadcastLogs.bulkCreate(logs);
  await setting.update({ lastRunAt: sentAt });

  return { sent: logs.length, logs };
};

module.exports = runBroadcast;
