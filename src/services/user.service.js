const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

class UserService {
  /**
   * Get all users for admin
   */
  async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * Create new user (Staff)
   */
  async createUser(userData) {
    const { username, email, password, role } = userData;

    const existing = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existing) {
      const error = new Error('Username atau Email sudah terdaftar');
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'cashier',
      isActive: true
    });
  }

  /**
   * Update user info or status
   */
  async updateUser(id, updateData) {
    const user = await User.findByPk(id);
    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.status = 404;
      throw error;
    }

    const { username, email, role, isActive, avatar } = updateData;

    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    // Return without password
    const result = user.toJSON();
    delete result.password;
    return result;
  }

  /**
   * Admin resets user password manually
   */
  async resetPassword(id, newPassword) {
    const user = await User.findByPk(id);
    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.status = 404;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return true;
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.status = 404;
      throw error;
    }
    await user.destroy();
    return true;
  }
}

module.exports = new UserService();
