const { BroadcastRecipients } = require('../../models');
const { toBroadcastRecipientDto } = require('../../dtos/broadcast');

const getBroadcastRecipients = async () => {
  const rows = await BroadcastRecipients.findAll({
    order: [['name', 'ASC']],
  });
  return rows.map(toBroadcastRecipientDto);
};

module.exports = getBroadcastRecipients;
