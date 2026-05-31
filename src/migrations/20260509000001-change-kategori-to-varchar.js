'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Merchandises', 'kategori', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Merchandises', 'kategori', {
      type: Sequelize.ENUM('Stiker', 'Busana', 'ATK'),
      allowNull: true,
    });
  },
};
