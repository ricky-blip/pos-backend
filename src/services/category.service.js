const { categoryRepository } = require('../repositories/category.repository');

class CategoryService {
  async getAllCategories() {
    return await categoryRepository.findAll();
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Kategori tidak ditemukan');
      error.status = 404;
      throw error;
    }
    return category;
  }

  async createCategory(data) {
    if (!data.label) {
      const error = new Error('Label kategori wajib diisi');
      error.status = 400;
      throw error;
    }
    return await categoryRepository.create(data);
  }

  async updateCategory(id, data) {
    return await categoryRepository.update(id, data);
  }

  async deleteCategory(id) {
    return await categoryRepository.delete(id);
  }
}

module.exports = { categoryService: new CategoryService() };
