function successResponse(res, statusCode, message, data = null) {
  return res.status(statusCode).json({
    meta: {
      code: statusCode,
      status: 'success',
      message,
    },
    ...(data !== null && { data }),
  });
}

function errorResponse(res, statusCode, message, errors = null) {
  return res.status(statusCode).json({
    meta: {
      code: statusCode,
      status: 'error',
      message,
    },
    ...(errors !== null && { errors }),
  });
}

module.exports = { successResponse, errorResponse };
