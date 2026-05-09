'use strict';
const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Activities extends Model {
    static associate(models) {
      Activities.belongsToMany(models.Tags, {
        through: 'ActivityTags',
        foreignKey: 'activity_id',
        as: 'tags'
      });
    }

    static async getActivitiesByTitle(keyword) {
      return this.findAll({
        where: {
          title: { [Op.like]: `%${keyword}%` }
        }
      });
    }
  }

  Activities.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'published'
    }
  }, {
    sequelize,
    modelName: 'Activities',
    tableName: 'Activities',
  });

  return Activities;
};