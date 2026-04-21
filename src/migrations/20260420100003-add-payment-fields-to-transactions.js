'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Transactions', 'payment', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Transactions', 'paymentMethod', {
      type: Sequelize.ENUM('manual', 'midtrans'),
      allowNull: false,
      defaultValue: 'manual',
    });
    await queryInterface.addColumn('Transactions', 'paymentStatus', {
      type: Sequelize.ENUM('pending', 'settlement', 'expired', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    });
    await queryInterface.addColumn('Transactions', 'midtransOrderId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('Transactions', 'midtransTransactionId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Transactions', 'grossAmount', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Transactions', 'grossAmount');
    await queryInterface.removeColumn('Transactions', 'midtransTransactionId');
    await queryInterface.removeColumn('Transactions', 'midtransOrderId');
    await queryInterface.removeColumn('Transactions', 'paymentStatus');
    await queryInterface.removeColumn('Transactions', 'paymentMethod');
    await queryInterface.changeColumn('Transactions', 'payment', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
