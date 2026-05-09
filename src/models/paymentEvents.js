'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PaymentEvents extends Model {
    static associate() {}
  }

  PaymentEvents.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    source: {
      type: DataTypes.ENUM('notification', 'verify', 'system'),
      allowNull: false,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scope: {
      type: DataTypes.ENUM('donation', 'transaction', 'unknown'),
      allowNull: false,
      defaultValue: 'unknown',
    },
    transactionStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fraudStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grossAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    signatureKey: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    signatureValid: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    rawPayload: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    processed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'PaymentEvents',
    tableName: 'PaymentEvents',
  });

  return PaymentEvents;
};
