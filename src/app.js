const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./middleware/logger');
const { routes } = require('./routes');

const app = express();

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use(routes);

// Health check
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.json({ status: 'ok', database: 'disconnected', timestamp: new Date().toISOString() });
  }
});

// Error handling
app.use(errorHandler);

// Sync database & start
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database terhubung!');

    // Initialize models and their associations
    require('./models');

    await sequelize.sync({ alter: true });
    console.log('✅ Database synced!');

    // Run seeder
    const { seedUsers } = require('./seeders/user.seeder');
    const { seedCategoriesAndMenus } = require('./seeders/categoryMenu.seeder');
    await seedUsers();
    await seedCategoriesAndMenus();
  } catch (error) {
    console.error('❌ Gagal koneksi database:', error.message);
  }
};

syncDatabase();

module.exports = app;
