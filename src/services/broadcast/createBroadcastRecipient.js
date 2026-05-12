const { BroadcastRecipients } = require('../../models');

const normalize = (v) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
};

const createBroadcastRecipient = async (body) => {
  const name = normalize(body.name);
  if (!name) throw new Error('Nama wajib diisi.');
  const noWhatsapp = normalize(body.noWhatsapp);
  const email = normalize(body.email);
  if (!noWhatsapp && !email) throw new Error('Minimal salah satu dari No. WhatsApp atau Email wajib diisi.');

  return BroadcastRecipients.create({
    name,
    nim: normalize(body.nim),
    noWhatsapp,
    email,
  });
};

module.exports = createBroadcastRecipient;
