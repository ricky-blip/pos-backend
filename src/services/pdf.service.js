const PDFDocument = require('pdfkit');

class PdfService {
  /**
   * Men-generate buffer PDF untuk Laporan Penjualan
   * @param {Object} data 
   * @param {Object} data.summary - Ringkasan total
   * @param {Array} data.transactions - Daftar transaksi
   * @param {Object} filters - Info filter
   * @returns {Promise<Buffer>}
   */
  async generateSalesReport(data, filters) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Header
        doc.fontSize(20).text('Laporan Penjualan PadiPos', { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(12).text(`Periode: ${filters.startDate ? filters.startDate.substring(0, 10) : 'Semua'} s/d ${filters.endDate ? filters.endDate.substring(0, 10) : 'Semua'}`);
        doc.text(`Dicetak pada: ${new Date().toLocaleString()}`);
        doc.moveDown(2);

        // Ringkasan
        doc.fontSize(16).text('Ringkasan', { underline: true });
        doc.fontSize(12);
        doc.text(`Total Transaksi : ${data.summary.totalOrders || 0}`);
        doc.text(`Total Pendapatan: Rp ${this._formatCurrency(data.summary.totalOmzet || 0)}`);
        doc.text(`Total Item      : ${data.summary.totalItems || 0}`);
        doc.moveDown(2);

        // Tabel Daftar Transaksi (Sederhana)
        doc.fontSize(16).text('Daftar Transaksi', { underline: true });
        doc.moveDown();

        const tableTop = doc.y;
        const col1 = 50;
        const col2 = 150;
        const col3 = 250;
        const col4 = 400;

        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Tanggal', col1, tableTop);
        doc.text('Invoice', col2, tableTop);
        doc.text('Metode', col3, tableTop);
        doc.text('Total', col4, tableTop);
        
        let y = tableTop + 20;
        doc.font('Helvetica');

        data.transactions.forEach(t => {
          // New page if near bottom
          if (y > 700) {
            doc.addPage();
            y = 50;
          }
          doc.text(new Date(t.createdAt).toLocaleDateString(), col1, y);
          doc.text(t.invoiceNumber || '-', col2, y);
          doc.text(t.paymentMethod || '-', col3, y);
          doc.text(`Rp ${this._formatCurrency(t.totalFinal)}`, col4, y);
          y += 20;
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  _formatCurrency(amount) {
    return parseFloat(amount).toLocaleString('id-ID');
  }
}

module.exports = new PdfService();
