const { productRepository } = require('../repositories/product.repository');
const { CreateProductDto } = require('../dto/create-product.dto');

class ProductService {
  async getAllProducts() {
    return await productRepository.findAll();
  }

  async getProductById(id) {
    return await productRepository.findById(id);
  }

  async createProduct(data) {
    const dto = new CreateProductDto(data);
    const validation = dto.validate();

    if (!validation.isValid) {
      const error = new Error(validation.errors.join(', '));
      error.status = 400;
      throw error;
    }

    return await productRepository.create(dto);
  }

  async updateProduct(id, data) {
    return await productRepository.update(id, data);
  }

  async deleteProduct(id) {
    return await productRepository.delete(id);
  }
}

// Singleton pattern
module.exports = { productService: new ProductService() };
