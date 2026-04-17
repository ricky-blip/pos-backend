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
}

module.exports = { authService: new AuthService() };
