'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Faculties', 'kodeUnik', {
      type: Sequelize.STRING(3),
      allowNull: true,
    });
    await queryInterface.addColumn('Faculties', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Faculties', 'kodeUnik');
    await queryInterface.removeColumn('Faculties', 'isActive');
  },
};
