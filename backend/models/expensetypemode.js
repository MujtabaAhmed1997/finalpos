const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const ExpenseType = sequelize.define('ExpenseType', {
    ExpenseTypeID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    TypeName: {
        type: DataTypes.STRING,
        allowNull: false
    },

}, {
    tableName: 'expensetype',
    timestamps: true
});

module.exports = ExpenseType;
