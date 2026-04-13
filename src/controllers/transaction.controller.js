const express = require('express');
const { transactionService } = require('../services/transaction.service');

const router = express.Router();

// GET /api/transactions
router.get('/', async (req, res, next) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
});

// GET /api/transactions/:id
router.get('/:id', async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
});

// POST /api/transactions
router.post('/', async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
});

module.exports = { transactionRoutes: router };
