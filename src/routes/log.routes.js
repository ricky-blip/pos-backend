const express = require('express');
const activityLogController = require('../controllers/activityLog.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin only: view activity logs
router.get('/', authMiddleware, roleMiddleware('admin'), activityLogController.getLogs);

module.exports = { logRoutes: router };
