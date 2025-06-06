// models/CustomerPayment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize'); // Adjust the path to your database configuration

const CustomerPayment = sequelize.define('CustomerPayment', {
  CustomerPaymentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CustomerID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // SalesOrderID: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false
  // },
  PaymentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  PaymentAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  PaymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  PaymentStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Paid"
  }
}, {
  tableName: 'CustomerPayments',
  timestamps: true
});

module.exports = CustomerPayment;
