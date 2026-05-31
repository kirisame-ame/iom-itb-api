'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BroadcastSettings extends Model {
    static associate(models) {
      BroadcastSettings.hasMany(models.BroadcastLogs, {
        foreignKey: 'broadcastSettingId',
        as: 'logs',
      });
    }
  }

  BroadcastSettings.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    scheduleDay: { type: DataTypes.INTEGER, allowNull: false },
    scheduleInterval: { type: DataTypes.ENUM('weekly', 'monthly', '3months'), allowNull: false },
    jenisIuran: { type: DataTypes.STRING, allowNull: false },
    template: { type: DataTypes.TEXT, allowNull: false },
    recipients: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    lastRunAt: { type: DataTypes.DATE, allowNull: true },
  }, {
    sequelize,
    modelName: 'BroadcastSettings',
    tableName: 'BroadcastSettings',
  });

  return BroadcastSettings;
};
