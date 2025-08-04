const express = require('express');
const router = express.Router();
const { SalesOrder } = require('../models/index');
const Customer = require('../models/customer');

// Create SalesOrder
router.post('/', async (req, res) => {
  try {
    const salesOrder = await SalesOrder.create(req.body);
    res.status(201).json(salesOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All SalesOrders with Pagination
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await SalesOrder.findAndCountAll({
      include: {
        model: Customer,
        attributes: ['CustomerName'], // Include only the CustomerName attribute
      },
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      salesOrders: rows,
      totalPages,
      totalRecords: count
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read One SalesOrder by ID
router.get('/:id', async (req, res) => {
  try {
    const salesOrder = await SalesOrder.findByPk(req.params.id, {
      include: {
        model: Customer,
        attributes: ['CustomerName'],
      }
    });
    if (salesOrder) {
      res.status(200).json(salesOrder);
    } else {
      res.status(404).json({ error: 'SalesOrder not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update SalesOrder by ID
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await SalesOrder.update(req.body, {
      where: { SalesOrderID: req.params.id }
    });
    if (updated) {
      const updatedSalesOrder = await SalesOrder.findByPk(req.params.id, {
        include: {
          model: Customer,
          attributes: ['CustomerName'],
        }
      });
      res.status(200).json(updatedSalesOrder);
    } else {
      res.status(404).json({ error: 'SalesOrder not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete SalesOrder by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await SalesOrder.destroy({
      where: { SalesOrderID: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'SalesOrder not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
