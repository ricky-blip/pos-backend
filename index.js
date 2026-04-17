require('dotenv').config();
const app = require('./src/app');
const { config } = require('./src/config/app');

app.listen(config.port, () => {
  console.log(`Server berjalan di http://localhost:${config.port}`);
  console.log(`Environment: ${config.env}`);
});
