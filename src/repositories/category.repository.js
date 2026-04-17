const { Category } = require('../models');

class CategoryRepository {
  async findAll() {
    return await Category.findAll();
  }

  async findById(id) {
    return await Category.findByPk(id);
  }

  async create(data) {
    return await Category.create(data);
  }

  async update(id, data) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return await category.update(data);
  }

  async delete(id) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('Category not found');
    }
    await category.destroy();
    return true;
  }
}

module.exports = { categoryRepository: new CategoryRepository() };
