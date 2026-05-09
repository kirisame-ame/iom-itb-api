'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PaymentEvents', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      source: {
        type: Sequelize.ENUM('notification', 'verify', 'system'),
        allowNull: false,
      },
      orderId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      scope: {
        type: Sequelize.ENUM('donation', 'transaction', 'unknown'),
        allowNull: false,
        defaultValue: 'unknown',
      },
      transactionStatus: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fraudStatus: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paymentStatus: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paymentType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      grossAmount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      signatureKey: {
        type: Sequelize.STRING(128),
        allowNull: true,
      },
      signatureValid: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      rawPayload: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      processed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      error: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ipAddress: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('PaymentEvents', ['orderId']);
    await queryInterface.addIndex('PaymentEvents', ['createdAt']);
    await queryInterface.addIndex('PaymentEvents', ['scope', 'paymentStatus']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('PaymentEvents');
  },
};
