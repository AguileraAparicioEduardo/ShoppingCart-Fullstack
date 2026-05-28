const { DataTypes } = require('sequelize')
const db = require('./database')

const User = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Name cannot be empty' },
    },
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Must be a valid email' },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

module.exports = User