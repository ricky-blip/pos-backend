const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  totalOriginal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  totalDiscount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  totalTax: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  totalFinal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING, // cash, e-wallet, etc
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('completed', 'cancelled'),
    defaultValue: 'completed',
  },
  customerName: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'transactions',
  timestamps: true,
  updatedAt: false, // Transactions are usually immutable
});

module.exports = { Transaction };
