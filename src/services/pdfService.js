const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const RECEIPTS_DIR = path.join(__dirname, '../../uploads/receipts');

const generateReceiptPDF = (invoice) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(RECEIPTS_DIR)) {
      fs.mkdirSync(RECEIPTS_DIR, { recursive: true });
    }

    const fileName = `receipt-${invoice.invoiceNumber}.pdf`;
    const filePath = path.join(RECEIPTS_DIR, fileName);

    const clientName = invoice.client?.name || 'N/A';
    const clientEmail = invoice.client?.email || 'N/A';
    const paymentDate =
      invoice.status === 'Paid' && invoice.updatedAt
        ? new Date(invoice.updatedAt).toLocaleDateString()
        : new Date().toLocaleDateString();

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(22).text('Nexus Corporate Services', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Client Name: ${clientName}`);
    doc.text(`Client Email: ${clientEmail}`);
    doc.text(`Amount: $${invoice.amount}`);
    doc.text(`Payment Status: ${invoice.status}`);
    doc.text(`Payment Date: ${paymentDate}`);

    doc.moveDown(3);
    doc.fontSize(56).text('PAID', { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
    doc.on('error', reject);
  });
};

module.exports = { generateReceiptPDF };
