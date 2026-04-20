const userService = require('../services/user.service');
const activityService = require('../services/activity.service');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class UserController {
  /**
   * Get all users (Admin Only)
   */
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      return successResponse(res, 200, 'Daftar user berhasil diambil', users);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  /**
   * Create new user/staff
   */
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      
      // Log Activity
      await activityService.log({
        userId: req.user.id,
        action: 'CREATE_USER',
        description: `Mendaftarkan user baru: ${user.username} (${user.role})`,
        req
      });

      return successResponse(res, 201, 'User berhasil didaftarkan', user);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  }

  /**
   * Update user info
   */
  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      
      // Log Activity
      await activityService.log({
        userId: req.user.id,
        action: 'UPDATE_USER',
        description: `Memperbarui data user ID: ${req.params.id}`,
        req
      });

      return successResponse(res, 200, 'Data user berhasil diperbarui', user);
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  }

  /**
   * Reset user password
   */
  async resetPassword(req, res) {
    try {
      const { newPassword } = req.body;
      if (!newPassword) {
        return errorResponse(res, 400, 'Password baru wajib diisi');
      }

      await userService.resetPassword(req.params.id, newPassword);
      
      // Log Activity
      await activityService.log({
        userId: req.user.id,
        action: 'RESET_PASSWORD_STAFF',
        description: `Mereset password user ID: ${req.params.id}`,
        req
      });

      return successResponse(res, 200, 'Password user berhasil direset');
    } catch (error) {
      return errorResponse(res, error.status || 500, error.message);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      
      // Log Activity
      await activityService.log({
        userId: req.user.id,
        action: 'DELETE_USER',
        description: `Menghapus user ID: ${req.params.id}`,
        req
      });

      return successResponse(res, 200, 'User berhasil dihapus');
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }
}

module.exports = new UserController();
