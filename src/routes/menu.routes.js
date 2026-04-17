const express = require('express');
const {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu
} = require('../controllers/menu.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validator.middleware');
const { menuRequestValidators } = require('../dto/menu.dto');

const router = express.Router();

router.get('/', authMiddleware, getAllMenus);
router.get('/:id', authMiddleware, getMenuById);
router.post('/', authMiddleware, roleMiddleware('admin'), menuRequestValidators.create, validate, createMenu);
router.put('/:id', authMiddleware, roleMiddleware('admin'), menuRequestValidators.update, validate, updateMenu);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteMenu);

module.exports = router;
