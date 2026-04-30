const shiftService = require('../services/shift.service');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class ShiftController {
  async getActiveShift(req, res) {
    try {
      const shift = await shiftService.getActiveShift(req.user.id);
      return successResponse(res, 200, 'Data shift aktif berhasil diambil', shift);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async startShift(req, res) {
    try {
      const { startingCash } = req.body;
      const shift = await shiftService.startShift(req.user.id, startingCash);
      return successResponse(res, 201, 'Shift berhasil dibuka', shift);
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  }

  async endShift(req, res) {
    try {
      const { actualEndingCash, notes } = req.body;
      const shift = await shiftService.endShift(req.user.id, { actualEndingCash, notes });
      return successResponse(res, 200, 'Shift berhasil ditutup', shift);
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  }
}

module.exports = new ShiftController();
