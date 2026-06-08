const express = require('express');
const router = express.Router();
const { Product, ProductVariation, PriceHistory } = require('../models/index');
const { Op } = require('sequelize');

const slugify = (value) =>
  String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'STD';

async function generateSKU(ProductID, Size) {
  const product = await Product.findByPk(ProductID);
  const productPrefix = slugify(
    product?.ProductName?.slice(0, 6) || `P${ProductID}`
  );
  const sizeSlug = slugify(Size);
  const count = await ProductVariation.count({ where: { ProductID } });
  let candidate = `${productPrefix}-${ProductID}-${sizeSlug}-${String(count + 1).padStart(3, '0')}`;
  let suffix = 0;

  while (await ProductVariation.findOne({ where: { SKU: candidate } })) {
    suffix += 1;
    candidate = `${productPrefix}-${ProductID}-${sizeSlug}-${String(count + 1 + suffix).padStart(3, '0')}`;
  }

  return candidate;
}

async function validateVariationUniqueness({ ProductID, SKU, Size, excludeId }) {
  if (SKU) {
    const skuWhere = { SKU };
    if (excludeId) {
      skuWhere.VariationID = { [Op.ne]: excludeId };
    }
    const existingSKU = await ProductVariation.findOne({ where: skuWhere });
    if (existingSKU) {
      return { error: 'SKU must be unique' };
    }
  }

  if (ProductID && Size) {
    const sizeWhere = { ProductID, Size };
    if (excludeId) {
      sizeWhere.VariationID = { [Op.ne]: excludeId };
    }
    const existingSize = await ProductVariation.findOne({ where: sizeWhere });
    if (existingSize) {
      return { error: 'Size must be unique for the given product' };
    }
  }

  return null;
}

//getting by foriegn key
router.get('/products/:ProductID/variations', async (req, res) => {
  try {
    const ProductID = req.params.ProductID
    const productVariations = await ProductVariation.findAll({
      where: { ProductID },
      include: [Product] // Include associated Product model if needed
    });

    res.status(200).json(productVariations);
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
    if (!Size) return res.status(400).json({ error: 'Size is required' });

    const resolvedSKU = SKU || (await generateSKU(ProductID, Size));
    // if (Price === undefined || isNaN(Price)) return res.status(400).json({ error: 'Valid Price is required' });
    if (SellingPrice === undefined || isNaN(SellingPrice)) return res.status(400).json({ error: 'Valid SellingPrice is required' });
    // if (QuantityInStock === undefined || !Number.isInteger(QuantityInStock)) return res.status(400).json({ error: 'Valid QuantityInStock is required' });

    console.log(UnitsPerPackage, "unitper")
    console.log(typeof (UnitsPerPackage))
    if (UnitsPerPackage === undefined || !Number.isInteger(UnitsPerPackage)) return res.status(400).json({ error: 'Valid UnitsPerPackage is required' });

    const uniquenessError = await validateVariationUniqueness({
      ProductID,
      SKU: resolvedSKU,
      Size,
    });
    if (uniquenessError) return res.status(400).json(uniquenessError);

    // Create the variation
    const productVariation = await ProductVariation.create({
      ProductID,
      SKU: resolvedSKU,
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


router.get('/products/:ProductID/generate-sku', async (req, res) => {
  try {
    const { ProductID } = req.params;
    const { Size } = req.query;

    if (!Size) {
      return res.status(400).json({ error: 'Size is required to generate SKU' });
    }

    const sku = await generateSKU(ProductID, Size);
    return res.status(200).json({ SKU: sku });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/product-variations?page=1&limit=10&search=abc
// router.get("/productVariations", async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const search = req.query.search || "";
//   const offset = (page - 1) * limit;

//   try {
//     const { count, rows } = await ProductVariation.findAndCountAll({
//       where: {
//         [Op.or]: [
//           { SKU: { [Op.like]: `%${search}%` } },
//           { Size: { [Op.like]: `%${search}%` } },
//         ],
//       },
//       limit,
//       offset,
//       order: [["VariationID", "DESC"]],
//     });

//     return res.json({
//       variations: rows,
//       totalPages: Math.ceil(count / limit),
//     });
//   } catch (error) {
//     console.error("Error fetching product variations:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/productVariations/all", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  try {
    const whereCondition = search
      ? {
        [Op.or]: [
          { SKU: { [Op.like]: `%${search}%` } },
          { Size: { [Op.like]: `%${search}%` } },
        ],
      }
      : {}; // no filter if search is empty

    const { count, rows } = await ProductVariation.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["VariationID", "DESC"]],
    });

    return res.json({
      variations: rows,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error fetching product variations:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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

// ==========================================
// NEW ENDPOINT - Get ProductVariation with Product data
// ==========================================
// This endpoint was created to support dynamic unit type fetching
// It returns a ProductVariation with its associated Product information
// Usage: GET /api/productVariations/:id/with-product
router.get('/productVariations/:id/with-product', async (req, res) => {
  try {
    const productVariation = await ProductVariation.findByPk(req.params.id, {
      include: [Product] // Include associated Product model to get Unit field
    });
    
    if (productVariation) {
      // Response includes: variation data + Product.Unit for dynamic unit type
      res.status(200).json(productVariation);
    } else {
      res.status(404).json({ message: 'ProductVariation not found' });
    }
  } catch (error) {
    console.error('Error fetching variation with product:', error);
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
    const { Price, SellingPrice, SKU, Size, ProductID, ...otherFields } = req.body;

    const existingVariation = await ProductVariation.findByPk(id);

    if (!existingVariation) {
      return res.status(404).json({ error: 'ProductVariation not found' });
    }

    const nextProductID = ProductID ?? existingVariation.ProductID;
    const nextSize = Size ?? existingVariation.Size;
    const nextSKU = SKU ?? existingVariation.SKU;

    const uniquenessError = await validateVariationUniqueness({
      ProductID: nextProductID,
      SKU: nextSKU,
      Size: nextSize,
      excludeId: id,
    });
    if (uniquenessError) return res.status(400).json(uniquenessError);

    const previousPrice = existingVariation.Price;
    const previousSellingPrice = existingVariation.SellingPrice;

    const updated = await ProductVariation.update(
      {
        Price,
        SellingPrice,
        SKU: nextSKU,
        Size: nextSize,
        ProductID: nextProductID,
        ...otherFields,
      },
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
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'SKU or Size must be unique' });
    }
    res.status(500).json({ error: error.message || 'An error occurred while updating the product variation.' });
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
