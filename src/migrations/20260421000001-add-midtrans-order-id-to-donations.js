'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Donations', 'midtrans_order_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Donations', 'midtrans_order_id');
  },
};
