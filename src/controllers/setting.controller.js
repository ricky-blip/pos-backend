const settingService = require('../services/setting.service');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class SettingController {
  async getSettings(req, res) {
    try {
      const settings = await settingService.getAllSettings();
      return successResponse(res, 200, 'Berhasil mengambil pengaturan', settings);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async updateSettings(req, res) {
    try {
      const settings = await settingService.updateSettings(req.body);
      return successResponse(res, 200, 'Pengaturan berhasil diperbarui', settings);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }
}

module.exports = new SettingController();
