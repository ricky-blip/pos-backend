const express = require('express');
const { authRoutes } = require('../controllers/auth.controller');

const router = express.Router();

// Auth routes
router.use('/api/auth', authRoutes);

module.exports = { routes: router };
