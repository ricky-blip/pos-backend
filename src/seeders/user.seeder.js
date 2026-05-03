const { User } = require('../models/user.model');
const bcrypt = require('bcryptjs');

async function seedUsers() {
  const users = [
    {
      username: 'ricky',
      email: 'ricky@pos.com',
      password: 'ricky123',
      role: 'admin',
    },
    {
      username: 'budi',
      email: 'budi@pos.com',
      password: 'budi123',
      role: 'cashier',
    },
    {
      username: 'sarah',
      email: 'sarah@pos.com',
      password: 'sarah123',
      role: 'cashier',
    },
    {
      username: 'yuri',
      email: 'yuri@pos.com',
      password: 'yuri123',
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
