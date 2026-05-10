'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BroadcastLogs extends Model {
    static associate(models) {
      BroadcastLogs.belongsTo(models.BroadcastSettings, {
        foreignKey: 'broadcastSettingId',
        as: 'setting',
      });
    }
  }

  BroadcastLogs.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    broadcastSettingId: { type: DataTypes.INTEGER, allowNull: false },
    broadcastName: { type: DataTypes.STRING, allowNull: false },
    recipientName: { type: DataTypes.STRING, allowNull: true },
    waNumber: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    waStatus: { type: DataTypes.ENUM('sent', 'failed', 'skipped'), allowNull: false, defaultValue: 'skipped' },
    emailStatus: { type: DataTypes.ENUM('sent', 'failed', 'skipped'), allowNull: false, defaultValue: 'skipped' },
    waError: { type: DataTypes.TEXT, allowNull: true },
    emailError: { type: DataTypes.TEXT, allowNull: true },
    sentAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    modelName: 'BroadcastLogs',
    tableName: 'BroadcastLogs',
  });

  return BroadcastLogs;
};
