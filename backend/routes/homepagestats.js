// routes/api.js
const express = require('express');
const { Product, ProductCategory, Customer,ProductVariation } = require('../models'); // Adjust the path based on your project structure
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const productCount = await Product.count();
    const categoryCount = await ProductCategory.count();
    const customerCount = await Customer.count();
    const variationcount = await ProductVariation.count();


    res.json({
      products: productCount,
      categories: categoryCount,
      customers: customerCount,
      Variation:variationcount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
