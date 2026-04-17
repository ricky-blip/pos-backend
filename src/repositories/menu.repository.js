const { Op } = require('sequelize');
const { Menu, Category } = require('../models');

class MenuRepository {
  async findAll(filters = {}) {
    const { keyword, ...otherFilters } = filters;
    
    let where = { ...otherFilters };
    if (keyword) {
      where.name = { [Op.iLike]: `%${keyword}%` };
    }

    return await Menu.findAll({
      where,
      include: [{ model: Category, as: 'category' }]
    });
  }

  async findById(id) {
    return await Menu.findByPk(id, {
      include: [{ model: Category, as: 'category' }]
    });
  }

  async create(data) {
    return await Menu.create(data);
  }

  async update(id, data) {
    const menu = await Menu.findByPk(id);
    if (!menu) {
      throw new Error('Menu not found');
    }
    return await menu.update(data);
  }

  async delete(id) {
    const menu = await Menu.findByPk(id);
    if (!menu) {
      throw new Error('Menu not found');
    }
    await menu.destroy();
    return true;
  }
}

module.exports = { menuRepository: new MenuRepository() };
