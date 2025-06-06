const express = require('express');
const router = express.Router();
const Product = require('../models/product');
// Create a new product

router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Get all products

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({ where: { softdelete: false } });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Get a product by ID

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        ProductID: req.params.id,
        softdelete: false
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found or has been deleted' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Update a product

// router.put('/:id',  async (req, res) => {
//     try {
//       const product = await Product.findByPk(req.params.id);
//       if (!product) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
//       await product.update(req.body);
//       res.status(200).json(product);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   });
// router.put('/:id', async (req, res) => {
//     try {
//         console.log('Request body:', req.body); // Debug: log request body
//         const product = await Product.findByPk(req.params.id);
//         if (!product) {
//             return res.status(404).json({ error: 'Product not found' });
//         }

//         // Log the current state of the product before update
//         console.log('Product before update:', product.dataValues);

//         // Perform the update
//         await product.update(req.body);

//         // Log the updated state of the product after update
//         console.log('Product after update:', product.dataValues);

//         res.status(200).json(product);
//     } catch (error) {
//         console.error('Error updating product:', error); // Debug: log error
//         res.status(400).json({ error: error.message });
//     }
// });
router.put('/:id', async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug: log request body

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Log the current state of the product before update
    console.log('Product before update:', product.dataValues);

    // Perform the update explicitly field by field
    product.ProductName = req.body.ProductName;
    product.Description = req.body.Description;
    product.Unit = req.body.Unit;
    product.ReorderLevel = req.body.ReorderLevel;
    product.CategoryID = req.body.CategoryID;

    console.log("product", product)
    await product.save();

    // Log the updated state of the product after update
    console.log('Product after update:', product.dataValues);

    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error); // Debug: log error
    res.status(400).json({ error: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Soft delete: set softdelete to true
    await product.update({ softdelete: true });

    res.status(200).json({ message: 'Product soft deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
