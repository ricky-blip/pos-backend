const activityService = require('../services/activity.service');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class ActivityLogController {
  async getLogs(req, res) {
    try {
      const { userId, action, limit, offset } = req.query;
      const filters = {
        userId: userId ? Number(userId) : undefined,
        action,
        limit: limit ? Number(limit) : 50,
        offset: offset ? Number(offset) : 0,
      };

      const logs = await activityService.getLogs(filters);
      return successResponse(res, 200, 'Daftar log aktivitas berhasil diambil', logs);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  }
}

module.exports = new ActivityLogController();
