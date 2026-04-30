const express = require('express');
const { authRoutes } = require('../controllers/auth.controller');
const categoryRoutes = require('./category.routes');
const menuRoutes = require('./menu.routes');
const transactionRoutes = require('./transaction.routes');
const reportRoutes = require('./report.routes');
const { userRoutes } = require('./user.routes');
const { logRoutes } = require('./log.routes');
const shiftRoutes = require('./shift.routes');
const settingRoutes = require('./setting.routes');

const routes = express.Router();

routes.use('/api/auth', authRoutes);
routes.use('/api/categories', categoryRoutes);
routes.use('/api/menus', menuRoutes);
routes.use('/api/transactions', transactionRoutes);
routes.use('/api/reports', reportRoutes);
routes.use('/api/users', userRoutes);
routes.use('/api/logs', logRoutes);
routes.use('/api/shifts', shiftRoutes);
routes.use('/api/settings', settingRoutes);

module.exports = { routes };
