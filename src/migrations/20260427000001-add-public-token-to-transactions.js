'use strict';

const crypto = require('crypto');

const generateToken = () => `ord_${crypto.randomBytes(24).toString('base64url')}`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Transactions', 'publicToken', {
      type: Sequelize.STRING(80),
      allowNull: true,
    });

    const [transactions] = await queryInterface.sequelize.query(
      'SELECT id FROM `Transactions` WHERE publicToken IS NULL'
    );

    const usedTokens = new Set();
    for (const transaction of transactions) {
      let token = generateToken();
      while (usedTokens.has(token)) token = generateToken();
      usedTokens.add(token);

      await queryInterface.bulkUpdate(
        'Transactions',
        { publicToken: token },
        { id: transaction.id }
      );
    }

    await queryInterface.addIndex('Transactions', ['publicToken'], {
      name: 'transactions_public_token_unique',
      unique: true,
    });

    await queryInterface.changeColumn('Transactions', 'publicToken', {
      type: Sequelize.STRING(80),
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('Transactions', 'transactions_public_token_unique');
    await queryInterface.removeColumn('Transactions', 'publicToken');
  },
};
