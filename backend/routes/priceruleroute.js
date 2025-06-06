const express = require('express');
const router = express.Router();
const PriceRule = require('../models/pricerules');
const ProductVariation = require("../models/productvariation")
const { Op } = require('sequelize');  // This is necessary for using Sequelize operators

// Route to add a new price rule
router.post('/', async (req, res) => {
  try {
    const { VariationID, min_quantity, max_quantity, price_per_kg } = req.body;
    if (!VariationID || !min_quantity || !max_quantity || !price_per_kg) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newPriceRule = await PriceRule.create({ VariationID, min_quantity, max_quantity, price_per_kg });
    res.json(newPriceRule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// router.get('/', async (req, res) => {
//     try {
//       const priceRules = await PriceRule.findAll({
//         include: [{
//           model: ProductVariation, // Assuming your Variation model is set up properly
//           attributes: ['SKU'] // Specify the fields you want to include
//         }]
//       });
//       res.json(priceRules);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });

// Route to update an existing price rule
router.put('/:id', async (req, res) => {
  try {
    const { VariationID, min_quantity, max_quantity, price_per_kg } = req.body;
    const priceRule = await PriceRule.findByPk(req.params.id);
    if (!priceRule) {
      return res.status(404).json({ error: 'Price rule not found' });
    }
    await priceRule.update({ VariationID, min_quantity, max_quantity, price_per_kg });
    res.json(priceRule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    let { page, limit } = req.query;

    // Convert query parameters to integers and set defaults
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10; // Default limit is 10

    const offset = (page - 1) * limit;

    // Fetch price rules with pagination
    const { rows: priceRules, count: totalItems } = await PriceRule.findAndCountAll({
      include: [{
        model: ProductVariation,
        attributes: ['SKU']
      }],
      limit,
      offset
    });

    res.json({
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      pageSize: limit,
      data: priceRules
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Route to delete a price rule
router.delete('/:id', async (req, res) => {
  try {
    const priceRule = await PriceRule.findByPk(req.params.id);
    if (!priceRule) {
      return res.status(404).json({ error: 'Price rule not found' });
    }
    await priceRule.destroy();
    res.json({ message: 'Price rule deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/rate', async (req, res) => {
  debugger
  const { variationID, looseQuantity } = req.query;
  console.log(req.query)
  try {
    // Fetch pricing rule for the given variationID and loose quantity
    const priceRule = await PriceRule.findOne({
      where: {
        VariationID: variationID,
        min_quantity: { [Op.lte]: looseQuantity }, // Minimum quantity is less than or equal to looseQuantity
        max_quantity: { [Op.gte]: looseQuantity }  // Maximum quantity is greater than or equal to looseQuantity
      }
    });

    if (!priceRule) {
      return res.status(404).json({ message: 'No price rule found for this loose quantity' });
    }

    // Calculate loose quantity price based on the price per kg
    const looseQuantityPrice = looseQuantity * priceRule.price_per_kg;
    console.log("price per kg loose", priceRule.price_per_kg)
    const price = priceRule.price_per_kg
    return res.status(200).json({ looseQuantityPrice, price });
  } catch (error) {
    console.error('Error fetching price rule:', error);
    return res.status(500).json({ message: 'Server error while fetching price rule 1' });
  }
});

// router.get('/getrate', async (req, res) => {
//     const { variationID, looseQuantity } = req.query;

//     try {
//       // Log the incoming query params for debugging
//       console.log('Received query params:', { variationID, looseQuantity });

//       // Ensure looseQuantity is treated as a number
//       const quantity = parseFloat(looseQuantity);

//       if (isNaN(quantity)) {
//         return res.status(400).json({ message: 'Invalid loose quantity' });
//       }

//       // Fetch pricing rule for the given variationID and loose quantity
//       const priceRule = await PriceRule.findOne({
//         where: {
//           VariationID: variationID,
//           min_quantity: { [Op.lte]: quantity },  // Minimum quantity <= looseQuantity
//           max_quantity: { [Op.gte]: quantity }   // Maximum quantity >= looseQuantity
//         }
//       });

//       // If no price rule matches the criteria
//       if (!priceRule) {
//         return res.status(404).json({ message: 'No price rule found for this loose quantity' });
//       }

//       // Calculate loose quantity price based on the price per kg
//       const looseQuantityPrice = quantity * priceRule.price_per_kg;
//       return res.status(200).json({ looseQuantityPrice });
//     } catch (error) {
//       console.error('Error fetching price rule:', error);
//       return res.status(500).json({ message: 'Server error while fetching price rule' });
//     }
//   });

module.exports = router;
