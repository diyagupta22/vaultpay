const Invoice = require('../models/Invoice');
const { generateReceiptPDF } = require('./pdfService');
const { sendReceiptEmail } = require('./emailService');

const sendPaymentReceipt = async (invoiceId) => {
  const invoice = await Invoice.findById(invoiceId).populate('client', 'name email');

  if (!invoice || invoice.status !== 'Paid') {
    return;
  }

  const pdfPath = await generateReceiptPDF(invoice);
  await sendReceiptEmail(invoice.client.email, pdfPath);

  return pdfPath;
};

module.exports = { sendPaymentReceipt };
