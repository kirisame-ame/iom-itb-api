'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tags', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });

    await queryInterface.createTable('ActivityTags', {
      activity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Activities', key: 'id' },
        onDelete: 'CASCADE'
      },
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Tags', key: 'id' },
        onDelete: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });

    // Composite primary key
    await queryInterface.addConstraint('ActivityTags', {
      fields: ['activity_id', 'tag_id'],
      type: 'primary key',
      name: 'pk_activity_tags'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('ActivityTags');
    await queryInterface.dropTable('Tags');
  }
};