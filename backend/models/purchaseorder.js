// models/PurchaseOrder.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Supplier=require('./supplier');
const PurchaseOrder = sequelize.define('PurchaseOrder', {
  PurchaseOrderID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  SupplierID: {
    type: DataTypes.INTEGER,
    references: {
      model: Supplier, // make sure you have a Supplier model defined
      key: 'SupplierID'
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

module.exports = PurchaseOrder;
