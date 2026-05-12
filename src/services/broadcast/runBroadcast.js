const { BroadcastSettings, BroadcastLogs } = require('../../models');
const sendWhatsApp = require('../../utils/whatsapp');
const sendEmail = require('../../utils/mailer');
const getBroadcastRecipients = require('./getBroadcastRecipients');

const buildMessage = (template, name, jenisIuran) => {
  return template
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{jenisIuran\}\}/g, jenisIuran);
};

// External WA API expects 8-15 digits, no '+', leading '0' converted to ID country code.
const normalizeWa = (raw) => {
  if (!raw) return null;
  let digits = String(raw).replace(/\D+/g, '');
  if (!digits) return null;
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`;
  if (digits.length < 8 || digits.length > 15) return null;
  return digits;
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
    const waNormalized = normalizeWa(noWhatsapp);
    // Ensure we don't send to users with completely empty contacts
    if (!waNormalized && !email) continue;

    const message = buildMessage(setting.template, name || 'Anggota', setting.jenisIuran);
    const idempotencyKey = `broadcast-${settingId}-${sentAt.toISOString().slice(0, 10)}-${waNormalized || email}`;
    const clientReference = `broadcast-setting-${settingId}`;

    let waStatus = 'skipped';
    let emailStatus = 'skipped';
    let waError = null;
    let emailError = null;

    if (waNormalized) {
      const result = await sendWhatsApp(waNormalized, message, idempotencyKey, clientReference);
      if (result && result.ok) {
        waStatus = 'sent';
      } else {
        waStatus = 'failed';
        waError = result?.reason
          ? `${result.reason}${result.status ? ` (${result.status})` : ''}${result.responseBody ? `: ${String(result.responseBody).slice(0, 300)}` : ''}`
          : 'UNKNOWN_ERROR';
      }
    } else if (noWhatsapp) {
      waStatus = 'failed';
      waError = 'INVALID_PHONE_FORMAT';
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
      waNumber: waNormalized || noWhatsapp || null,
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

  const sentCount = logs.filter((l) => l.waStatus === 'sent' || l.emailStatus === 'sent').length;
  return { sent: sentCount, attempted: logs.length, logs };
};

module.exports = runBroadcast;
