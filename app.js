const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const invoiceRoutes = require('./src/routes/invoiceRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const webhookRoutes = require('./src/routes/webhookRoutes');

const app = express();

app.use(cors());

// Stripe webhook requires raw body — must be registered before express.json()
app.use('/api/webhooks', webhookRoutes);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'VaultPay Financial Core API Running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);

module.exports = app;
