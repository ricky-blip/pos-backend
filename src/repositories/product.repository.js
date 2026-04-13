const { Product } = require('../models/product.model');

// In-memory storage (nanti bisa diganti database)
let products = [];
let nextId = 1;

class ProductRepository {
  async findAll() {
    return products;
  }

  async findById(id) {
    const product = products.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async create(data) {
    const product = new Product({
      id: nextId++,
      name: data.name,
      price: data.price,
      stock: data.stock,
      category: data.category,
    });
    products.push(product);
    return product;
  }

  async update(id, data) {
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }

    products[index] = new Product({
      ...products[index],
      ...data,
      updatedAt: new Date(),
    });

    return products[index];
  }

  async delete(id) {
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }
    products.splice(index, 1);
    return true;
  }
}

// Singleton pattern
module.exports = { productRepository: new ProductRepository() };
