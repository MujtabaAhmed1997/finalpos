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
// const { DataTypes } = require('sequelize');
// const sequelize = require('../db/sequelize');

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
//   },
//   CategoryId:{
//     type
//   },
//   softdelete: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: false
//   }
// });

// module.exports = Product;



const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const ProductCategory = require('./ProductCategory');
const { ProductVariation } = require('./productvariation');

const Product = sequelize.define('Product', {
  ProductID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ProductName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'ProductName is required.' }
    }
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Unit: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Unit is required.' }
    }
  },
  ReorderLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: 'ReorderLevel must be an integer.' },
      min: { args: [0], msg: 'ReorderLevel must be 0 or greater.' }
    }
  },
  CategoryID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProductCategory,
      key: 'CategoryID'
    },
    validate: {
      notNull: { msg: 'CategoryID is required.' },
      isInt: { msg: 'CategoryID must be a valid integer.' }
    }
  }
});

// Associations
Product.belongsTo(ProductCategory, { foreignKey: 'CategoryID' });
Product.hasMany(ProductVariation, { foreignKey: 'ProductID' });

module.exports = Product;

