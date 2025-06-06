const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const CustomerLeisure=require('../models/customerleisure')
// Create a new customer
router.post('/', async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a customer by ID
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.get('/customerleisure/lastbalance/:customerId', async (req, res) => {
    try {
      const { customerId } = req.params;
  
      // Fetch the last balance entry for a specific customer
      const lastLeisureEntry = await CustomerLeisure.findOne({
        where: { CustomerID: customerId },
        order: [['TransactionDate', 'DESC']], // or another field that orders the most recent entry first
      });
  
      if (lastLeisureEntry) {
        res.json({ lastBalance: lastLeisureEntry.Balance });
      } else {
        res.status(404).json({ message: 'No records found' });
      }
    } catch (error) {
      console.error('Error fetching last balance:', error);
      res.status(500).json({ error: 'An error occurred while fetching the last balance' });
    }
});
// Update a customer by ID
router.put('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (customer) {
            await customer.update(req.body);
            res.json(customer);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a customer by ID
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (customer) {
            await customer.destroy();
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
