const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const { createInvoice, getClients, getInvoices, getInvoiceById } = require('../controllers/invoiceController');

const router = express.Router();

router.get('/clients', authMiddleware, allowRoles('admin'), getClients);
router.get('/', authMiddleware, getInvoices);
router.post('/', authMiddleware, allowRoles('admin'), createInvoice);
router.get('/:id', authMiddleware, getInvoiceById);

module.exports = router;
