const { sequelize } = require('../../models');

/**
 * Fetches the default list of broadcast recipients (all users with associated biodata).
 * @returns {Promise<Array<{id: string, name: string, noWhatsapp: string | null, email: string | null}>>}
 */
const getBroadcastRecipients = async () => {
  const [rows] = await sequelize.query(`
    SELECT u.id, u.email,
           CONCAT(COALESCE(b.firstName,''), ' ', COALESCE(b.lastName,'')) AS name,
           b.phone AS noWhatsapp
    FROM Users u
    LEFT JOIN Biodatas b ON u.biodateId = b.id
    ORDER BY name ASC
  `);

  return rows.map((r) => ({
    id: r.id,
    name: r.name?.trim() || '-',
    noWhatsapp: r.noWhatsapp || null,
    email: r.email || null,
  }));
};

module.exports = getBroadcastRecipients;
