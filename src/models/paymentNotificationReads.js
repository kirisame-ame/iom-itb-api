'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PaymentNotificationReads extends Model {
    static associate() {}
  }

  PaymentNotificationReads.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userKey: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true,
    },
    lastReadAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'PaymentNotificationReads',
    tableName: 'PaymentNotificationReads',
  });

  return PaymentNotificationReads;
};

