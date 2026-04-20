const express = require('express');
const reportController = require('../controllers/report.controller');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/reports/sales
 * @desc    Get sales report (Summary + List) with RBAC
 * @access  Private
 */
router.get('/sales', authMiddleware, reportController.getSalesReport);
router.get('/dashboard', authMiddleware, reportController.getDashboardStats);
router.get('/top-selling', authMiddleware, reportController.getTopSellingItems);


module.exports = router;
