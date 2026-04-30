const { menuRepository } = require('../repositories/menu.repository');
const { StockLog, Menu, sequelize } = require('../models');

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

  async adjustStock(id, { quantity, type, reason, userId }) {
    const t = await sequelize.transaction();
    try {
      const menu = await menuRepository.findById(id);
      if (!menu) {
        const error = new Error('Menu tidak ditemukan');
        error.status = 404;
        throw error;
      }

      // Calculate new stock
      let newStock = menu.stock;
      if (type === 'IN') newStock += quantity;
      else if (type === 'OUT' || type === 'ADJUSTMENT') newStock += quantity; // assuming quantity is negative for adjustment/reduction
      
      // Safety check: stock can't be negative
      if (newStock < 0) {
        throw new Error('Stok tidak boleh negatif');
      }

      // Update Menu
      await menu.update({ stock: newStock }, { transaction: t });

      // Create Log
      await StockLog.create({
        menuId: id,
        userId,
        type,
        quantity,
        reason
      }, { transaction: t });

      await t.commit();
      return menu;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getLowStockMenus(threshold = 5) {
    return await menuRepository.findLowStock(threshold);
  }

  async getStockLogs(menuId) {
    const where = menuId ? { menuId } : {};
    return await StockLog.findAll({
      where,
      include: [
        { model: Menu, as: 'menu', attributes: ['name'] },
        { model: require('../models').User, as: 'user', attributes: ['username'] }
      ],
      order: [['createdAt', 'DESC']]
    });
  }
}

module.exports = { menuService: new MenuService() };
