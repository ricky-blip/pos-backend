const { ActivityLog } = require('../models');

class ActivityService {
  /**
   * Log an activity to the database
   * @param {Object} data 
   */
  async log(data) {
    try {
      const { userId, action, description, status, req } = data;
      
      const logData = {
        userId,
        action,
        description,
        status: status || 'success',
      };

      // Extract client info if request object is provided
      if (req) {
        logData.ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        logData.userAgent = req.headers['user-agent'];
      }

      await ActivityLog.create(logData);
    } catch (error) {
      // We don't want to crash the app if logging fails, just log to console
      console.error('[ActivityService] Logging failed:', error);
    }
  }

  /**
   * Get logs with optional filters
   */
  async getLogs(filters = {}) {
    const { userId, action, limit = 50, offset = 0 } = filters;
    const where = {};
    
    if (userId) where.userId = userId;
    if (action) where.action = action;

    return await ActivityLog.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: ['user'] // Assumes relationship is named 'user'
    });
  }
}

module.exports = new ActivityService();
