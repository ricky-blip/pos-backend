const { User } = require('./user.model');
const { Category } = require('./category.model');
const { Menu } = require('./menu.model');

// Define Relationships

// Category & Menu (One-to-Many)
Category.hasMany(Menu, { foreignKey: 'categoryId', as: 'menus' });
Menu.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = {
  User,
  Category,
  Menu
};
