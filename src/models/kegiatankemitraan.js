'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class KegiatanKemitraan extends Model {
    static associate(models) {
      this.belongsTo(models.Kemitraan, {
        foreignKey: 'kemitraanId',
        as: 'kemitraan',
      });
    }
  }

  KegiatanKemitraan.init(
    {
      kemitraanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'planned',
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'KegiatanKemitraan',
      tableName: 'KegiatanKemitraans',
    }
  );
  return KegiatanKemitraan;
};
