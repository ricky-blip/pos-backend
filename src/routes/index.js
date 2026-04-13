const express = require('express');
const { productRoutes } = require('../controllers/product.controller');
const { transactionRoutes } = require('../controllers/transaction.controller');

const router = express.Router();

// API prefix
router.use('/api/products', productRoutes);
router.use('/api/transactions', transactionRoutes);

module.exports = { routes: router };
