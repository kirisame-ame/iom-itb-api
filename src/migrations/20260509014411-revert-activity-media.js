'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.dropTable('ActivityMedia');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ActivityMedia', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      activity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Activities', key: 'id' },
        onDelete: 'CASCADE'
      },
      type: { type: Sequelize.STRING(10), allowNull: false },
      value: { type: Sequelize.STRING(255), allowNull: false },
      order: { type: Sequelize.INTEGER, defaultValue: 0 },
      caption: { type: Sequelize.STRING(255), allowNull: true },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });
  }
};