const reportService = require('../services/report.service');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class ReportController {
  /**
   * Get Combined Report Data (Summary + List)
   */
  async getSalesReport(req, res) {
    try {
      const { 
        startDate, 
        endDate, 
        categoryId, 
        userId: filterUserId, 
        page = 1, 
        limit = 10 
      } = req.query;

      // RBAC: If cashier, force filter by their own ID
      const targetUserId = req.user.role === 'cashier' ? req.user.id : filterUserId;

      // Default to "Today" if no dates provided
      let start = startDate;
      let end = endDate;
      
      if (!start || !end) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        start = today.toISOString();
        end = tomorrow.toISOString();
      }

      const filters = {
        startDate: start,
        endDate: end,
        userId: targetUserId,
        categoryId,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      };

      // Fetch both Summary and List in parallel
      const [summary, list] = await Promise.all([
        reportService.getSalesSummary(filters),
        reportService.getTransactionList(filters)
      ]);

      return successResponse(res, 200, 'Berhasil mengambil laporan penjualan', {
        summary,
        transactions: list.transactions,
        pagination: {
          total: list.total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(list.total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('[ReportController] Error:', error);
      return errorResponse(res, 500, error.message);
    }
  }

  /**
   * Get Dashboard Data (Summary + Chart Trend)
   * Admin only
   */
  async getDashboardStats(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return errorResponse(res, 403, 'Akses ditolak: Hanya admin yang dapat melihat dashboard');
      }

      const { startDate, endDate } = req.query;

      // Default trend: Last 30 days
      let start = startDate;
      let end = endDate;

      if (!start || !end) {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        start = d.toISOString();
        end = new Date().toISOString();
      }

      const filters = { startDate: start, endDate: end };

      const [summary, trend] = await Promise.all([
        reportService.getSalesSummary(filters),
        reportService.getSalesTrend(filters)
      ]);

      return successResponse(res, 200, 'Berhasil mengambil data dashboard', { summary, trend });
    } catch (error) {
      console.error('[ReportController Dashboard] Error:', error);
      return errorResponse(res, 500, error.message);
    }
  }

  /**
   * Get Top Products per Category
   */
  async getTopSellingItems(req, res) {
    try {
      const { categoryId, limit = 10 } = req.query;

      const items = await reportService.getTopSellingItems({ categoryId, limit });

      return successResponse(res, 200, 'Berhasil mengambil produk terlaris', items);
    } catch (error) {
      console.error('[ReportController Top Selling] Error:', error);
      return errorResponse(res, 500, error.message);
    }
  }
}


module.exports = new ReportController();
