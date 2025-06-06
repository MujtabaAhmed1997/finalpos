// models/StockTransaction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const StockTransaction = sequelize.define('StockTransaction', {
  TransactionID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  VariationID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'ProductVariations',
      key: 'VariationID'
    }
  },
  BatchID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Batches',
      key: 'BatchID'
    }
  },
  TransactionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Quantity: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  RemainingQuantity: { // New field for tracking partial depletion
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0 // Initialize with 0 for consistency
  },
  UnitType: {
    type: DataTypes.STRING, // Container ,SACK or Loose quantity
    allowNull: false
  },
  TransactionType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  BuyingPrice: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
});

module.exports = StockTransaction;
