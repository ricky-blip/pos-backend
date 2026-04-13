const { validateProduct } = require('../utils/validation');

class CreateProductDto {
  constructor({ name, price, stock, category }) {
    this.name = name;
    this.price = price;
    this.stock = stock;
    this.category = category;
  }

  validate() {
    const errors = [];
    
    if (!this.name || typeof this.name !== 'string') {
      errors.push('Name is required and must be a string');
    }
    if (!this.price || typeof this.price !== 'number' || this.price < 0) {
      errors.push('Price is required and must be a positive number');
    }
    if (this.stock === undefined || typeof this.stock !== 'number' || this.stock < 0) {
      errors.push('Stock is required and must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

module.exports = { CreateProductDto };
