const express = require('express');
const router = express.Router();
const Reminder = require('../models/remindermodel');
const CustomersPayment = require('../models/customerpayment');

// Helper function to check today's reminders
async function checkTodayReminders() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const reminders = await Reminder.findAll({
            where: {
                createdAt: {
                    [require('sequelize').Op.gte]: today
                }
            },
            limit: 1
        });
        return reminders.length > 0;
    } catch (error) {
        console.error('Error checking reminders:', error);
        return false;
    }
}

// Helper function to check overdue payments
async function checkOverduePayments() {
    try {
        const today = new Date();
        const overduePayments = await CustomersPayment.findAll({
            where: {
                dueDate: {
                    [require('sequelize').Op.lt]: today
                },
                status: {
                    [require('sequelize').Op.ne]: 'paid'
                }
            },
            limit: 1
        });
        return overduePayments.length > 0;
    } catch (error) {
        console.error('Error checking overdue payments:', error);
        return false;
    }
}

// Helper function to dismiss reminders
async function dismissReminders() {
    // Logic to mark reminders as dismissed
    console.log('Reminders dismissed');
}

// Helper function to dismiss overdue notifications
async function dismissOverdues() {
    // Logic to mark overdue notifications as dismissed
    console.log('Overdue notifications dismissed');
}

// GET /api/notifications/status
router.get('/status', async (req, res) => {
    try {
        const hasReminders = await checkTodayReminders();
        const hasOverduePayments = await checkOverduePayments();
        res.json({ hasReminders, hasOverduePayments });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications status' });
    }
});

// POST /api/notifications/dismiss
router.post('/dismiss', async (req, res) => {
    try {
        await dismissReminders();
        await dismissOverdues();
        res.json({ message: 'Notifications dismissed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to dismiss notifications' });
    }
});

module.exports = router;
