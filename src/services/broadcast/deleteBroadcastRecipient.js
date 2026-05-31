const { BroadcastRecipients } = require('../../models');

const deleteBroadcastRecipient = async (id) => {
  const recipient = await BroadcastRecipients.findByPk(id);
  if (!recipient) throw new Error('Penerima tidak ditemukan.');
  await recipient.destroy();
  return { id };
};

module.exports = deleteBroadcastRecipient;
