const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

const generateInvoiceNumber = async () => {
  const latestInvoice = await Invoice.findOne()
    .sort({ createdAt: -1 })
    .select('invoiceNumber');

  if (!latestInvoice) {
    return 'INV-1001';
  }

  const lastNumber = parseInt(latestInvoice.invoiceNumber.split('-')[1], 10);
  return `INV-${lastNumber + 1}`;
};

const createInvoice = async (req, res) => {
  try {
    const { clientId, clientEmail, amount, description, dueDate } = req.body;

    let client;

    if (clientId && mongoose.isValidObjectId(clientId)) {
      client = await User.findById(clientId);
    } else if (clientEmail) {
      client = await User.findOne({ email: clientEmail });
    } else if (clientId) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid clientId. Remove CLIENT_USER_ID and use clientEmail (e.g. client@test.com) or a real client _id from GET /api/invoices/clients',
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Provide clientEmail or a valid clientId',
      });
    }

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    if (client.role !== 'client') {
      return res.status(400).json({
        success: false,
        message: `User is not a client. "${client.email}" is an admin. Use a client email like client@test.com`,
      });
    }

    const invoiceNumber = await generateInvoiceNumber();

    const invoice = await Invoice.create({
      invoiceNumber,
      client: client._id,
      amount,
      description,
      dueDate,
      status: 'Pending',
    });

    await invoice.populate('client', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getClients = async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' }).select('_id name email role');

    res.status(200).json({
      success: true,
      clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getInvoices = async (req, res) => {
  try {
    let invoices;

    if (req.user.role === 'admin') {
      invoices = await Invoice.find()
        .populate('client', 'name email')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'client') {
      invoices = await Invoice.find({ client: req.user.userId })
        .populate('client', 'name email')
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Access denied.',
      });
    }

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    const invoice = await Invoice.findById(id).populate('client', 'name email role');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    if (req.user.role === 'admin') {
      return res.status(200).json({
        success: true,
        invoice,
      });
    }

    if (req.user.role === 'client') {
      const clientId = invoice.client._id
        ? invoice.client._id.toString()
        : invoice.client.toString();

      if (clientId !== req.user.userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden. You cannot access this invoice.',
        });
      }

      return res.status(200).json({
        success: true,
        invoice,
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Forbidden. You cannot access this invoice.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createInvoice, getClients, getInvoices, getInvoiceById };
