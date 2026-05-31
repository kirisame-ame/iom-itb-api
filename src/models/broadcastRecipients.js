'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BroadcastRecipients extends Model {
    static associate() {}
  }

  BroadcastRecipients.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    nim: { type: DataTypes.STRING, allowNull: true },
    noWhatsapp: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
  }, {
    sequelize,
    modelName: 'BroadcastRecipients',
    tableName: 'BroadcastRecipients',
  });

  return BroadcastRecipients;
};
