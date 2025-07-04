// sequelize.js
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('stmdb', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql',
//   logging:false,
// });

// module.exports = sequelize;

//live db
require('dotenv').config();

const { Sequelize } = require('sequelize');
console.log(process.env.password, process.env.host);

const sequelize = new Sequelize(
  process.env.dbname,
  process.env.user, // 'avnadmin'
  process.env.password, // your Aiven password
  {
    host: process.env.host,     // Aiven MySQL host
    port: process.env.dbport,     // 14795
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,

        rejectUnauthorized: false // required for Aiven SSL
      }
    },
    logging: false
  }
);

module.exports = sequelize;
