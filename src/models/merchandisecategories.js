'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MerchandiseCategories extends Model {}

  MerchandiseCategories.init({
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
  }, {
    sequelize,
    modelName: 'MerchandiseCategories',
    tableName: 'MerchandiseCategories',
  });

  return MerchandiseCategories;
};
