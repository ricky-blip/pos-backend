const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userRepository } = require('../repositories/user.repository');

const JWT_SECRET = process.env.JWT_SECRET || 'pos-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

class AuthService {
  async register(data) {
    const { username, email, password, role } = data;

    // Validasi
    if (!username || !email || !password) {
      const error = new Error('Username, email, dan password wajib diisi');
      error.status = 400;
      throw error;
    }

    // Cek username/email sudah ada
    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      const error = new Error('Username sudah digunakan');
      error.status = 400;
      throw error;
    }

    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      const error = new Error('Email sudah digunakan');
      error.status = 400;
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'cashier',
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async login(username, password) {
    // Cari user
    const user = await userRepository.findByUsername(username);
    if (!user) {
      const error = new Error('Username atau password salah');
      error.status = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Akun Anda dinonaktifkan. Hubungi administrator.');
      error.status = 403;
      throw error;
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Username atau password salah');
      error.status = 401;
      throw error;
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.status = 404;
      throw error;
    }
    return user;
  }

  async changePassword(userId, oldPassword, newPassword) {
    // 1. Get user with password
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.status = 404;
      throw error;
    }

    // 2. Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      const error = new Error('Password lama salah');
      error.status = 401;
      throw error;
    }

    // 3. Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update user
    await userRepository.update(userId, { password: hashedNewPassword });

    return true;
  }

  async updateProfile(userId, currentPassword, updateData) {
    // 1. Get user with password
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      const error = new Error('User tidak ditemukan');
      error.status = 404;
      throw error;
    }

    // 2. Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      const error = new Error('Konfirmasi password salah');
      error.status = 401;
      throw error;
    }

    // 3. Update fields
    const { username, email } = updateData;
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;

    await userRepository.update(userId, updates);

    // Get fresh user for response
    const updatedUser = await userRepository.findById(userId);
    return updatedUser;
  }
}

module.exports = { authService: new AuthService() };
