const express = require('express');
const router = express.Router();
const { ReturnOrderDetail ,ProductVariation } = require('../models');

// Create a new ReturnOrderDetail
// router.post('/', async (req, res) => {
//   try {
//     const { ReturnOrderID, ProductID, VariationID, Quantity, LooseQuantity, UnitPrice, Reason } = req.body;
//     console.log(req.body);
//     const returnOrderDetail = await ReturnOrderDetail.create({
//       ReturnOrderID,
//       ProductID,
//       VariationID,
//       Quantity,
//       LooseQuantity,
//       UnitPrice,
//       Reason
//     });
//     res.status(201).json(returnOrderDetail);
//   } catch (error) {
//     console.error('Error adding return order details:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.post('/', async (req, res) => {
  try {
    const { entries } = req.body;
    console.log(req.body);

    // Validate that entries is an array
    if (!Array.isArray(entries)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    // Create each return order detail
    const createdReturnOrderDetails = [];
    for (const entry of entries) {
      const returnOrderDetail = await ReturnOrderDetail.create(entry);
      createdReturnOrderDetails.push(returnOrderDetail);
    }

    res.status(201).json(createdReturnOrderDetails);
  } catch (error) {
    console.error('Error adding return order details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all ReturnOrderDetails
router.get('/', async (req, res) => {
  try {
    const returnOrderDetails = await ReturnOrderDetail.findAll();
    res.status(200).json(returnOrderDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch return order details' });
  }
});

// Get a specific ReturnOrderDetail by ID
router.get('/:id', async (req, res) => {
  try {
    const returnOrderDetail = await ReturnOrderDetail.findByPk(req.params.id);
    if (returnOrderDetail) {
      res.status(200).json(returnOrderDetail);
    } else {
      res.status(404).json({ error: 'Return order detail not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch return order detail' });
  }
});

// Update a ReturnOrderDetail
router.put('/:id', async (req, res) => {
  try {
    const { ReturnOrderID, ProductID, VariationID, Quantity, LooseQuantity, UnitPrice, Reason } = req.body;
    const returnOrderDetail = await ReturnOrderDetail.findByPk(req.params.id);

    if (returnOrderDetail) {
      returnOrderDetail.ReturnOrderID = ReturnOrderID;
      returnOrderDetail.ProductID = ProductID;
      returnOrderDetail.VariationID = VariationID;
      returnOrderDetail.Quantity = Quantity;
      returnOrderDetail.LooseQuantity = LooseQuantity;
      returnOrderDetail.UnitPrice = UnitPrice;
      returnOrderDetail.Reason = Reason;

      await returnOrderDetail.save();
      res.status(200).json(returnOrderDetail);
    } else {
      res.status(404).json({ error: 'Return order detail not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update return order detail' });
  }
});

// Delete a ReturnOrderDetail
router.delete('/:id', async (req, res) => {
  try {
    const returnOrderDetail = await ReturnOrderDetail.findByPk(req.params.id);
    if (returnOrderDetail) {
      await returnOrderDetail.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Return order detail not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete return order detail' });
  }
});

router.get('/returnorder/:id/total', async (req, res) => {
  const returnOrderId = req.params.id;

  try {
    
    // Fetch sale order details
    const detail= await ReturnOrderDetail.findAll({
      where: { ReturnOrderID: returnOrderId },
      include: [{
        model: ProductVariation, // Ensure this model is defined in your Sequelize setup
        attributes: ['UnitsPerPackage'] // Fetch only the required field
      }]
      
    });
  // Calculate total based on the fetched details
  const total = detail.reduce((acc, detail) => {
    // Extract values from each detail
    const { UnitPrice,  LooseQuantity, Quantity } = detail;
    const { UnitsPerPackage } = detail.ProductVariation; // Assuming this relationship is set up


    // Apply the calculation logic
    const discountedPrice = UnitPrice 
    const singlePiecePrice = discountedPrice / UnitsPerPackage;
    const looseQuantityPrice = LooseQuantity * singlePiecePrice;
    const detailTotal =( Quantity * discountedPrice )+ looseQuantityPrice;
   const totalsum= Math.round(detailTotal);

    
    console.log(totalsum);

    // Accumulate the total
    return acc + totalsum;
  }, 0);
  

    res.status(200).json({
      detail, total
    
    });
  } catch (err) {
    console.error('Error fetching sales order details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
