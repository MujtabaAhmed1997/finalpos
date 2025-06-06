// models/PurchaseOrderDetail.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const PurchaseOrderDetail = sequelize.define('PurchaseOrderDetail', {
  PurchaseOrderDetailID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  PurchaseOrderID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'PurchaseOrders',
      key: 'PurchaseOrderID'
    }
  },
  BatchID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Batches',
      key: 'BatchID'
    }
  },
  ProductID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Products',
      key: 'ProductID'
    }
  },
  VariationID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'ProductVariations',
      key: 'VariationID'
    }
  },
  Quantity: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  UnitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
  
});

module.exports = PurchaseOrderDetail;
