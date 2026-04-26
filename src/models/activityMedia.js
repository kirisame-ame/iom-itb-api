'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ActivityMedia extends Model {
    static associate(models) {
      ActivityMedia.belongsTo(models.Activities, {
        foreignKey: 'activity_id',
        as: 'activity'
      });
    }
  }

  ActivityMedia.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    caption: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ActivityMedia',
    tableName: 'ActivityMedia',
  });

  return ActivityMedia;
};