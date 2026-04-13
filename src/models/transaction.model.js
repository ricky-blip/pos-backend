class Transaction {
  constructor({ id, items, totalAmount, paymentMethod, status, createdAt }) {
    this.id = id;
    this.items = items;
    this.totalAmount = totalAmount;
    this.paymentMethod = paymentMethod;
    this.status = status || 'completed';
    this.createdAt = createdAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      items: this.items,
      totalAmount: this.totalAmount,
      paymentMethod: this.paymentMethod,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}

module.exports = { Transaction };
