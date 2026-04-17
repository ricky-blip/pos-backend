const express = require('express');
const { authService } = require('../services/auth.service');
const { successResponse } = require('../utils/responseHelper');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    successResponse(res, 201, 'Berhasil Registrasi', {
      access_token: result.token,
      token_type: 'Bearer',
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    if (!req.body) {
      const error = new Error('Request body diperlukan');
      error.status = 400;
      throw error;
    }

    const { username, password } = req.body;

    if (!username || !password) {
      const error = new Error('Username dan password wajib diisi');
      error.status = 400;
      throw error;
    }

    const result = await authService.login(username, password);
    successResponse(res, 200, 'Berhasil Login', {
      access_token: result.token,
      token_type: 'Bearer',
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me (protected)
router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      const error = new Error('Token diperlukan');
      error.status = 401;
      throw error;
    }

    const decoded = authService.verifyToken(token);
    if (!decoded) {
      const error = new Error('Token tidak valid');
      error.status = 401;
      throw error;
    }

    const user = await authService.getUserById(decoded.id);
    successResponse(res, 200, 'Berhasil mengambil data user', user);
  } catch (error) {
    next(error);
  }
});

module.exports = { authRoutes: router };
