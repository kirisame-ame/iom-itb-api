'use strict';

/**
 * Repair migration: aligns the existing Kemitraans table with the current
 * Kemitraan model. Idempotent — safe to run regardless of prior state.
 *
 * Handles the case where prod's Kemitraans table was created from the older
 * `Kemitraan` schema (title/image/mou) and needs to be reshaped to
 * (name/logo/file + new contact/date/status/options fields).
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Kemitraans');

    // name: rename from `title` if present, otherwise add
    if (!table.name) {
      if (table.title) {
        await queryInterface.renameColumn('Kemitraans', 'title', 'name');
      } else {
        await queryInterface.addColumn('Kemitraans', 'name', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        });
      }
    }

    // logo: rename from `image` if present, otherwise add
    if (!table.logo) {
      if (table.image) {
        await queryInterface.renameColumn('Kemitraans', 'image', 'logo');
      } else {
        await queryInterface.addColumn('Kemitraans', 'logo', {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }
    }

    // file: rename from `mou` if present, otherwise add
    if (!table.file) {
      if (table.mou) {
        await queryInterface.renameColumn('Kemitraans', 'mou', 'file');
      } else {
        await queryInterface.addColumn('Kemitraans', 'file', {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }
    }

    // Re-describe after potential renames before adding the rest
    const after = await queryInterface.describeTable('Kemitraans');

    const addIfMissing = async (col, spec) => {
      if (!after[col]) await queryInterface.addColumn('Kemitraans', col, spec);
    };

    await addIfMissing('type', { type: Sequelize.STRING, allowNull: true });
    await addIfMissing('description', { type: Sequelize.TEXT, allowNull: true });
    await addIfMissing('contactName', { type: Sequelize.STRING, allowNull: true });
    await addIfMissing('contactEmail', { type: Sequelize.STRING, allowNull: true });
    await addIfMissing('contactPhone', { type: Sequelize.STRING, allowNull: true });
    await addIfMissing('website', { type: Sequelize.STRING, allowNull: true });
    await addIfMissing('startDate', { type: Sequelize.DATEONLY, allowNull: true });
    await addIfMissing('endDate', { type: Sequelize.DATEONLY, allowNull: true });
    await addIfMissing('status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'active',
    });
    await addIfMissing('options', { type: Sequelize.JSON, allowNull: true });
  },

  down: async () => {
    // No-op: this is a forward-only repair migration.
  },
};
