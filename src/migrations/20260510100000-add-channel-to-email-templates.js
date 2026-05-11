'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('EmailTemplates', 'channel', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'email',
    });

    await queryInterface.changeColumn('EmailTemplates', 'subject', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('EmailTemplates', 'channel');

    await queryInterface.changeColumn('EmailTemplates', 'subject', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
