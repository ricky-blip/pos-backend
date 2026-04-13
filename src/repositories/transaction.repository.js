const { Transaction } = require('../models/transaction.model');

let transactions = [];
let nextId = 1;

class TransactionRepository {
  async findAll() {
    return transactions;
  }

  async findById(id) {
    const transaction = transactions.find(t => t.id === parseInt(id));
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }

  async create(data) {
    const transaction = new Transaction({
      id: nextId++,
      items: data.items,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      status: 'completed',
    });
    transactions.push(transaction);
    return transaction;
  }
}

module.exports = { transactionRepository: new TransactionRepository() };
