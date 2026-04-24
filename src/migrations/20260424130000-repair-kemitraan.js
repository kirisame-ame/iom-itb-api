'use strict';

/**
 * Idempotent repair: bring the existing `Kemitraan` table into line with the
 * current Kemitraan model (fields: name, description, image, mou).
 * Renames `title` -> `name` if the legacy column is present.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Kemitraan');

    if (!table.name) {
      if (table.title) {
        await queryInterface.renameColumn('Kemitraan', 'title', 'name');
      } else {
        await queryInterface.addColumn('Kemitraan', 'name', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        });
      }
    }

    const after = await queryInterface.describeTable('Kemitraan');

    if (!after.description) {
      await queryInterface.addColumn('Kemitraan', 'description', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
    if (!after.image) {
      await queryInterface.addColumn('Kemitraan', 'image', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!after.mou) {
      await queryInterface.addColumn('Kemitraan', 'mou', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async () => {
    // No-op: forward-only repair.
  },
};
