'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BroadcastLogs', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      broadcastSettingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'BroadcastSettings', key: 'id' },
        onDelete: 'CASCADE',
      },
      broadcastName: { type: Sequelize.STRING, allowNull: false },
      recipientName: { type: Sequelize.STRING, allowNull: true },
      waNumber: { type: Sequelize.STRING, allowNull: true },
      email: { type: Sequelize.STRING, allowNull: true },
      waStatus: { type: Sequelize.ENUM('sent', 'failed', 'skipped'), allowNull: false, defaultValue: 'skipped' },
      emailStatus: { type: Sequelize.ENUM('sent', 'failed', 'skipped'), allowNull: false, defaultValue: 'skipped' },
      waError: { type: Sequelize.TEXT, allowNull: true },
      emailError: { type: Sequelize.TEXT, allowNull: true },
      sentAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('BroadcastLogs');
  },
};
