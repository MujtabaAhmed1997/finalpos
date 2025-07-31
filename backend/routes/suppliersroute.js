const express = require('express');
const sequelize = require('../db/sequelize');
const Supplier = require('../models/supplier');
const { Op } = require('sequelize');
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

// Get all suppliers with search functionality and pagination
router.get('/', async (req, res) => {
    const { page = 1, pageSize = 10, search } = req.query;
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    console.log('Query parameters:', req.query);
    console.log('Search term:', search);

    try {
        let whereClause = {};

        // Add search functionality by supplier name
        if (search && search.trim()) {
            whereClause = {
                [Op.or]: [
                    {
                        SupplierName: {
                            [Op.like]: `%${search.trim()}%`
                        }
                    },
                    {
                        ContactName: {
                            [Op.like]: `%${search.trim()}%`
                        }
                    }
                ]
            };
            console.log('Where clause:', whereClause);
        }

        const queryOptions = {
            where: whereClause,
            offset,
            limit,
            order: [['SupplierName', 'ASC']] // Sort by SupplierName in ascending order
        };

        console.log('Query options:', JSON.stringify(queryOptions, null, 2));

        const { rows: suppliers, count } = await Supplier.findAndCountAll(queryOptions);

        const totalPages = Math.ceil(count / pageSize);

        res.json({
            suppliers,
            totalPages,
            currentPage: parseInt(page),
            totalCount: count
        });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ error: 'Internal server error' });
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
