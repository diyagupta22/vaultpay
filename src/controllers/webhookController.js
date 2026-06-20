const stripe = require('../config/stripe');
const Invoice = require('../models/Invoice');
const { sendPaymentReceipt } = require('../services/paymentReceiptService');

const handleStripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const invoiceId = session.metadata?.invoiceId;

    if (invoiceId) {
      const invoice = await Invoice.findById(invoiceId);

      if (invoice) {
        invoice.status = 'Paid';
        await invoice.save();

        try {
          await sendPaymentReceipt(invoice._id);
        } catch (error) {
          console.error('Payment receipt error:', error.message);
        }
      }
    }
  }

  res.status(200).json({ received: true });
};

module.exports = { handleStripeWebhook };
