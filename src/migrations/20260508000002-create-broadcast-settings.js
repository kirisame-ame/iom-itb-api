'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BroadcastSettings', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      scheduleDay: { type: Sequelize.INTEGER, allowNull: false, comment: '1-31 for monthly/3months, 1-7 for weekly (1=Mon)' },
      scheduleInterval: { type: Sequelize.ENUM('weekly', 'monthly', '3months'), allowNull: false },
      jenisIuran: { type: Sequelize.STRING, allowNull: false },
      template: { type: Sequelize.TEXT, allowNull: false },
      recipients: { type: Sequelize.JSON, allowNull: false, defaultValue: '[]' },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      lastRunAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('BroadcastSettings');
  },
};
