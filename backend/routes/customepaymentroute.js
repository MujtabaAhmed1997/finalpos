// // routes/customerpaymentroute.js

// const express = require('express');
// const router = express.Router();
// const { CustomerPayment } = require('../models');
// const { SalesOrder } = require('../models/salesorder');
// const { Customer } = require('../models/customer');

// // Create a new customer payment
// router.post('/', async (req, res) => {
//   try {
//     const payment = await CustomerPayment.create(req.body);
//     res.status(201).json(payment);
//   } catch (err) {
//     console.error('Error creating customer payment:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get a customer payment by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const payment = await CustomerPayment.findByPk(req.params.id);
//     if (payment) {
//       res.json(payment);
//     } else {
//       res.status(404).json({ error: 'Customer payment not found' });
//     }
//   } catch (err) {
//     console.error('Error fetching customer payment:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get all customer payments
// router.get('/', async (req, res) => {
//   try {
//     const payments = await CustomerPayment.findAll();
//     res.json(payments);
//   } catch (err) {
//     console.error('Error fetching customer payments:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Update a customer payment
// router.put('/:id', async (req, res) => {
//   try {
//     const payment = await CustomerPayment.findByPk(req.params.id);
//     if (payment) {
//       await payment.update(req.body);
//       res.json(payment);
//     } else {
//       res.status(404).json({ error: 'Customer payment not found' });
//     }
//   } catch (err) {
//     console.error('Error updating customer payment:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Delete a customer payment
// router.delete('/:id', async (req, res) => {
//   try {
//     const payment = await CustomerPayment.findByPk(req.params.id);
//     if (payment) {
//       await payment.destroy();
//       res.status(204).end();
//     } else {
//       res.status(404).json({ error: 'Customer payment not found' });
//     }
//   } catch (err) {
//     console.error('Error deleting customer payment:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { CustomerPayment, Customer } = require('../models');
const { SalesOrder } = require('../models/salesorder');
const { Op } = require('sequelize');


router.post('/', async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log request body
    const payment = await CustomerPayment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    console.error('Error creating customer payment:', err);
    res.status(500).json({ error: err.message }); // Send detailed error message
  }
});



//customerpayment by customer id
router.get('/customer/:customerId', async (req, res) => {
  const { page = 1, pageSize = 10,search } = req.query;
  const { customerId } = req.params;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  try {
    const { rows: payments, count } = await CustomerPayment.findAndCountAll({
       where: { CustomerId: customerId }, // Ensure the filter is applied here
      offset,
      limit,
      include: [{
        model: Customer,
        attributes: ['CustomerName']
      }],
    
    });

    const totalPages = Math.ceil(count / pageSize);

    res.json({
      customerPayments: payments,
      totalPages
    });
  } catch (err) {
    console.error('Error fetching customer payments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get all customer payments with search functionality
router.get('/', async (req, res) => {
  const { page = 1, pageSize = 10, search } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  console.log('Query parameters:', req.query);
  console.log('Search term:', search);

  try {
    let whereClause = {};
    let customerWhereClause = {};

    // Add search functionality by customer name
    if (search && search.trim()) {
      customerWhereClause = {
        CustomerName: {
          [Op.like]: `%${search.trim()}%`
        }
      };
      console.log('Customer where clause:', customerWhereClause);
    }

    const queryOptions = {
      where: whereClause,
      offset,
      limit,
      include: [{
        model: Customer,
        attributes: ["CustomerName"],
        where: customerWhereClause
      }],
      order: [['PaymentDate', 'DESC']] // Sort by PaymentDate in descending order
    };

    console.log('Query options:', JSON.stringify(queryOptions, null, 2));

    const { rows: payments, count } = await CustomerPayment.findAndCountAll(queryOptions);

    const totalPages = Math.ceil(count / pageSize);

    res.json({
      customerPayments: payments,
      totalPages,
      currentPage: parseInt(page),
      totalCount: count
    });
  } catch (err) {
    console.error('Error fetching customer payments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a customer payment by ID
router.get('/:id', async (req, res) => {
  try {
    const payment = await CustomerPayment.findByPk(req.params.id);
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ error: 'Customer payment not found' });
    }
  } catch (err) {
    console.error('Error fetching customer payment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a customer payment
router.put('/:id', async (req, res) => {
  try {
    const payment = await CustomerPayment.findByPk(req.params.id);
    if (payment) {
      await payment.update(req.body);
      res.json(payment);
    } else {
      res.status(404).json({ error: 'Customer payment not found' });
    }
  } catch (err) {
    console.error('Error updating customer payment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a customer payment
router.delete('/:id', async (req, res) => {
  try {
    const payment = await CustomerPayment.findByPk(req.params.id);
    if (payment) {
      await payment.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Customer payment not found' });
    }
  } catch (err) {
    console.error('Error deleting customer payment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get total amount paid for a specific SalesOrderID
router.get('/total/:salesOrderId', async (req, res) => {
  try {
    const salesOrderId = req.params.salesOrderId;
    const totalPayments = await CustomerPayment.sum('PaymentAmount', {
      where: {
        SalesOrderID: salesOrderId
      }
    });
    res.json({ totalPayments: totalPayments || 0 }); // Return 0 if no payments found
  } catch (err) {
    console.error('Error fetching total payments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get today's payments for a specific customer
router.get('/today/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todayPayments = await CustomerPayment.findAll({
      where: {
        CustomerId: customerId,
        PaymentDate: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay
        }
      },
      include: [{
        model: Customer,
        attributes: ['CustomerName']
      }],
      order: [['PaymentDate', 'DESC']]
    });

    const totalToday = todayPayments.reduce((sum, payment) => sum + parseFloat(payment.PaymentAmount || 0), 0);

    res.json({
      todayPayments,
      totalToday,
      paymentCount: todayPayments.length
    });
  } catch (err) {
    console.error('Error fetching today\'s customer payments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
