const { Shift, Transaction, sequelize } = require('../models');
const { Op } = require('sequelize');

class ShiftService {
  async getActiveShift(userId) {
    return await Shift.findOne({
      where: { userId, status: 'OPEN' },
      order: [['startTime', 'DESC']]
    });
  }

  async startShift(userId, startingCash) {
    // Check if there is already an open shift
    const existing = await this.getActiveShift(userId);
    if (existing) {
      throw new Error('Anda masih memiliki shift yang terbuka. Harap tutup shift sebelumnya.');
    }

    return await Shift.create({
      userId,
      startingCash,
      status: 'OPEN',
      startTime: new Date()
    });
  }

  async endShift(userId, { actualEndingCash, notes }) {
    const shift = await this.getActiveShift(userId);
    if (!shift) {
      throw new Error('Tidak ada shift aktif yang ditemukan.');
    }

    // Calculate expected ending cash
    // expected = startingCash + total cash transactions between shift.startTime and now
    const cashTransactions = await Transaction.findAll({
      where: {
        userId,
        paymentMethod: 'cash',
        createdAt: { [Op.between]: [shift.startTime, new Date()] }
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('totalFinal')), 'totalCash']
      ],
      raw: true
    });

    const totalCashAmount = parseFloat(cashTransactions[0].totalCash || 0);
    const expectedEndingCash = parseFloat(shift.startingCash) + totalCashAmount;

    await shift.update({
      endTime: new Date(),
      expectedEndingCash,
      actualEndingCash,
      notes,
      status: 'CLOSED'
    });

    return shift;
  }
}

module.exports = new ShiftService();
