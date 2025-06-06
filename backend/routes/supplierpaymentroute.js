
const express = require('express');
const router = express.Router();
const SupplierPayment = require('../models/supplierpaymentmodel');
const PurchaseOrder = require('../models/purchaseorder');
const Supplier = require('../models/supplier');

// Create a new SupplierPayment
router.post('/', async (req, res) => {
  try {
    const supplierPayment = await SupplierPayment.create(req.body);
    res.status(201).json(supplierPayment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all SupplierPayments with pagination
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await SupplierPayment.findAndCountAll({
      include: [{
        model: PurchaseOrder, // Adjust as per your model associations
        attributes: ['PurchaseOrderID', 'OrderDate', 'TotalAmount'], // Include necessary attributes
      },{
        model:Supplier,
        attributes:['SupplierName']

      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      supplierPayments: rows,
      totalPages,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
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

module.exports = router;
