'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Merchandises', 'kategori', {
      type: Sequelize.ENUM('Stiker', 'Busana', 'ATK'),
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Merchandises', 'kategori');
  },
};
