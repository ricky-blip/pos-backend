const express = require('express');
const settingController = require('../controllers/setting.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, settingController.getSettings);
router.post('/', authMiddleware, roleMiddleware('admin'), settingController.updateSettings);

module.exports = router;
