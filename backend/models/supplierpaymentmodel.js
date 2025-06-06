const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Supplier = require('./supplier');
const PurchaseOrder = require('./purchaseorder');

const SupplierPayment = sequelize.define('SupplierPayment', {
  SupplierPaymentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SupplierID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Supplier,
      key: 'SupplierID',
    },
  },
  // PurchaseOrderID: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references: {
  //     model: PurchaseOrder,
  //     key: 'PurchaseOrderID',
  //   },
  // },
  PaymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  PaymentAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  PaymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PaymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = SupplierPayment;
