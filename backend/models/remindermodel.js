const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Reminder = sequelize.define('Reminder', {
    ReminderID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    TaskDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Date: {
        type: DataTypes.DATEONLY, // stores only the date (not time)
        allowNull: false
    }
}, {
    tableName: 'reminders',
    timestamps: true
});

module.exports = Reminder;
