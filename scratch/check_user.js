require('dotenv').config();
const { User } = require('../src/models');

async function checkUser() {
  try {
    const user = await User.findOne({ where: { username: 'rosa1' } });
    if (user) {
      console.log('User found:');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('User rosa1 not found');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUser();
