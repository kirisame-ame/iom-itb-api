'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Faculties');

    if (!table.kodeUnik) {
      await queryInterface.addColumn('Faculties', 'kodeUnik', {
        type: Sequelize.STRING(3),
        allowNull: true,
      });
    }

    if (!table.isActive) {
      await queryInterface.addColumn('Faculties', 'isActive', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }
  },
  down: async (queryInterface) => {
    const table = await queryInterface.describeTable('Faculties');
    if (table.kodeUnik) await queryInterface.removeColumn('Faculties', 'kodeUnik');
    if (table.isActive) await queryInterface.removeColumn('Faculties', 'isActive');
  },
};
