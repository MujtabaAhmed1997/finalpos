const express = require('express');
const router = express.Router();
const {Customer,Supplier,ReturnOrder}=require('../models');



// Create a new ReturnOrder
// router.post('/', async (req, res) => {
//   try {
//     const { OrderType, OrderID, ReturnDate, TotalAmount,
//       Reason } = req.body;
//       if (OrderType === 'Customer') {
//         const customer = await Customer.findByPk(OrderID);
//         if (!customer) {
//           return res.status(400).json({ error: 'Invalid CustomerID' });
//         }
//       } else if (OrderType === 'Supplier') {
//         const supplier = await Supplier.findByPk(OrderID);
//         if (!supplier) {
//           return res.status(400).json({ error: 'Invalid SupplierID' });
//         }
//       }
   
//     const returnOrder = await ReturnOrder.create({
//       OrderType,
//       OrderID,
//       ReturnDate,
//       TotalAmount,
//       Reason
//     });
//     res.status(201).json(returnOrder);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create return order' });
//   }
// });


router.post('/', async (req, res) => {
  try {
    const { OrderType, OrderID, ReturnDate, TotalAmount, Reason } = req.body;

    if (OrderType === 'Customer') {
      const customer = await Customer.findByPk(OrderID);
      if (!customer) {
        console.error('Invalid CustomerID:', OrderID);
        return res.status(400).json({ error: 'Invalid CustomerID' });
      }
    } else if (OrderType === 'Supplier') {
      const supplier = await Supplier.findByPk(OrderID);
      if (!supplier) {
        console.error('Invalid SupplierID:', OrderID);
        return res.status(400).json({ error: 'Invalid SupplierID' });
      }
    }

    const returnOrder = await ReturnOrder.create({
      OrderType,
      OrderID,
      ReturnDate,
      TotalAmount,
      Reason
    });
    
    res.status(201).json(returnOrder);
  } catch (error) {
    console.error('Error creating return order:', error);
    res.status(500).json({ error: 'Failed to create return order' });
  }
});



// Get all ReturnOrders with pagination
router.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit of 10 items per page
  
      const offset = (page - 1) * limit;
  
      const { count, rows } = await ReturnOrder.findAndCountAll({
        offset: parseInt(offset),      // Starting point
        limit: parseInt(limit)         // Number of records to fetch
      });
  
      const totalPages = Math.ceil(count / limit);
  
      res.status(200).json({
        returnOrders: rows,
        currentPage: parseInt(page),
        totalPages
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch return orders' });
    }
  });

// Get a specific ReturnOrder by ID
router.get('/:id', async (req, res) => {
  try {
    const returnOrder = await ReturnOrder.findByPk(req.params.id);
    if (returnOrder) {
      res.status(200).json(returnOrder);
    } else {
      res.status(404).json({ error: 'Return order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch return order' });
  }
});

// Update a ReturnOrder
router.put('/:id', async (req, res) => {
  try {
    const { OrderType, OrderID, ReturnDate, Reason,TotalAmount  } = req.body;
    const returnOrder = await ReturnOrder.findByPk(req.params.id);
    console.log(returnOrder);
    if (returnOrder) {
      console.log("inside ")
      returnOrder.OrderType = OrderType;
      returnOrder.OrderID = OrderID;
      returnOrder.ReturnDate = ReturnDate;
      returnOrder.TotalAmount = TotalAmount;
      returnOrder.Reason = Reason;
      await returnOrder.save();

      res.status(200).json(returnOrder);
    } else {
      res.status(404).json({ error: 'Return order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update return order' });
  }
});

// Delete a ReturnOrder
router.delete('/:id', async (req, res) => {
  try {
    const returnOrder = await ReturnOrder.findByPk(req.params.id);
    if (returnOrder) {
      await returnOrder.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Return order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete return order' });
  }
});

module.exports = router;
