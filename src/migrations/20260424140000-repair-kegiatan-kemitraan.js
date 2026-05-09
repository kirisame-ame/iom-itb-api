'use strict';

/**
 * Idempotent repair: align KegiatanKemitraans table with the current model.
 * Legacy columns: title, subtitle, date.
 * Target columns: name, description, location, startDate, endDate, status, image.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('KegiatanKemitraans');

    if (!table.name) {
      if (table.title) {
        await queryInterface.renameColumn('KegiatanKemitraans', 'title', 'name');
      } else {
        await queryInterface.addColumn('KegiatanKemitraans', 'name', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        });
      }
    }

    if (!table.startDate) {
      if (table.date) {
        await queryInterface.renameColumn('KegiatanKemitraans', 'date', 'startDate');
      } else {
        await queryInterface.addColumn('KegiatanKemitraans', 'startDate', {
          type: Sequelize.DATE,
          allowNull: true,
        });
      }
    }

    const after = await queryInterface.describeTable('KegiatanKemitraans');

    if (!after.endDate) {
      await queryInterface.addColumn('KegiatanKemitraans', 'endDate', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    if (!after.location) {
      await queryInterface.addColumn('KegiatanKemitraans', 'location', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!after.status) {
      await queryInterface.addColumn('KegiatanKemitraans', 'status', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'planned',
      });
    }
  },

  down: async () => {
    // No-op: forward-only repair.
  },
};
