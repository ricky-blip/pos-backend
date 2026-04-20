const { Transaction, TransactionItem, Menu } = require('../models');
const { sequelize } = require('../config/database');

class TransactionRepository {
  /**
   * Create a complete transaction with items and stock reduction
   * @param {Object} transactionData - Main transaction info
   * @param {Array} items - List of transaction items
   * @returns {Promise<Object>} The created transaction
   */
  async createWithItems(transactionData, items) {
    const t = await sequelize.transaction();

    try {
      // 1. Create the main transaction
      const newTransaction = await Transaction.create(transactionData, { transaction: t });

      // 2. Process each item
      for (const item of items) {
        // Create the transaction item record
        await TransactionItem.create({
          ...item,
          transactionId: newTransaction.id,
        }, { transaction: t });

        // Update Menu Stock: Reduce it
        // Note: In a production environment, you might want to use a raw query or more optimized update
        const menu = await Menu.findByPk(item.menuId, { transaction: t, lock: true });
        
        if (!menu) {
          throw new Error(`Menu with ID ${item.menuId} not found`);
        }

        if (menu.stock < item.quantity) {
          throw new Error(`Insufficient stock for menu: ${menu.name}`);
        }

        menu.stock -= item.quantity;
        await menu.save({ transaction: t });
      }

      // 3. Commit the transaction
      await t.commit();
      
      // Return the transaction with its items included
      return await Transaction.findByPk(newTransaction.id, {
        include: [{ model: TransactionItem, as: 'items', include: ['menu'] }]
      });
    } catch (error) {
      // Rollback if anything fails
      await t.rollback();
      throw error;
    }
  }

  async findAll(options = {}) {
    return await Transaction.findAll({
      ...options,
      include: [{ model: TransactionItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
  }

  async findById(id) {
    return await Transaction.findByPk(id, {
      include: [{ model: TransactionItem, as: 'items', include: ['menu'] }]
    });
  }
}

module.exports = new TransactionRepository();
