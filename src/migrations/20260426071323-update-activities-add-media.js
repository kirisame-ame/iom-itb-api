'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ubah description jadi LONGTEXT
    await queryInterface.changeColumn('Activities', 'description', {
      type: Sequelize.TEXT('long'),
      allowNull: true
    });

    // Tambah kolom status
    await queryInterface.addColumn('Activities', 'status', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'published'
    });

    // Buat tabel ActivityMedia
    await queryInterface.createTable('ActivityMedia', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      activity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Activities', key: 'id' },
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      value: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      caption: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Activities', 'status');
    await queryInterface.changeColumn('Activities', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.dropTable('ActivityMedia');
  }
};