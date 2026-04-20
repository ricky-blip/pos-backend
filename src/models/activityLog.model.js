const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ActivityLog = sequelize.define('ActivityLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Null for public actions if any
  },
  action: {
    type: DataTypes.STRING, // LOGIN, LOGOUT, TRANSACTION, CREATE_USER, etc
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('success', 'failed'),
    defaultValue: 'success',
  },
  ipAddress: {
    type: DataTypes.STRING,
  },
  userAgent: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'activity_logs',
  timestamps: true,
  updatedAt: false, // Logs are usually immutable
});

module.exports = { ActivityLog };
