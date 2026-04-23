'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Donations', 'donationType', {
      type: Sequelize.ENUM(
        'iuran_sukarela',
        'kontribusi_anggota',
        'kontribusi_donatur',
        'pembelian_merchandise',
        'kontribusi_sukarela'
      ),
      allowNull: true,
    });
    await queryInterface.addColumn('Donations', 'facultyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Faculties', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('Donations', 'kodeUnik', {
      type: Sequelize.STRING(3),
      allowNull: true,
    });
    await queryInterface.addColumn('Donations', 'paymentMethod', {
      type: Sequelize.ENUM('manual', 'midtrans'),
      allowNull: false,
      defaultValue: 'manual',
    });
    await queryInterface.addColumn('Donations', 'paymentStatus', {
      type: Sequelize.ENUM('pending', 'settlement', 'expired', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    });
    await queryInterface.addColumn('Donations', 'midtransOrderId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('Donations', 'midtransTransactionId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Donations', 'grossAmount', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Donations', 'grossAmount');
    await queryInterface.removeColumn('Donations', 'midtransTransactionId');
    await queryInterface.removeColumn('Donations', 'midtransOrderId');
    await queryInterface.removeColumn('Donations', 'paymentStatus');
    await queryInterface.removeColumn('Donations', 'paymentMethod');
    await queryInterface.removeColumn('Donations', 'kodeUnik');
    await queryInterface.removeColumn('Donations', 'facultyId');
    await queryInterface.removeColumn('Donations', 'donationType');
  },
};
