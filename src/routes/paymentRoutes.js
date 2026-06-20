const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createCheckoutSession } = require('../controllers/paymentController');

const router = express.Router();

router.post(
  '/create-checkout-session/:invoiceId',
  authMiddleware,
  createCheckoutSession
);

module.exports = router;
