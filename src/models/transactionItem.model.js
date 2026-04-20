const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TransactionItem = sequelize.define('TransactionItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  menuId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  priceAtTransaction: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'transaction_items',
  timestamps: false,
});

module.exports = { TransactionItem };
