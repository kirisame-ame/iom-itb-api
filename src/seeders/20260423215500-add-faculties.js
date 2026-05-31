'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const faculties = [
      { name: 'FMIPA', kodeUnik: '160', isActive: true, createdAt: now, updatedAt: now },
      { name: 'SITH', kodeUnik: '161', isActive: true, createdAt: now, updatedAt: now },
      { name: 'SF', kodeUnik: '162', isActive: true, createdAt: now, updatedAt: now },
      { name: 'FITB', kodeUnik: '163', isActive: true, createdAt: now, updatedAt: now },
      { name: 'FTTM', kodeUnik: '164', isActive: true, createdAt: now, updatedAt: now },
      { name: 'STEI', kodeUnik: '165', isActive: true, createdAt: now, updatedAt: now },
      { name: 'FTSL', kodeUnik: '166', isActive: true, createdAt: now, updatedAt: now },
      { name: 'FTI', kodeUnik: '167', isActive: true, createdAt: now, updatedAt: now },
      { name: 'FSRD', kodeUnik: '168', isActive: true, createdAt: now, updatedAt: now },
      { name: 'FTMD', kodeUnik: '169', isActive: true, createdAt: now, updatedAt: now },
      { name: 'SBM', kodeUnik: '190', isActive: true, createdAt: now, updatedAt: now },
      { name: 'SAPPK', kodeUnik: '199', isActive: true, createdAt: now, updatedAt: now },
    ];

    await queryInterface.bulkInsert('Faculties', faculties, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Faculties', null, {});
  },
};
