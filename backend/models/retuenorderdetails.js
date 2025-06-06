// models/returnorderdetail.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const ReturnOrder = require('./returnorder');
const ProductVariation = require('./productvariation');
const Products=require('./product');

const ReturnOrderDetail = sequelize.define('ReturnOrderDetail', {
  ReturnOrderDetailID: {
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
  ProductID: {
    type: DataTypes.INTEGER,
    references: {
      model: Products,
      key: 'ProductID',
    },
    allowNull: false,
  },
  VariationID: {
    type: DataTypes.INTEGER,
    references: {
      model: ProductVariation,
      key: 'VariationID',
    },
    allowNull: false,
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  LooseQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  UnitPrice:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  Reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = ReturnOrderDetail;
