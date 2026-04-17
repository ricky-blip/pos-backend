const { User } = require('../models/user.model');

class UserRepository {
  async findAll() {
    return await User.findAll({ attributes: { exclude: ['password'] } });
  }

  async findById(id) {
    return await User.findByPk(id, { attributes: { exclude: ['password'] } });
  }

  async findByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async create(data) {
    return await User.create(data);
  }

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.update(data);
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
    return true;
  }
}

module.exports = { userRepository: new UserRepository() };
