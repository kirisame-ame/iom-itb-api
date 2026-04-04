'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Kemitraan extends Model {
    static associate(models) {
      this.hasMany(models.KegiatanKemitraan, {
        foreignKey: 'kemitraanId',
        as: 'kegiatan'
      });
    }
  }
  
  Kemitraan.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mou: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Kemitraan',
    tableName: 'Kemitraan',
    timestamps: true,
  });
  
  return Kemitraan;
};