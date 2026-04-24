'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      UPDATE "Donations"
      SET "midtransOrderId" = "midtrans_order_id"
      WHERE "midtransOrderId" IS NULL
        AND "midtrans_order_id" IS NOT NULL
    `).catch(async () => {
      await queryInterface.sequelize.query(`
        UPDATE \`Donations\`
        SET \`midtransOrderId\` = \`midtrans_order_id\`
        WHERE \`midtransOrderId\` IS NULL
          AND \`midtrans_order_id\` IS NOT NULL
      `);
    });
  },

  down: async () => {
    // No-op: keeping backfilled data is safe.
  },
};
