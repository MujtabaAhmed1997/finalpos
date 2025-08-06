
const express = require('express');
const router = express.Router();
const SupplierPayment = require('../models/supplierpaymentmodel');
const PurchaseOrder = require('../models/purchaseorder');
const Supplier = require('../models/supplier');
const { Op } = require('sequelize');

// Create a new SupplierPayment
router.post('/', async (req, res) => {
  try {
    const supplierPayment = await SupplierPayment.create(req.body);
    res.status(201).json(supplierPayment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all SupplierPayments with pagination and search functionality
router.get('/', async (req, res) => {
  const { page = 1, pageSize = 10, search } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  console.log('Query parameters:', req.query);
  console.log('Search term:', search);

  try {
    let whereClause = {};
    let supplierWhereClause = {};

    // Add search functionality by supplier name
    if (search && search.trim()) {
      supplierWhereClause = {
        SupplierName: {
          [Op.like]: `%${search.trim()}%`
        }
      };
      console.log('Supplier where clause:', supplierWhereClause);
    }

    const queryOptions = {
      where: whereClause,
      offset,
      limit,
      include: [{
        model: Supplier,
        attributes: ["SupplierName"],
        where: supplierWhereClause
      }],
      order: [['PaymentDate', 'DESC']] // Sort by PaymentDate in descending order
    };

    console.log('Query options:', JSON.stringify(queryOptions, null, 2));

    const { rows: payments, count } = await SupplierPayment.findAndCountAll(queryOptions);

    const totalPages = Math.ceil(count / pageSize);

    res.json({
      supplierPayments: payments,
      totalPages,
      currentPage: parseInt(page),
      totalCount: count
    });
  } catch (err) {
    console.error('Error fetching supplier payments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get supplier payments by PurchaseOrderID
router.get('/fk/:purchaseOrderId', async (req, res) => {
  const purchaseOrderId = req.params.purchaseOrderId;

  try {
    const supplierPayments = await SupplierPayment.findAll({
      where: { PurchaseOrderID: purchaseOrderId },
      include: [{ model: PurchaseOrder }] // Include PurchaseOrder details if needed
    });

    res.status(200).json(supplierPayments);
  } catch (err) {
    console.error('Error fetching supplier payments:', err);
    res.status(500).json({ error: 'Failed to fetch supplier payments' });
  }
});

// Get a SupplierPayment by ID
router.get('/:id', async (req, res) => {
  try {
    const supplierPayment = await SupplierPayment.findByPk(req.params.id);
    if (supplierPayment) {
      res.status(200).json(supplierPayment);
    } else {
      res.status(404).json({ error: 'SupplierPayment not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a SupplierPayment
router.put('/:id', async (req, res) => {
  try {
    const supplierPayment = await SupplierPayment.findByPk(req.params.id);
    if (supplierPayment) {
      await supplierPayment.update(req.body);
      res.status(200).json(supplierPayment);
    } else {
      res.status(404).json({ error: 'SupplierPayment not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a SupplierPayment
router.delete('/:id', async (req, res) => {
  try {
    const supplierPayment = await SupplierPayment.findByPk(req.params.id);
    if (supplierPayment) {
      await supplierPayment.destroy();
      res.status(200).json({ message: 'SupplierPayment deleted' });
    } else {
      res.status(404).json({ error: 'SupplierPayment not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get today's payments for a specific supplier
router.get('/today/:supplierId', async (req, res) => {
  try {
    const { supplierId } = req.params;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todayPayments = await SupplierPayment.findAll({
      where: {
        SupplierId: supplierId,
        PaymentDate: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay
        }
      },
      include: [{
        model: Supplier,
        attributes: ['SupplierName']
      }],
      order: [['PaymentDate', 'DESC']]
    });

    const totalToday = todayPayments.reduce((sum, payment) => sum + parseFloat(payment.PaymentAmount || 0), 0);

    res.json({
      todayPayments,
      totalToday,
      paymentCount: todayPayments.length
    });
  } catch (err) {
    console.error('Error fetching today\'s supplier payments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
