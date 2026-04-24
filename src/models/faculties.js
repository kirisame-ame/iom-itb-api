'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Faculties extends Model {
    static associate(models) {}
  }

  Faculties.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    kodeUnik: { type: DataTypes.STRING(3), allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, {
    sequelize,
    modelName: 'Faculties',
    tableName: 'Faculties',
  });

  return Faculties;
};
