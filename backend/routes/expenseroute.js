const express = require('express');
const router = express.Router();
const Expense = require('../models/expensesmodel'); // Adjust the path to your Expense model

router.post('/addExpense', async (req, res, next) => {
    const { ExpenseType, Amount, Date } = req.body

    if (!ExpenseType || !Amount || !Date) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newExpense = await Expense.create({
            ExpenseType, Amount, Date
        });
        res.status(201).json({ message: 'Expense added successfully', batch: newExpense });
    } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ message: 'Failed to create batch', error: error.message });
}
})

router.get('/allexpenses', async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default values: page 1, 10 items per page

    try {
        const expenses = await Expense.findAll({
            order: [['Date', 'DESC']], // Sort by Date in descending order
            offset: (page - 1) * limit, // Skip items for previous pages
            limit: Number(limit), // Limit the number of items per page
        });

        // Get the total count of expenses
        const totalCount = await Expense.count();

        res.status(200).json({
            message: 'Expenses retrieved successfully',
            expenses,
            pagination: {
                totalCount,
                currentPage: Number(page),
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Failed to fetch expenses', error: error.message });
    }
});


// Update an expense by ID
router.put('/updateExpense/:id', async (req, res) => {
    const { id } = req.params;
    const { ExpenseType, Amount, Date } = req.body;

    if (!ExpenseType || !Amount || !Date) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Perform the update with Sequelize
        const [updatedRows] = await Expense.update(
            { ExpenseType, Amount, Date },
            {
                where: { ExpenseID: id },  // Update based on the primary key
                returning: true,  // Return the updated record
            }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Returning the updated expense
        const updatedExpense = await Expense.findOne({ where: { ExpenseID: id } });

        res.status(200).json({
            message: 'Expense updated successfully',
            updatedExpense,
        });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ message: 'Failed to update expense', error: error.message });
    }
});

// Delete an expense by ID
router.delete('/deleteExpense/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRows = await Expense.destroy({
            where: { ExpenseID: id },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json({
            message: 'Expense deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Failed to delete expense', error: error.message });
    }
});


module.exports = router;
