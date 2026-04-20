const transactionRepository = require('../repositories/transaction.repository');
const { Menu } = require('../models');

class TransactionService {
  /**
   * Process a new checkout
   * @param {Object} data - { items, paymentMethod, customerName, totalDiscount }
   * @param {number} userId - ID of the cashier/user
   */
  async checkout(data, userId) {
    const { items, paymentMethod, customerName, totalDiscount = 0 } = data;

    if (!items || items.length === 0) {
      throw new Error('No items in transaction');
    }

    let totalOriginal = 0;
    const processedItems = [];

    // 1. Validate items and calculate prices
    for (const item of items) {
      const menu = await Menu.findByPk(item.menuId);
      if (!menu) {
        throw new Error(`Menu with ID ${item.menuId} not found`);
      }

      if (!menu.is_available) {
        throw new Error(`Menu ${menu.name} is currently not available`);
      }

      const itemTotal = menu.price * item.quantity;
      totalOriginal += itemTotal;

      processedItems.push({
        menuId: menu.id,
        quantity: item.quantity,
        priceAtTransaction: menu.price,
        subtotal: itemTotal,
        note: item.note || '',
      });
    }

    // 2. Calculations (PPN 11%)
    const taxRate = 0.11;
    const totalTax = Math.round((totalOriginal - totalDiscount) * taxRate);
    const totalFinal = totalOriginal - totalDiscount + totalTax;

    // 3. Generate Invoice Number (Format: INV-YYYYMMDD-Random)
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const invoiceNumber = `INV-${date}-${randomSuffix}`;

    // 4. Prepare data for Repository
    const transactionData = {
      userId,
      invoiceNumber,
      totalOriginal,
      totalDiscount,
      totalTax,
      totalFinal,
      paymentMethod,
      customerName,
      status: 'completed',
    };

    // 5. Execute Atomic Create in Repository
    return await transactionRepository.createWithItems(transactionData, processedItems);
  }

  async getAllTransactions() {
    return await transactionRepository.findAll();
  }

  async getTransactionDetails(id) {
    const transaction = await transactionRepository.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }
}

module.exports = new TransactionService();
