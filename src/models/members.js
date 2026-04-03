'use strict';
const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Members extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define any associations if needed in the future
    }

    // Example of a custom query method, if needed in the future
    static async getMembersByCode(code) {
      return this.findAll({
        where: {
          code: { [Op.like]: `%${code}%` }
        }
      });
    }
  }
  
  Members.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parentName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    childNim: {
      type: DataTypes.STRING,
      allowNull: false
    },
    noWhatsapp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Members',
    tableName: 'Members',
  });

  return Members;
};
