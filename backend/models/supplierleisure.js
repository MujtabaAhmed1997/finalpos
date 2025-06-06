// // models/supplierleisure.js

// const { DataTypes } = require('sequelize');
// const sequelize = require('../db/sequelize');

// const SupplierLeisure = sequelize.define('SupplierLeisure', {
//   LeisureID: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   SupplierID: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   PurchaseOrderID: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//   },
//   Date: {
//     type: DataTypes.DATE,
//     allowNull: false,
//     defaultValue: DataTypes.NOW,
//   },
//   Credit: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   Debt: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//     defaultValue: 0,
//   },
//   Remaining: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//     defaultValue: 0,
//   }
// }, {
//   timestamps: false,
// });

// module.exports = SupplierLeisure;

// models/SupplierLeisure.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Supplier = require('./supplier');
const PurchaseOrder = require('./purchaseorder');
const SupplierPayment = require('./supplierpaymentmodel');

const SupplierLeisure = sequelize.define('SupplierLeisure', {
  LeisureID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  SupplierID: {
    type: DataTypes.INTEGER,
    references: {
      model: Supplier,
      key: 'SupplierID'
    },
    allowNull: false
  },
  TransactionType: {
    type: DataTypes.STRING,
    allowNull: false, // e.g., 'PurchaseOrder', 'Payment', 'Adjustment'
    validate: {
      isIn: [['PurchaseOrder', 'Payment', 'Adjustment']]
    }
  },
  TransactionID: {
    type: DataTypes.INTEGER,
    allowNull: false // Must reference a valid ID based on TransactionType
  },
  TransactionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Debit: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  Credit: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  Balance: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
 
});

module.exports = SupplierLeisure;
