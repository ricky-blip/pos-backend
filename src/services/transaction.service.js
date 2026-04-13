const { transactionRepository } = require('../repositories/transaction.repository');
const { productRepository } = require('../repositories/product.repository');
const { CreateTransactionDto } = require('../dto/create-transaction.dto');

class TransactionService {
  async getAllTransactions() {
    return await transactionRepository.findAll();
  }

  async getTransactionById(id) {
    return await transactionRepository.findById(id);
  }

  async createTransaction(data) {
    const dto = new CreateTransactionDto(data);
    const validation = dto.validate();

    if (!validation.isValid) {
      const error = new Error(validation.errors.join(', '));
      error.status = 400;
      throw error;
    }

    // Calculate total & check stock
    let totalAmount = 0;
    const items = [];

    for (const item of data.items) {
      const product = await productRepository.findById(item.productId);
      
      if (product.stock < item.quantity) {
        const error = new Error(`Insufficient stock for product: ${product.name}`);
        error.status = 400;
        throw error;
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      items.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });

      // Reduce stock
      await productRepository.update(product.id, { stock: product.stock - item.quantity });
    }

    return await transactionRepository.create({
      items,
      totalAmount,
      paymentMethod: data.paymentMethod,
    });
  }
}

module.exports = { transactionService: new TransactionService() };
