// sequelize.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('stmdb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging:false,
});

module.exports = sequelize;
