const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StockLog = sequelize.define('StockLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  menuId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('IN', 'OUT', 'ADJUSTMENT'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'stock_logs',
  timestamps: true,
  updatedAt: false
});

module.exports = { StockLog };
