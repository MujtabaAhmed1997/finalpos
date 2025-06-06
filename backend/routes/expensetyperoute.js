const express = require('express');
const router = express.Router();
const Expensetype = require('../models/expensetypemode'); // Adjust the path to your Expense model
router.post('/addtype', async (req, res) => {
    const { TypeName } = req.body;

    if (!TypeName) {
        return res.status(400).json({ message: 'ExpenseType is required' });
    }

    try {
        // Check for existing type (case-insensitive match)
        const existing = await Expensetype.findOne({
            where: sequelize.where(
                sequelize.fn('lower', sequelize.col('TypeName')),
                TypeName.toLowerCase()
            )
        });

        if (existing) {
            return res.status(409).json({ message: 'Expense Type already exists' });
        }

        const newExpenseType = await Expensetype.create({ TypeName });
        res.status(201).json({ message: 'Expense Type added successfully', data: newExpenseType });
    } catch (error) {
        console.error('Error creating expense type:', error);
        res.status(500).json({ message: 'Error creating expense type', error: error.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const types = await Expensetype.findAll({ order: [['createdAt', 'ASC']] });
        res.status(200).json(types);
    } catch (error) {
        console.error("Failed to fetch expense types:", error);
        res.status(500).json({ message: "Failed to fetch expense types." });
    }
});
module.exports = router;


