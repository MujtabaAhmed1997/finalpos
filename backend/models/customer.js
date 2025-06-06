const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

// Customer Model
const Customer = sequelize.define('Customer', {
    CustomerID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    CustomerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
   
    Address: {
        type: DataTypes.STRING
    },
    Phone: {
        type: DataTypes.STRING
    },
    Email: {
        type: DataTypes.STRING
    },
    AvailableBalance: {
        type: DataTypes.DECIMAL(10, 2), // Example of a decimal field with 10 digits total and 2 decimal places
        defaultValue: 0.0 // Default value for available balance
    }
}, {
    tableName: 'customers',
    timestamps: true
});

module.exports = Customer;
