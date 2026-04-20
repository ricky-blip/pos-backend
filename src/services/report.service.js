const { Transaction, TransactionItem, Menu, Category } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

class ReportService {
  /**
   * Get Sales Summary Stats (Cards)
   */
  async getSalesSummary(filters = {}) {
    const { startDate, endDate, userId } = filters;
    
    const where = {};
    if (startDate && endDate) {
      where.createdAt = { [Op.between]: [startDate, endDate] };
    }
    if (userId) {
      where.userId = userId;
    }

    // 1. Total Turnover & Order Count
    const transactionStats = await Transaction.findOne({
      where,
      attributes: [
        [fn('SUM', col('totalFinal')), 'totalOmzet'],
        [fn('COUNT', col('id')), 'totalOrders'],
      ],
      raw: true
    });

    // 2. Breakdown Menu Sales per Category
    // We join Transaction -> TransactionItem -> Menu -> Category
    const categoryStats = await TransactionItem.findAll({
      include: [
        {
          model: Transaction,
          as: 'transaction',
          where,
          attributes: [],
          required: true,
        },
        {
          model: Menu,
          as: 'menu',
          attributes: [],
          required: true,
          include: [{ model: Category, as: 'category', attributes: ['label', 'slug'], required: true }]
        }
      ],
      attributes: [
        [fn('SUM', col('quantity')), 'totalQuantity'],
        [literal('"menu->category"."id"'), 'categoryId'],
        [literal('"menu->category"."slug"'), 'categorySlug'],
        [literal('"menu->category"."label"'), 'categoryLabel'],
      ],
      group: [
        literal('"menu->category"."id"'),
        literal('"menu->category"."slug"'),
        literal('"menu->category"."label"')
      ],
      raw: true,
    });

    const categories = {
      foods: 0,
      beverages: 0,
      desserts: 0,
      totalItems: 0
    };

    categoryStats.forEach(stat => {
      const slug = stat.categorySlug?.toLowerCase();
      const qty = parseInt(stat.totalQuantity || 0);
      
      if (slug === 'foods' || slug === 'food') categories.foods += qty;
      else if (slug === 'beverages' || slug === 'beverage') categories.beverages += qty;
      else if (slug === 'dessert' || slug === 'desserts') categories.desserts += qty;
      
      categories.totalItems += qty;
    });

    return {
      totalOmzet: parseFloat(transactionStats.totalOmzet || 0),
      totalOrders: parseInt(transactionStats.totalOrders || 0),
      totalItems: categories.totalItems,
      categoryBreakdown: {
        foods: categories.foods,
        beverages: categories.beverages,
        desserts: categories.desserts
      }
    };
  }

  /**
   * Get Detailed Transaction List with Filters
   */
  async getTransactionList(filters = {}) {
    const { startDate, endDate, userId, categoryId, orderType, limit = 10, offset = 0 } = filters;
    
    const where = {};
    if (startDate && endDate) {
      where.createdAt = { [Op.between]: [startDate, endDate] };
    }
    if (userId) {
      where.userId = userId;
    }
    
    // Filtering by category requires a join on TransactionItem
    const include = [
      {
        model: TransactionItem,
        as: 'items',
        include: [{ 
          model: Menu, 
          as: 'menu', 
          where: categoryId ? { categoryId } : {} 
        }]
      }
    ];

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      include,
      distinct: true, // Needed for pagination when including 1:N relations
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      total: count,
      transactions: rows
    };
  }

  /**
   * Get Sales Trend for Dashboard Chart
   * Groups total turnover by date and category
   */
  async getSalesTrend(filters = {}) {
    const { startDate, endDate } = filters;
    
    // We want a structure like [{ date, Food: 100, Beverage: 200, Dessert: 50 }, ...]
    const trendData = await TransactionItem.findAll({
      include: [
        {
          model: Transaction,
          as: 'transaction',
          where: {
            createdAt: { [Op.between]: [startDate, endDate] }
          },
          attributes: [],
          required: true,
        },
        {
          model: Menu,
          as: 'menu',
          attributes: [],
          required: true,
          include: [{ model: Category, as: 'category', attributes: ['label'], required: true }]
        }
      ],
      attributes: [
        [fn('DATE', col('transaction.createdAt')), 'saleDate'],
        [fn('SUM', col('subtotal')), 'totalSales'],
        [literal('"menu->category"."id"'), 'categoryId'],
        [literal('"menu->category"."label"'), 'categoryLabel'],
      ],
      group: [
        fn('DATE', col('transaction.createdAt')),
        literal('"menu->category"."id"'),
        literal('"menu->category"."label"')
      ],
      raw: true,
    });

    // Post-process to pivot categories into columns
    const pivoted = {};
    trendData.forEach(item => {
      const date = item.saleDate;
      const categoryName = item.categoryLabel;
      const amount = parseFloat(item.totalSales || 0);

      if (!pivoted[date]) {
        pivoted[date] = { date };
      }
      pivoted[date][categoryName] = amount;
    });

    // Convert object to sorted array
    return Object.values(pivoted).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Get Top Selling Items by Category
   */
  async getTopSellingItems(filters = {}) {
    const { categoryId, limit = 10 } = filters;
    
    const stats = await TransactionItem.findAll({
      include: [
        {
          model: Menu,
          as: 'menu',
          where: categoryId ? { categoryId } : {},
          attributes: ['name']
        }
      ],
      attributes: [
        'menuId',
        [fn('SUM', col('quantity')), 'totalSales'],
      ],
      group: ['menuId', 'menu.id', 'menu.name'],
      order: [[fn('SUM', col('quantity')), 'DESC']],
      limit,
      raw: true,
      nest: true
    });

    return stats.map(s => ({
      name: s.menu.name,
      sales: parseInt(s.totalSales || 0)
    }));
  }
}

module.exports = new ReportService();

