// models/returnorder.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const ReturnOrder = sequelize.define('ReturnOrder', {
  ReturnOrderID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  OrderType: {
    type: DataTypes.ENUM('Customer', 'Supplier'),
    allowNull: false,
  },
  OrderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ReturnDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  TotalAmount:{
    type:DataTypes.INTEGER,
    allowNull:false

  },
  Reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = ReturnOrder;
