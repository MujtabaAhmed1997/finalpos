// models/Batch.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Batch = sequelize.define('Batch', {
    BatchID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ProductID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Products',
            key: 'ProductID'
        },
        allowNull: false
    },
    VariationID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'ProductVariations',
            key: 'VariationID'
        }
    },
    BatchName: {
        type: DataTypes.STRING,
        allowNull: false
    },
  
    CostPricePerUnit: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    Quantity: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

module.exports = Batch;
