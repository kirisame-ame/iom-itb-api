'use strict';

module.exports = (sequelize, DataTypes) => {
  const EmailTemplate = sequelize.define('EmailTemplate', {
    key: DataTypes.STRING,
    title: DataTypes.STRING,
    subject: DataTypes.STRING,
    body: DataTypes.TEXT,
    variables: DataTypes.JSON,
    isActive: DataTypes.BOOLEAN,
    channel: { type: DataTypes.STRING(20), defaultValue: 'email' },
  }, {
    tableName: 'EmailTemplates',
  });

  return EmailTemplate;
};