const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

// Supplier Model
const Supplier = sequelize.define('Supplier', {
    SupplierID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    SupplierName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ContactName: {
        type: DataTypes.STRING
    },
    Address: {
        type: DataTypes.STRING
    },
    Phone: {
        type: DataTypes.STRING
    },
    Email: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'suppliers',
    timestamps: false
});

module.exports = Supplier;
