const express = require('express');
const router = express.Router();
const { Product, ProductVariation, PriceHistory } = require('../models/index');

//getting by foriegn key
router.get('/products/:ProductID/variations', async (req, res) => {
  try {
    const ProductID = req.params.ProductID
    const productVariations = await ProductVariation.findAll({
      where: { ProductID },
      include: [Product] // Include associated Product model if needed
    });

    if (productVariations.length > 0) {
      res.status(200).json(productVariations);
    } else {
      res.status(404).json({ message: 'No variations found for this product' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new ProductVariation
// router.post('/productVariations', async (req, res) => {
//   try {
//     const productVariation = await ProductVariation.create(req.body);
//     res.status(201).json(productVariation);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post('/productVariations', async (req, res) => {
  try {
    const {
      ProductID,
      SKU,
      Size,
      Color,
      // Price,
      SellingPrice,
      // QuantityInStock,
      UnitsPerPackage,
      Barcode
    } = req.body;

    console.log("req.body", req.body)

    // Field validations
    if (!ProductID) return res.status(400).json({ error: 'ProductID is required' });
    if (!SKU) return res.status(400).json({ error: 'SKU is required' });
    if (!Size) return res.status(400).json({ error: 'Size is required' });
    // if (Price === undefined || isNaN(Price)) return res.status(400).json({ error: 'Valid Price is required' });
    if (SellingPrice === undefined || isNaN(SellingPrice)) return res.status(400).json({ error: 'Valid SellingPrice is required' });
    // if (QuantityInStock === undefined || !Number.isInteger(QuantityInStock)) return res.status(400).json({ error: 'Valid QuantityInStock is required' });

    console.log(UnitsPerPackage, "unitper")
    console.log(typeof (UnitsPerPackage))
    if (UnitsPerPackage === undefined || !Number.isInteger(UnitsPerPackage)) return res.status(400).json({ error: 'Valid UnitsPerPackage is required' });

    // Check for unique SKU
    const existingSKU = await ProductVariation.findOne({ where: { SKU } });
    if (existingSKU) return res.status(400).json({ error: 'SKU must be unique' });
    console.log("existingsku", existingSKU)
    // Check for unique Size per ProductID
    const existingSize = await ProductVariation.findOne({
      where: {
        ProductID,
        Size
      }
    });
    if (existingSize) return res.status(400).json({ error: 'Size must be unique for the given product' });

    // Create the variation
    const productVariation = await ProductVariation.create({
      ProductID,
      SKU,
      Size,
      Color,
      // Price,
      SellingPrice,
      // QuantityInStock,
      UnitsPerPackage,
      Barcode
    });

    res.status(201).json(productVariation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all ProductVariations
router.get('/productVariations', async (req, res) => {
  try {
    const productVariations = await ProductVariation.findAll();
    res.status(200).json(productVariations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a ProductVariation by ID
router.get('/productVariations/:id', async (req, res) => {
  try {
    const productVariation = await ProductVariation.findByPk(req.params.id);
    if (productVariation) {
      res.status(200).json(productVariation);
    } else {
      res.status(404).json({ message: 'ProductVariation not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a ProductVariation by ID
// router.put('/productVariations/:id', async (req, res) => {
//   try {
//     const [updated] = await ProductVariation.update(req.body, {
//       where: { VariationID: req.params.id }
//     });
//     if (updated) {
//       const updatedProductVariation = await ProductVariation.findByPk(req.params.id);
//       res.status(200).json(updatedProductVariation);
//     } else {
//       res.status(404).json({ message: 'ProductVariation not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
router.put('/productVariations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Price, SellingPrice, ...otherFields } = req.body;

    const existingVariation = await ProductVariation.findByPk(id);

    if (!existingVariation) {
      return res.status(404).json({ error: 'ProductVariation not found' });
    }

    const previousPrice = existingVariation.Price;
    const previousSellingPrice = existingVariation.SellingPrice;

    const updated = await ProductVariation.update(
      { Price, SellingPrice, ...otherFields },
      { where: { VariationID: id } }
    );

    if (updated) {
      const updatedVariation = await ProductVariation.findByPk(id);

      if (Price !== previousPrice) {
        await PriceHistory.create({
          VariationID: id,
          PriceType: 'Price',
          PreviousPrice: previousPrice,
          NewPrice: Price,
          ChangeDate: new Date()
        });
      }

      if (SellingPrice !== previousSellingPrice) {
        await PriceHistory.create({
          VariationID: id,
          PriceType: 'SellingPrice',
          PreviousPrice: previousSellingPrice,
          NewPrice: SellingPrice,
          ChangeDate: new Date()
        });
      }

      res.status(200).json(updatedVariation);
    } else {
      throw new Error('ProductVariation not found');
    }
  } catch (error) {
    console.error('Error updating product variation:', error);
    res.status(500).json({ error: 'An error occurred while updating the product variation.' });
  }
});
// Delete a ProductVariation by ID
router.delete('/productVariations/:id', async (req, res) => {
  try {
    const deleted = await ProductVariation.destroy({
      where: { VariationID: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'ProductVariation deleted' });
    } else {
      res.status(404).json({ message: 'ProductVariation not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/productVariations/barcode/:barcode', async (req, res) => {
  const { barcode } = req.params;

  try {
    // Find the product variation by barcode
    const variation = await ProductVariation.findOne({ where: { Barcode: barcode } });

    if (!variation) {
      return res.status(404).json({ message: 'Product variation not found' });
    }

    // Respond with the found variation
    res.json(variation);
  } catch (error) {
    console.error('Error fetching product variation by barcode:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
