const express = require('express');
const sequelize = require('../db/sequelize');
const Supplier = require('../models/supplier');
const router = express.Router();



// Create a new supplier
router.post('/', async (req, res) => {
    try {
        const supplier = await Supplier.create(req.body);
        res.status(201).json(supplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a supplier by ID
router.get('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (supplier) {
            res.json(supplier);
        } else {
            res.status(404).json({ error: 'Supplier not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        res.json(suppliers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a supplier by ID
router.put('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (supplier) {
            await supplier.update(req.body);
            res.json(supplier);
        } else {
            res.status(404).json({ error: 'Supplier not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// supplier by purchaseorder
router.get('/purchaseOrder/:id/supplier', async (req, res) => {
    const purchaseOrderId = req.params.id;
  
    try {
      const details = await Supplier.findAll({ where: { PurchaseOrderID: purchaseOrderId } });
      res.json(details);
    } catch (err) {
      console.error('Error fetching purchase order details:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
// Delete a supplier by ID
router.delete('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (supplier) {
            await supplier.destroy();
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Supplier not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
