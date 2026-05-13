const { BroadcastRecipients } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const {
  toBroadcastRecipientDto,
  toBroadcastRecipientUpdatePayload,
} = require('../../dtos/broadcast');

const updateBroadcastRecipient = async (id, body) => {
  const recipient = await BroadcastRecipients.findByPk(id);
  if (!recipient) {
    throw new BaseError({
      status: StatusCodes.NOT_FOUND,
      message: 'Penerima tidak ditemukan',
    });
  }

  const payload = toBroadcastRecipientUpdatePayload(body);
  await recipient.update(payload);

  return toBroadcastRecipientDto(recipient);
};

module.exports = updateBroadcastRecipient;
