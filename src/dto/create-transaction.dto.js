class CreateTransactionDto {
  constructor({ items, paymentMethod }) {
    this.items = items;
    this.paymentMethod = paymentMethod;
  }

  validate() {
    const errors = [];

    if (!this.items || !Array.isArray(this.items) || this.items.length === 0) {
      errors.push('Items is required and must be a non-empty array');
    } else {
      this.items.forEach((item, index) => {
        if (!item.productId || !item.quantity || item.quantity < 1) {
          errors.push(`Item ${index + 1}: productId and quantity (min 1) are required`);
        }
      });
    }

    if (!this.paymentMethod || !['cash', 'card', 'qris'].includes(this.paymentMethod)) {
      errors.push('Payment method is required (cash, card, or qris)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

module.exports = { CreateTransactionDto };
