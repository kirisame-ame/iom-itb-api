'use strict';

module.exports = (sequelize, DataTypes) => {
  const EmailTemplate = sequelize.define('EmailTemplate', {
    key: DataTypes.STRING,
    title: DataTypes.STRING,
    subject: DataTypes.STRING,
    body: DataTypes.TEXT,
    variables: DataTypes.JSON,
    isActive: DataTypes.BOOLEAN,
  }, {
    tableName: 'EmailTemplates',
  });

  return EmailTemplate;
};