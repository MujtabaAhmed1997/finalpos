const express = require('express');
const router = express.Router();
const { PriceHistory, ProductVariation } = require('../models');

router.get('/:variationId', async (req, res) => {
  try {
    const { variationId } = req.params;
    console.log(variationId);
    const priceHistory = await PriceHistory.findAll({
      where: { VariationID: variationId },
      order: [['ChangeDate', 'DESC']],
      include: {
        model: ProductVariation,
        attributes: ['SKU'] // Include SKU from ProductVariation
      }
    });

    if (priceHistory.length === 0) {
      return res.status(404).json({ error: 'No price history found for the specified variation.' });
    }

    res.status(200).json(priceHistory);
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ error: 'An error occurred while fetching the price history.' });
  }
});





// Get all price histories
router.get('/', async (req, res) => {
  try {
    const priceHistories = await PriceHistory.findAll({
      order: [['ChangeDate', 'DESC']]
    });

    res.status(200).json(priceHistories);
  } catch (error) {
    console.error('Error fetching price histories:', error);
    res.status(500).json({ error: 'An error occurred while fetching the price histories.' });
  }
});

module.exports = router;
