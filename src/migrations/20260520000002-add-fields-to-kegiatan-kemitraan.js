'use strict';

const addIfMissing = async (queryInterface, table, column, def) => {
  const desc = await queryInterface.describeTable(table);
  if (!desc[column]) await queryInterface.addColumn(table, column, def);
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await addIfMissing(queryInterface, 'KegiatanKemitraans', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
    });

    await addIfMissing(queryInterface, 'KegiatanKemitraans', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await addIfMissing(queryInterface, 'KegiatanKemitraans', 'startDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await addIfMissing(queryInterface, 'KegiatanKemitraans', 'endDate', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await addIfMissing(queryInterface, 'KegiatanKemitraans', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'planned',
    });
  },

  down: async (queryInterface) => {
    const desc = await queryInterface.describeTable('KegiatanKemitraans');
    for (const col of ['status', 'endDate', 'startDate', 'location', 'name']) {
      if (desc[col]) await queryInterface.removeColumn('KegiatanKemitraans', col);
    }
  },
};
