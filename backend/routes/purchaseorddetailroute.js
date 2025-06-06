 const express = require('express');
 const router = express.Router();
 const { PurchaseOrderDetail,ProductVariation,Product } = require('../models');

// Get all PurchaseOrderDetails
 router.get('/', async (req, res) => {
  try {
    const purchaseOrderDetails = await PurchaseOrderDetail.findAll();
    res.status(200).json(purchaseOrderDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific PurchaseOrderDetail by ID
router.get('/:id', async (req, res) => {
  try {
    const purchaseOrderDetail = await PurchaseOrderDetail.findByPk(req.params.id);
    if (purchaseOrderDetail) {
      res.status(200).json(purchaseOrderDetail);
    } else {
      res.status(404).json({ error: 'PurchaseOrderDetail not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a specific PurchaseOrderDetail by ID
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await PurchaseOrderDetail.update(req.body, {
      where: { PurchaseOrderDetailID: req.params.id }
    });
    if (updated) {
      const updatedPurchaseOrderDetail = await PurchaseOrderDetail.findByPk(req.params.id);
      res.status(200).json(updatedPurchaseOrderDetail);
    } else {
      res.status(404).json({ error: 'PurchaseOrderDetail not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a specific PurchaseOrderDetail by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await PurchaseOrderDetail.destroy({
      where: { PurchaseOrderDetailID: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'PurchaseOrderDetail not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Create new PurchaseOrderDetail
router.post('/', async (req, res) => {
    console.log('Received body:', req.body); // Add this line

    try {
    const purchaseOrderDetails = await PurchaseOrderDetail.bulkCreate(req.body.entries);
    res.status(201).json(purchaseOrderDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Get PurchaseOrderDetails by PurchaseOrderID
// router.get('/actual', async (req, res) => {
//   const purchaseOrderId = req.query.PurchaseOrderID;

//   try {
//     const details = await PurchaseOrderDetail.findAll({ where: { PurchaseOrderID: purchaseOrderId } });
//     res.json(details);
//   } catch (err) {
//     console.error('Error fetching purchase order details:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
// Get PurchaseOrderDetails by PurchaseOrderID
// router.get('/actual', async (req, res) => {
//     const purchaseOrderId = req.query.PurchaseOrderID; // Ensure this matches the query parameter in the frontend
  
//     try {
//       const details = await PurchaseOrderDetail.findAll({ where: { PurchaseOrderID: purchaseOrderId } });
//       res.json(details);
//     } catch (err) {
//       console.error('Error fetching purchase order details:', err);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });


// router.get('/purchaseOrder/:id/details', async (req, res) => {
//     const purchaseOrderId = req.params.id;
  
//     try {
//       const details = await PurchaseOrderDetail.findAll({ where: { PurchaseOrderID: purchaseOrderId } });
//       res.json(details);
//     } catch (err) {
//       console.error('Error fetching purchase order details:', err);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

// router.get('/purchaseOrder/:id/details', async (req, res) => {
//   const purchaseOrderId = req.params.id;

//   try {
//     const details = await PurchaseOrderDetail.findAll({
//       where: { PurchaseOrderID: purchaseOrderId },
//       include: [
//         {
//           model: Product,
//           attributes: ['ProductName'] // Adjust the attributes according to your Product model
//         },{
//           model:ProductVariation,
//           attribute:['Size']
//         }
//       ]
//     });
//     res.json(details);
//   } catch (err) {
//     console.error('Error fetching purchase order details:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.get('/purchaseOrder/:id/details',async(req,res)=>{
const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
const purchaseorderid = req.params.id;

try {
  const offset = (page - 1) * limit;
  const { count, rows } = await PurchaseOrderDetail.findAndCountAll({
    where: { PurchaseOrderID: purchaseorderid },
    limit: parseInt(limit),
    offset: parseInt(offset),
    include: [
      {
        model: Product,
        attributes: ['ProductName']
      },
      {
        model: ProductVariation,
        attributes: ['Size'] // Adjust the attributes according to your ProductVariation model
      }
    ]
  });

  const totalPages = Math.ceil(count / limit);

  // Calculate the total amount for each detail
  const OrderDetails = rows.map(detail => {
    const { UnitPrice,   Quantity } = detail;

    const detailTotal = (Quantity * UnitPrice) 
    const totalsum = Math.round(detailTotal);

    return {
      ...detail.toJSON(),
      total: totalsum
    };
  });

  // Calculate the overall total
  const total = OrderDetails.reduce((acc, detail) => acc + detail.total, 0);

  res.status(200).json({
    OrderDetails,
    totalPages,
    total
  });
} catch (err) {
  console.error('Error fetching sales order details:', err);
  res.status(500).json({ error: 'Internal server error' });
}
});
  
module.exports = router;
