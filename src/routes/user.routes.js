const express = require('express');
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

// Middleware to check if admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      meta: { code: 403, status: 'error', message: 'Akses ditolak: Hanya admin yang diizinkan' }
    });
  }
  next();
};

// Admin Routes
router.get('/', adminOnly, userController.getAllUsers);
router.post('/', adminOnly, userController.createUser);
router.put('/:id', adminOnly, userController.updateUser);
router.delete('/:id', adminOnly, userController.deleteUser);
router.put('/:id/reset-password', adminOnly, userController.resetPassword);

module.exports = { userRoutes: router };
