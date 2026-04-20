const express = require('express');
const { authService } = require('../services/auth.service');
const activityService = require('../services/activity.service');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const { authMiddleware } = require('../middleware/authMiddleware');


const router = express.Router();

// ... register ...
router.post('/register', async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    
    await activityService.log({
      userId: result.user.id,
      action: 'REGISTER',
      description: 'User baru mendaftar',
      req
    });

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
    
    // Log Activity
    await activityService.log({
      userId: result.user.id,
      action: 'LOGIN',
      description: 'User login ke sistem',
      req
    });

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

// PUT /api/auth/change-password (protected)
router.put('/change-password', authMiddleware, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      const error = new Error('Password lama dan baru wajib diisi');
      error.status = 400;
      throw error;
    }

    await authService.changePassword(req.user.id, oldPassword, newPassword);
    
    // Log Activity
    await activityService.log({
      userId: req.user.id,
      action: 'CHANGE_PASSWORD',
      description: 'User mengganti password mandiri',
      req
    });

    successResponse(res, 200, 'Password berhasil diubah');
  } catch (error) {
    next(error);
  }
});

// PUT /api/auth/profile (protected)
router.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { username, email, currentPassword } = req.body;
    
    if (!currentPassword) {
      const error = new Error('Konfirmasi password diperlukan');
      error.status = 400;
      throw error;
    }

    const user = await authService.updateProfile(req.user.id, currentPassword, { username, email });
    
    // Log Activity
    await activityService.log({
      userId: req.user.id,
      action: 'UPDATE_PROFILE',
      description: 'User memperbarui data profil (Username/Email)',
      req
    });

    successResponse(res, 200, 'Profil berhasil diperbarui', user);
  } catch (error) {
    next(error);
  }
});


module.exports = { authRoutes: router };
