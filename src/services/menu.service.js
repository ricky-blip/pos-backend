const { menuRepository } = require('../repositories/menu.repository');

class MenuService {
  async getAllMenus(filters) {
    return await menuRepository.findAll(filters);
  }

  async getMenuById(id) {
    const menu = await menuRepository.findById(id);
    if (!menu) {
      const error = new Error('Menu tidak ditemukan');
      error.status = 404;
      throw error;
    }
    return menu;
  }

  async createMenu(data) {
    return await menuRepository.create(data);
  }

  async updateMenu(id, data) {
    return await menuRepository.update(id, data);
  }

  async deleteMenu(id) {
    return await menuRepository.delete(id);
  }
}

module.exports = { menuService: new MenuService() };
