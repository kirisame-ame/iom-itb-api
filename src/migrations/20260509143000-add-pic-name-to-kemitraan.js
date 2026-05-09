'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Kemitraan');

    if (!table.picName) {
      await queryInterface.addColumn('Kemitraan', 'picName', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!table.picPhone) {
      await queryInterface.addColumn('Kemitraan', 'picPhone', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface) => {
    const table = await queryInterface.describeTable('Kemitraan');

    if (table.picPhone) {
      await queryInterface.removeColumn('Kemitraan', 'picPhone');
    }

    if (table.picName) {
      await queryInterface.removeColumn('Kemitraan', 'picName');
    }
  },
};
