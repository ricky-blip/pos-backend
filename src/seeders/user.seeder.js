const { User } = require('../models/user.model');
const bcrypt = require('bcryptjs');

async function seedUsers() {
  const users = [
    {
      username: 'admin',
      email: 'admin@pos.com',
      password: 'admin123',
      role: 'admin',
    },
    {
      username: 'kasir',
      email: 'kasir@pos.com',
      password: 'kasir123',
      role: 'cashier',
    },
  ];

  for (const userData of users) {
    const existing = await User.findOne({ where: { username: userData.username } });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });
      console.log(`✅ User ${userData.username} (${userData.role}) berhasil dibuat`);
    } else {
      console.log(`⚠️  User ${userData.username} sudah ada`);
    }
  }
}

module.exports = { seedUsers };
