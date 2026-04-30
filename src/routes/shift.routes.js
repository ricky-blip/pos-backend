const express = require('express');
const shiftController = require('../controllers/shift.controller');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/active', authMiddleware, shiftController.getActiveShift);
router.post('/start', authMiddleware, shiftController.startShift);
router.post('/end', authMiddleware, shiftController.endShift);

module.exports = router;
