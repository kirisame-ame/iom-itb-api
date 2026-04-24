'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeColumn('Donations', 'midtrans_order_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Donations', 'midtrans_order_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
