'use strict';

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    await queryInterface.bulkInsert('Faculties', [
      { name: 'FMIPA',  kodeUnik: '001', isActive: true, createdAt: now, updatedAt: now },
      { name: 'FITB',   kodeUnik: '002', isActive: true, createdAt: now, updatedAt: now },
      { name: 'FTI',    kodeUnik: '003', isActive: true, createdAt: now, updatedAt: now },
      { name: 'FTTM',   kodeUnik: '004', isActive: true, createdAt: now, updatedAt: now },
      { name: 'FTMD',   kodeUnik: '005', isActive: true, createdAt: now, updatedAt: now },
      { name: 'FTSL',   kodeUnik: '006', isActive: true, createdAt: now, updatedAt: now },
      { name: 'SAPPK',  kodeUnik: '007', isActive: true, createdAt: now, updatedAt: now },
      { name: 'STEI',   kodeUnik: '008', isActive: true, createdAt: now, updatedAt: now },
      { name: 'SBM',    kodeUnik: '009', isActive: true, createdAt: now, updatedAt: now },
      { name: 'SF',     kodeUnik: '010', isActive: true, createdAt: now, updatedAt: now },
      { name: 'SITH',   kodeUnik: '011', isActive: true, createdAt: now, updatedAt: now },
      { name: 'FSRD',   kodeUnik: '012', isActive: true, createdAt: now, updatedAt: now },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Faculties', null, {});
  },
};
