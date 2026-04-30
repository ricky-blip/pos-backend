const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  group: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'general'
  }
}, {
  tableName: 'settings',
  timestamps: true
});

module.exports = { Settings };
