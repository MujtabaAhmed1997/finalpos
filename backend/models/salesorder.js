// models/SalesOrder.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Customer = require('./customer');

const SalesOrder = sequelize.define('SalesOrder', {
  SalesOrderID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  CustomerID: {
    type: DataTypes.INTEGER,
    references: {
      model: Customer, // make sure you have a Customer model defined
      key: 'CustomerID'
    }
  },
  

  OrderDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  TotalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  AmountPaid: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  RemainingAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  PaymentStatus: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = SalesOrder;
