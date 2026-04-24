'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class KegiatanKemitraan extends Model {
    static associate(models) {
      this.belongsTo(models.Kemitraan, {
        foreignKey: 'kemitraanId',
        as: 'Kemitraan'
      });
    }
  }

  KegiatanKemitraan.init({
    kemitraanId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    date: DataTypes.DATE,
    description: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'KegiatanKemitraan',
    tableName: 'KegiatanKemitraans',
  });
  return KegiatanKemitraan;
};