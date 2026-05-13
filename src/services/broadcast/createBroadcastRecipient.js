const { BroadcastRecipients } = require('../../models');
const {
  toBroadcastRecipientCreatePayload,
  toBroadcastRecipientDto,
} = require('../../dtos/broadcast');

const createBroadcastRecipient = async (body) => {
  const payload = toBroadcastRecipientCreatePayload(body);
  const recipient = await BroadcastRecipients.create(payload);

  return toBroadcastRecipientDto(recipient);
};

module.exports = createBroadcastRecipient;
