// sequelize.js
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('stmdb', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',
//   logging:false,
// });

// module.exports = sequelize;

require('dotenv').config();

const { Sequelize } = require('sequelize');

// Debug: Log environment variables
console.log('Environment variables:');
console.log('dbname:', process.env.databasename);
console.log('user:', process.env.user);
console.log('password:', process.env.password ? '[HIDDEN]' : 'undefined');
console.log('host:', process.env.host);
console.log('dbport:', process.env.dbport);

const sequelize = new Sequelize(process.env.databasename, process.env.user, process.env.password, {
  host: process.env.host,
  port: process.env.dbport,
  dialect: 'mysql',
  logging:false,
});

module.exports = sequelize;
