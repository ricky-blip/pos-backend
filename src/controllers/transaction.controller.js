const transactionService = require('../services/transaction.service');
const { successResponse, errorResponse } = require('../utils/responseHelper');

/**
 * TransactionResponseDTO - Clean JSON output for transactions
 */
class TransactionResponseDTO {
  static map(transaction) {
    if (!transaction) return null;
    return {
      id: transaction.id,
      invoiceNumber: transaction.invoiceNumber,
      customerName: transaction.customerName,
      totals: {
        original: parseFloat(transaction.totalOriginal),
        discount: parseFloat(transaction.totalDiscount),
        tax: parseFloat(transaction.totalTax),
        final: parseFloat(transaction.totalFinal),
      },
      payment: {
        method: transaction.paymentMethod,
        status: transaction.status,
      },
      date: transaction.createdAt,
      items: transaction.items ? transaction.items.map(item => ({
        menuId: item.menuId,
        menuName: item.menu ? item.menu.name : 'Unknown',
        quantity: item.quantity,
        price: parseFloat(item.priceAtTransaction),
        subtotal: parseFloat(item.subtotal),
        note: item.note
      })) : []
    };
  }
}

class TransactionController {
  async checkout(req, res) {
    try {
      // req.user comes from authMiddleware
      const userId = req.user.id;
      const transaction = await transactionService.checkout(req.body, userId);
      
      return successResponse(res, 201, 'Transaction completed successfully', TransactionResponseDTO.map(transaction));
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const transactions = await transactionService.getAllTransactions();
      const mapped = transactions.map(t => TransactionResponseDTO.map(t));
      return successResponse(res, 200, 'Transactions retrieved successfully', mapped);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getById(req, res) {
    try {
      const transaction = await transactionService.getTransactionDetails(req.params.id);
      return successResponse(res, 200, 'Transaction details retrieved', TransactionResponseDTO.map(transaction));
    } catch (error) {
      return errorResponse(res, 404, error.message);
    }
  }
}

module.exports = new TransactionController();
