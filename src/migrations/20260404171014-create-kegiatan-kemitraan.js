'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('KegiatanKemitraans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kemitraanId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Kemitraans',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: { type: Sequelize.STRING },
      subtitle: { type: Sequelize.STRING },
      date: { type: Sequelize.DATE },
      description: { type: Sequelize.TEXT },
      image: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('KegiatanKemitraans');
  }
};