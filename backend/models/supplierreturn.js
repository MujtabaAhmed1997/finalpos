// models/supplierreturn.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Supplier = require('./supplier');
const ReturnOrder = require('./returnorder');

const SupplierReturn = sequelize.define('SupplierReturn', {
  SupplierReturnID: {
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
  SupplierID: {
    type: DataTypes.INTEGER,
    references: {
      model: Supplier,
      key: 'SupplierID',
    },
    allowNull: false,
  },
});

module.exports = SupplierReturn;
