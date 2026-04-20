const express = require('express');
const transactionController = require('../controllers/transaction.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/transactions
 * @desc    Process a new checkout (Cashier only)
 * @access  Private
 */
router.post(
  '/', 
  authMiddleware, 
  roleMiddleware(['cashier', 'admin']), // Cashier is priority, admin also allowed
  transactionController.checkout
);

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions (History)
 * @access  Private
 */
router.get(
  '/', 
  authMiddleware, 
  transactionController.getAll
);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get single transaction details
 * @access  Private
 */
router.get(
  '/:id', 
  authMiddleware, 
  transactionController.getById
);

module.exports = router;
