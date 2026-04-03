'use strict';

const fs = require('fs');
const path = require('path');
const pg = require('pg');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    ...config,
    dialectModule: pg,
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    dialectModule: pg,
  });
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Test database connection with detailed error info
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection has been established successfully.');
    
    // Test a simple query
    return sequelize.query('SELECT 1 as test');
  })
  .then(([results, metadata]) => {
    console.log('✅ Database query test successful:', results);
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err.message);
    console.error('Error code:', err.parent?.code);
    console.error('Error errno:', err.parent?.errno);
    console.error('Error syscall:', err.parent?.syscall);
    console.error('Full error:', err);
    
    // Set a flag to indicate database is not available
    global.databaseAvailable = false;
    console.log('⚠️  Database not available, using fallback responses');
  });

module.exports = db;
