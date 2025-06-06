// // models/customerleisure.js

// const { DataTypes } = require('sequelize');
// const sequelize = require('../db/sequelize');

// const CustomerLeisure = sequelize.define('CustomerLeisure', {
//   LeisureID: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   CustomerID: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   SaleOrderID: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//   },
//   Date: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW,
//   },
//   Credit: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   Debt: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   Remaining: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//     defaultValue: 0,
//   }
// }, {
//   timestamps: false,
// });

// module.exports = CustomerLeisure;

// models/CustomerLeisure.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const CustomerPayment = require('./customerpayment');
const Customer = require('./customer');
const SalesOrder = require('./salesorder');

const CustomerLeisure = sequelize.define('CustomerLeisure', {
  LeisureID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  CustomerID: {
    type: DataTypes.INTEGER,
    references: {
      model: Customer,
      key: 'CustomerID'
    }
  },
  TransactionType: {
    type: DataTypes.STRING,
    allowNull: false // e.g., 'SalesOrder', 'Payment', 'Adjustment'
  },
  TransactionID: {
    type: DataTypes.INTEGER,
    allowNull: false // Must always reference a valid ID based on TransactionType
  },
  TransactionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Debit: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  Credit: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  Balance: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

});

module.exports = CustomerLeisure;
