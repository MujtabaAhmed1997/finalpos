// models/ProductVariation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const ProductVariation = sequelize.define('ProductVariation', {
  VariationID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  SKU: {
    type: DataTypes.STRING,
    allowNull: false
    // Remove unique: true here
  },
  Size: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  SellingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  UnitsPerPackage: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Barcode: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'ProductVariation',
  indexes: [
    {
      unique: true,
      fields: ['SKU'] // define here instead of in field
    },
    {
      unique: true,
      fields: ['ProductID', 'Size']
    }
  ]
});

module.exports = ProductVariation;

// // models/ProductVariation.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../db/sequelize');
// const Product = require('./product');

// const ProductVariation = sequelize.define('ProductVariation', {
//   VariationID: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   SKU: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   Size: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   Color: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   Price: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false
//   },
//   QuantityInStock: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   UnitsPerPackage: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   }
// });

// // Define associations
// ProductVariation.belongsTo(Product, { foreignKey: 'ProductID' });

// module.exports = {ProductVariation,Product};
// models/ProductVariation.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../db/sequelize');

// const ProductVariation = sequelize.define('ProductVariation', {
//   VariationID: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   SKU: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   },
//   Size: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   Color: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   // Price: {
//   //   type: DataTypes.DECIMAL(10, 2),
//   //   allowNull: false
//   // },
//   SellingPrice: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false
//   },
//   // QuantityInStock: {
//   //   type: DataTypes.INTEGER,
//   //   allowNull: false
//   // },
//   UnitsPerPackage: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   }, Barcode: {  // Add this line if not already present
//     type: DataTypes.STRING,
//     allowNull: true
//   }
// }, {
//   sequelize,
//   modelName: 'ProductVariation',
//   indexes: [
//     {
//       unique: true,
//       fields: ['ProductID', 'Size']  // Ensure Size is unique per Product
//     }
//   ]
// });

// module.exports = ProductVariation;
