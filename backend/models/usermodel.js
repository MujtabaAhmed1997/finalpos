const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize'); // Use the main database connection

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }, 
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:'salesman'
  }
});

// Remove duplicate sync - this is handled in server.js
// Export the User model
module.exports = User;
