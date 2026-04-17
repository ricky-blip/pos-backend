const { errorResponse } = require('../utils/responseHelper');

function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  errorResponse(res, status, message, process.env.NODE_ENV === 'development' ? err.stack : null);
}

module.exports = { errorHandler };
