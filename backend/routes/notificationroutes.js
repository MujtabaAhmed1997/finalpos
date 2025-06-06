const express = require('express');
const router = express.Router();

// GET /api/notifications/status
router.get('/notifications/status', async (req, res) => {
    const hasReminders = await checkTodayReminders(); // boolean
    const hasOverduePayments = await checkOverduePayments(); // boolean
    res.json({ hasReminders, hasOverduePayments });
});

// POST /api/notifications/dismiss
router.post('/notifications/dismiss', async (req, res) => {
    await dismissReminders(); // optional logic
    await dismissOverdues();  // optional logic
    res.json({ message: 'Notifications dismissed' });
});


module.exports = router;
