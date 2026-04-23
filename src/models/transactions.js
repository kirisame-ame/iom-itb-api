'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association with Merchandise
      this.belongsTo(models.Merchandises, {
        foreignKey: 'merchandiseId',
        as: 'merchandises'
      });
    }
  }
  
  Transactions.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    noTelp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    merchandiseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Merchandises', // Make sure the table name matches your actual Merchandise model
        key: 'id',
      }
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('waiting', 'on process', 'on delivery', 'arrived', 'done', 'canceled', 'denied'),
      defaultValue: 'waiting',
      allowNull: false
    },
    payment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentMethod: {
      type: DataTypes.ENUM('manual', 'midtrans'),
      allowNull: false,
      defaultValue: 'manual'
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'settlement', 'expired', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending'
    },
    midtransOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    midtransTransactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    grossAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Transactions',
    tableName: 'Transactions', 
  });

  return Transactions;
};
