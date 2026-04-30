const { Settings } = require('../models');

class SettingService {
  async getAllSettings() {
    const settings = await Settings.findAll();
    const config = {};
    settings.forEach(s => {
      config[s.key] = s.value;
    });
    return config;
  }

  async updateSettings(data) {
    // data is an object { key1: value1, key2: value2 }
    const promises = Object.entries(data).map(([key, value]) => {
      return Settings.upsert({ key, value });
    });
    await Promise.all(promises);
    return await this.getAllSettings();
  }

  async getSettingByKey(key) {
    const setting = await Settings.findOne({ where: { key } });
    return setting ? setting.value : null;
  }
}

module.exports = new SettingService();
