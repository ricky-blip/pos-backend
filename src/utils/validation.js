function validateProduct(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (data.price === undefined || data.price === null) {
    errors.push('Price is required');
  } else if (typeof data.price !== 'number' || data.price < 0) {
    errors.push('Price must be a positive number');
  }

  if (data.stock === undefined || data.stock === null) {
    errors.push('Stock is required');
  } else if (typeof data.stock !== 'number' || data.stock < 0) {
    errors.push('Stock must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = { validateProduct };
