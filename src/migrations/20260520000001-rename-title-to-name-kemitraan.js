'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const desc = await queryInterface.describeTable('Kemitraan');

    if (!desc.name) {
      await queryInterface.addColumn('Kemitraan', 'name', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      });

      await queryInterface.sequelize.query(
        'UPDATE `Kemitraan` SET `name` = `title` WHERE `name` = \'\''
      );

      await queryInterface.changeColumn('Kemitraan', 'name', {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }

    if (desc.title) {
      await queryInterface.changeColumn('Kemitraan', 'title', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const desc = await queryInterface.describeTable('Kemitraan');

    if (desc.name) {
      await queryInterface.removeColumn('Kemitraan', 'name');
    }

    if (desc.title) {
      await queryInterface.changeColumn('Kemitraan', 'title', {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }
  },
};
