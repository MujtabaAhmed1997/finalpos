// models/pricehistorymodel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const ProductVariation = require('./productvariation');

const PriceHistory = sequelize.define('PriceHistory', {
  PriceHistoryID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  VariationID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  PriceType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  PreviousPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  NewPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  ChangeDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

PriceHistory.belongsTo(ProductVariation, { foreignKey: 'VariationID' });

module.exports = PriceHistory;
