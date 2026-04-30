const express = require('express');
const {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  adjustStock,
  getLowStockMenus,
  getStockLogs
} = require('../controllers/menu.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validator.middleware');
const { menuRequestValidators } = require('../dto/menu.dto');

const router = express.Router();

router.get('/', authMiddleware, getAllMenus);
router.get('/low-stock', authMiddleware, getLowStockMenus);
router.get('/logs', authMiddleware, getStockLogs);
router.get('/:id', authMiddleware, getMenuById);
router.get('/:id/logs', authMiddleware, getStockLogs);
router.post('/', authMiddleware, roleMiddleware('admin'), menuRequestValidators.create, validate, createMenu);
router.post('/:id/adjust', authMiddleware, roleMiddleware(['admin', 'cashier']), adjustStock);
router.put('/:id', authMiddleware, roleMiddleware('admin'), menuRequestValidators.update, validate, updateMenu);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteMenu);

module.exports = router;
