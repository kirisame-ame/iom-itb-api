'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Faculties extends Model {
    static associate(models) {
      this.hasMany(models.Donations, {
        foreignKey: 'facultyId',
        as: 'donations',
      });
    }
  }

  Faculties.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    kodeUnik: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'Faculties',
    tableName: 'Faculties',
  });

  return Faculties;
};
