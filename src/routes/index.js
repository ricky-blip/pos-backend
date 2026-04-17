const express = require('express');
const { authRoutes } = require('../controllers/auth.controller');
const categoryRoutes = require('./category.routes');
const menuRoutes = require('./menu.routes');

const routes = express.Router();

routes.use('/api/auth', authRoutes);
routes.use('/api/categories', categoryRoutes);
routes.use('/api/menus', menuRoutes);

module.exports = { routes };
