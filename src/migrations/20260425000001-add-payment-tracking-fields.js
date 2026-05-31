'use strict';

const addIfMissing = async (queryInterface, table, column, def) => {
  const desc = await queryInterface.describeTable(table);
  if (!desc[column]) await queryInterface.addColumn(table, column, def);
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await addIfMissing(queryInterface, 'Transactions', 'paidAt', { type: Sequelize.DATE, allowNull: true });
    await addIfMissing(queryInterface, 'Transactions', 'paymentType', { type: Sequelize.STRING, allowNull: true });
    await addIfMissing(queryInterface, 'Transactions', 'vaNumber', { type: Sequelize.STRING, allowNull: true });
    await addIfMissing(queryInterface, 'Transactions', 'fraudStatus', { type: Sequelize.STRING, allowNull: true });
    await addIfMissing(queryInterface, 'Transactions', 'expiredAt', { type: Sequelize.DATE, allowNull: true });
    await addIfMissing(queryInterface, 'Transactions', 'rawNotification', { type: Sequelize.JSON, allowNull: true });
    await addIfMissing(queryInterface, 'Transactions', 'stockDeducted', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });
    await addIfMissing(queryInterface, 'Transactions', 'currency', { type: Sequelize.STRING(3), allowNull: false, defaultValue: 'IDR' });

    await addIfMissing(queryInterface, 'Donations', 'paidAt', { type: Sequelize.DATE, allowNull: true });
    await addIfMissing(queryInterface, 'Donations', 'paymentType', { type: Sequelize.STRING, allowNull: true });
    await addIfMissing(queryInterface, 'Donations', 'vaNumber', { type: Sequelize.STRING, allowNull: true });
    await addIfMissing(queryInterface, 'Donations', 'fraudStatus', { type: Sequelize.STRING, allowNull: true });
    await addIfMissing(queryInterface, 'Donations', 'rawNotification', { type: Sequelize.JSON, allowNull: true });
    await addIfMissing(queryInterface, 'Donations', 'currency', { type: Sequelize.STRING(3), allowNull: false, defaultValue: 'IDR' });
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
