// models/customerreturn.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Customer = require('./customer');
const ReturnOrder = require('./returnorder');

const CustomerReturn = sequelize.define('CustomerReturn', {
  CustomerReturnID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ReturnOrderID: {
    type: DataTypes.INTEGER,
    references: {
      model: ReturnOrder,
      key: 'ReturnOrderID',
    },
    allowNull: false,
  },
  CustomerID: {
    type: DataTypes.INTEGER,
    references: {
      model: Customer,
      key: 'CustomerID',
    },
    allowNull: false,
  },
});

module.exports = CustomerReturn;
