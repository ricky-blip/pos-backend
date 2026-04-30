const { User } = require('./user.model');
const { Category } = require('./category.model');
const { Menu } = require('./menu.model');
const { Transaction } = require('./transaction.model');
const { TransactionItem } = require('./transactionItem.model');
const { ActivityLog } = require('./activityLog.model');
const { StockLog } = require('./stockLog.model');
const { Shift } = require('./shift.model');
const { Settings } = require('./settings.model');

// --- Relationships ---

// Category <-> Menu (One-to-Many)
Category.hasMany(Menu, { foreignKey: 'categoryId', as: 'menus' });
Menu.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// User <-> Transaction (One-to-Many)
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Transaction <-> TransactionItem (One-to-Many)
Transaction.hasMany(TransactionItem, { foreignKey: 'transactionId', as: 'items' });
TransactionItem.belongsTo(Transaction, { foreignKey: 'transactionId', as: 'transaction' });

// Menu <-> TransactionItem (One-to-Many)
Menu.hasMany(TransactionItem, { foreignKey: 'menuId', as: 'transactionItems' });
TransactionItem.belongsTo(Menu, { foreignKey: 'menuId', as: 'menu' });

// User <-> ActivityLog (One-to-Many)
User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'logs' });
ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> StockLog
User.hasMany(StockLog, { foreignKey: 'userId', as: 'stockLogs' });
StockLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Menu <-> StockLog
Menu.hasMany(StockLog, { foreignKey: 'menuId', as: 'stockLogs' });
StockLog.belongsTo(Menu, { foreignKey: 'menuId', as: 'menu' });

// User <-> Shift
User.hasMany(Shift, { foreignKey: 'userId', as: 'shifts' });
Shift.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Category,
  Menu,
  Transaction,
  TransactionItem,
  ActivityLog,
  StockLog,
  Shift,
  Settings,
};
