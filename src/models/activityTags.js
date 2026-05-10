'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    static associate(models) {
      Tags.belongsToMany(models.Activities, {
        through: 'ActivityTags',
        foreignKey: 'tag_id',
        as: 'activities'
      });
    }
  }

  Tags.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  }, {
    sequelize,
    modelName: 'Tags',
    tableName: 'Tags',
  });

  return Tags;
};