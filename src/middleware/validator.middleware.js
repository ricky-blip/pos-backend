const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseHelper');

/**
 * validate - Middleware to check for validation errors
 * Should be used after the validation rules array in routes
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format error messages into a readable string or object
    const extractedErrors = errors.array().map(err => ({
      path: err.path,
      msg: err.msg
    }));

    return errorResponse(res, 400, 'Validation Error', extractedErrors);
  }
  next();
};

module.exports = { validate };
