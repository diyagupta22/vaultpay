const path = require('path');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReceiptEmail = async (clientEmail, pdfPath) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: clientEmail,
    subject: 'Payment Receipt',
    text: 'Your payment has been received successfully.',
    attachments: [
      {
        filename: path.basename(pdfPath),
        path: pdfPath,
      },
    ],
  });
};

module.exports = { sendReceiptEmail };
