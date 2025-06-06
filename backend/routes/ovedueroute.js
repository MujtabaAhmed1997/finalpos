const express = require('express');
const router = express.Router();
const { checkOverduePayments } = require('../services/overduePaymentChecker');

// Existing routes...

// GET route for overdue customers
// router.get('/', async (req, res) => {
//   try {
//     const overdueCustomers = await checkOverduePayments();
//     res.json(overdueCustomers);
//   } catch (error) {
//     console.error('Error fetching overdue customers:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.get('/', async (req, res) => {
    try {
      const overdueCustomers = await checkOverduePayments();
      
      // Log the response for debugging
      console.log('Response from service:', JSON.stringify(overdueCustomers, null, 2));
      
      // Ensure the data being sent is an array
      if (Array.isArray(overdueCustomers)) {
        res.json(overdueCustomers);
      } else {
        res.status(500).json({ error: 'Unexpected response format from service' });
      }
    } catch (error) {
      console.error('Error fetching overdue customers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports = router;