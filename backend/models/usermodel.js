const { Sequelize, DataTypes } = require('sequelize');

// Create a Sequelize instance with your MySQL database connection details
const sequelize = new Sequelize('stmdb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
//   logging: console.log, // Enable logging

});

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

sequelize.sync({ force: false }) // Set force to true to drop existing tables and re-create them
  .then(() => {
    console.log('Database synchronized');
    // Start your Express server or perform other operations
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });
// Export the User model
module.exports = User;
