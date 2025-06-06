// models/ProductCategory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const ProductCategory = sequelize.define('ProductCategory', {
  CategoryID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  CategoryName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  softdelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = ProductCategory;
