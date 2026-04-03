'use strict';
const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Donations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define any associations if needed in the future
    }

    /**
     * Fetch donations by donor's name keyword
     * @param {string} keyword - The name keyword to search for
     */
    static async getDonationsByName(keyword) {
      return this.findAll({
        where: {
          name: { [Op.like]: `%${keyword}%` }
        }
      });
    }
  }

  Donations.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    noWhatsapp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    proof: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notification: {
      type: DataTypes.JSON,
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT,  // Bisa menggunakan INTEGER jika jumlah donasi berupa bilangan bulat
      allowNull: true
    },
    options: {
      type: DataTypes.JSON,  // Menyimpan data tambahan dalam bentuk JSON
      allowNull: true
    },    
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bank: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Donations',
    tableName: 'Donations',
  });

  return Donations;
};
