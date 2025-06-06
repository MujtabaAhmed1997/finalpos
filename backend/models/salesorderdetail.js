// models/SalesOrderDetail.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const SalesOrderDetail = sequelize.define('SalesOrderDetail', {
  SalesOrderDetailID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  SalesOrderID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'SalesOrders',
      key: 'SalesOrderID'
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
  // BatchID: {
  //   type: DataTypes.TEXT, // Stores multiple IDs as "1,2,3"
  //   allowNull: true,
  //   get() {
  //     return this.getDataValue('BatchID') ? this.getDataValue('BatchID').split(',') : [];
  //   },
  //   set(value) {
  //     this.setDataValue('BatchID', Array.isArray(value) ? value.join(',') : value);
  //   }
  // },
  BatchID: {
    type: DataTypes.TEXT, // Stores multiple IDs as "1,2,3"
    allowNull: true,
    get() {
      const value = this.getDataValue('BatchID');
      return typeof value === 'string' && value.length > 0 ? value.split(',') : [];
    },
    set(value) {
      this.setDataValue('BatchID', Array.isArray(value) ? value.join(',') : value);
    }
  }
  ,
  Quantity: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  UnitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  Discount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  LooseQuantity: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  LooseQuantityPrice: {
    type: DataTypes.FLOAT,
    allowNull: true
  }

});

module.exports = SalesOrderDetail;
