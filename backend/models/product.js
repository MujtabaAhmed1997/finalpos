// // models/Product.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../db/sequelize');
// const ProductCategory = require('./ProductCategory');
// // const ProductType = require('./ProductType');
// const {ProductVariation} = require('./productvariation');

// const Product = sequelize.define('Product', {
//   ProductID: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   ProductName: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   Description: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   Unit: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   ReorderLevel: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   }
// });

// // Define associations
// Product.belongsTo(ProductCategory, { foreignKey: 'CategoryID' });
// // Uncomment if you want to use ProductType
// // Product.belongsTo(ProductType, { foreignKey: 'TypeID' });
// Product.hasMany(ProductVariation, { foreignKey: 'ProductID' });

// module.exports = Product;


// models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Product = sequelize.define('Product', {
  ProductID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ProductName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Unit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ReorderLevel: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  softdelete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Product;

