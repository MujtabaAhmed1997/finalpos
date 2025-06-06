const express = require('express');
const router = express.Router();
const Reminder = require('../models/remindermodel');

// POST: Add Reminder
router.post('/add', async (req, res) => {
    const { TaskDescription, Date } = req.body;

    if (!TaskDescription || !Date) {
        return res.status(400).json({ message: 'TaskDescription and Date are required.' });
    }

    try {
        const reminder = await Reminder.create({ TaskDescription, Date });
        res.status(201).json({ message: 'Reminder added successfully', reminder });
    } catch (error) {
        console.error('Error creating reminder:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// GET: Get Reminders by Date (query param)
router.get('/', async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: 'Date query parameter is required.' });
    }

    try {
        const reminders = await Reminder.findAll({
            where: { Date: date },
            order: [['createdAt', 'DESC']]
        });
        res.json({ reminders });
    } catch (error) {
        console.error('Error fetching reminders:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
