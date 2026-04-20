async function authMiddleware(req, res, next) {
  const { authService } = require('../services/auth.service');
  const { userRepository } = require('../repositories/user.repository');

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    const error = new Error('Token diperlukan');
    error.status = 401;
    return next(error);
  }

  const decoded = authService.verifyToken(token);
  if (!decoded) {
    const error = new Error('Token tidak valid atau expired');
    error.status = 401;
    return next(error);
  }

  const user = await userRepository.findById(decoded.id);
  if (!user) {
    const error = new Error('User tidak ditemukan');
    error.status = 401;
    return next(error);
  }

  if (!user.isActive) {
    const error = new Error('Akun Anda dinonaktifkan. Hubungi administrator.');
    error.status = 403;
    return next(error);
  }

  req.user = decoded;
  next();
}

function roleMiddleware(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error('Akses ditolak');
      error.status = 403;
      return next(error);
    }
    next();
  };
}

module.exports = { authMiddleware, roleMiddleware };
