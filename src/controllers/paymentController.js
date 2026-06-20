const mongoose = require('mongoose');
const stripe = require('../config/stripe');
const Invoice = require('../models/Invoice');

const createCheckoutSession = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    if (!mongoose.isValidObjectId(invoiceId)) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    if (req.user.role === 'client') {
      if (invoice.client.toString() !== req.user.userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden. You cannot access this invoice.',
        });
      }
    }

    if (invoice.status === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Invoice is already paid',
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: invoice.invoiceNumber,
            },
            unit_amount: Math.round(invoice.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment-cancel`,
      metadata: {
        invoiceId: invoice._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createCheckoutSession };
