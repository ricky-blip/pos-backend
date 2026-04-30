const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const swaggerDocument = yaml.load(fs.readFileSync(path.join(__dirname, '../../swagger.yaml'), 'utf8'));

const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "PadiPos API Documentation"
};

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
  console.log('📖 Swagger documentation available at http://localhost:3000/api-docs');
};

module.exports = setupSwagger;
