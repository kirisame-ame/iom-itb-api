const { BroadcastRecipients } = require('../../models');

const getBroadcastRecipients = async () => {
  const rows = await BroadcastRecipients.findAll({
    order: [['name', 'ASC']],
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    nim: r.nim,
    noWhatsapp: r.noWhatsapp,
    email: r.email,
  }));
};

module.exports = getBroadcastRecipients;
