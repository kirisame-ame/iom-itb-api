'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Transactions', 'paidAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Transactions', 'paymentType', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Transactions', 'vaNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Transactions', 'fraudStatus', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Transactions', 'expiredAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Transactions', 'rawNotification', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Transactions', 'stockDeducted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('Transactions', 'currency', {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: 'IDR',
    });

    await queryInterface.addColumn('Donations', 'paidAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Donations', 'paymentType', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Donations', 'vaNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Donations', 'fraudStatus', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Donations', 'rawNotification', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Donations', 'currency', {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: 'IDR',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Donations', 'currency');
    await queryInterface.removeColumn('Donations', 'rawNotification');
    await queryInterface.removeColumn('Donations', 'fraudStatus');
    await queryInterface.removeColumn('Donations', 'vaNumber');
    await queryInterface.removeColumn('Donations', 'paymentType');
    await queryInterface.removeColumn('Donations', 'paidAt');

    await queryInterface.removeColumn('Transactions', 'currency');
    await queryInterface.removeColumn('Transactions', 'stockDeducted');
    await queryInterface.removeColumn('Transactions', 'rawNotification');
    await queryInterface.removeColumn('Transactions', 'expiredAt');
    await queryInterface.removeColumn('Transactions', 'fraudStatus');
    await queryInterface.removeColumn('Transactions', 'vaNumber');
    await queryInterface.removeColumn('Transactions', 'paymentType');
    await queryInterface.removeColumn('Transactions', 'paidAt');
  },
};
