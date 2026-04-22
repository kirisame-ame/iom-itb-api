'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // We update the existing columns if needed or just rely on the model.
    // However, createSnapToken isn't saving these to 'options' yet, it's ignoring them.
    // The current createDonations.js (manual) saves them to 'options'.
    // Let's check if we should add them as actual columns if they are important.
    // The user said "add nameIsHidden sm isHambaAllah fields for midtrans transactions".
    // I will add them to the Donations table to be consistent.
    
    await queryInterface.addColumn('Donations', 'nameIsHidden', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true
    });
    await queryInterface.addColumn('Donations', 'isHambaAllah', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Donations', 'nameIsHidden');
    await queryInterface.removeColumn('Donations', 'isHambaAllah');
  }
};
