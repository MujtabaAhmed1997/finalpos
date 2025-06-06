const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Expense = sequelize.define('Expense', {
    ExpenseID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ExpenseType: {
        type: DataTypes.STRING,
        allowNull: false
    },

    Amount: {
        type: DataTypes.FLOAT, // Or DECIMAL(10,2) for fixed-point precision
    },
    Date: {
        type: DataTypes.DATE
    },
 
  
}, {
    tableName: 'expenses',
    timestamps: true
});

module.exports = Expense;
