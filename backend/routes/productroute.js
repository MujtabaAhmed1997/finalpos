const express = require('express');
const router = express.Router();
const Product = require('../models/product');
// Create a new product

// router.post('/', async (req, res) => {
//   try {
//     const product = await Product.create(req.body);
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

router.post('/', async (req, res) => {
  const { ProductName, Description, Unit, ReorderLevel, CategoryID } = req.body;

  try {
    if (!ProductName || !Unit || ReorderLevel == null || !CategoryID) {
      return res.status(400).json({
        errors: {
          ProductName: !ProductName ? 'Product Name is required' : undefined,
          Unit: !Unit ? 'Unit is required' : undefined,
          ReorderLevel: ReorderLevel == null ? 'Reorder Level is required' : undefined,
          CategoryID: !CategoryID ? 'Category is required' : undefined
        }
      });
    }

    const product = await Product.create({
      ProductName,
      Description,
      Unit,
      ReorderLevel,
      CategoryID
    });

    return res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const formattedErrors = {};
      error.errors.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });
      return res.status(400).json({ errors: formattedErrors });
    }

    console.error('Error creating product:', error);
    return res.status(500).json({ error: 'Internal server error.' });
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


// router.put('/:id', async (req, res) => {
//   try {
//     console.log('Request body:', req.body); // Debug: log request body


//     const product = await Product.findByPk(req.params.id);
//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     // Log the current state of the product before update
//     console.log('Product before update:', product.dataValues);

//     if (!ProductName || !Unit || ReorderLevel == null || !CategoryID) {
//       return res.status(400).json({
//         errors: {
//           ProductName: !ProductName ? 'Product Name is required' : undefined,
//           Unit: !Unit ? 'Unit is required' : undefined,
//           ReorderLevel: ReorderLevel == null ? 'Reorder Level is required' : undefined,
//           CategoryID: !CategoryID ? 'Category is required' : undefined
//         }
//       });
//     }
//     // Perform the update explicitly field by field
//     product.ProductName = req.body.ProductName;
//     product.Description = req.body.Description;
//     product.Unit = req.body.Unit;
//     product.ReorderLevel = req.body.ReorderLevel;
//     product.CategoryID = req.body.CategoryID;


//     if (!ProductName || !Unit || ReorderLevel == null || !CategoryID) {
//       return res.status(400).json({
//         errors: {
//           ProductName: !ProductName ? 'Product Name is required' : undefined,
//           Unit: !Unit ? 'Unit is required' : undefined,
//           ReorderLevel: ReorderLevel == null ? 'Reorder Level is required' : undefined,
//           CategoryID: !CategoryID ? 'Category is required' : undefined
//         }
//       });
//     }

//     console.log("product", product)
//     await product.save();

//     // Log the updated state of the product after update
//     console.log('Product after update:', product.dataValues);

//     res.status(200).json(product);
//   } catch (error) {
//     console.error('Error updating product:', error); // Debug: log error
//     res.status(400).json({ error: error.message });
//   }
// });

router.put('/:id', async (req, res) => {
  try {
    const { ProductName, Description, Unit, ReorderLevel, CategoryID } = req.body;

    // Validate required fields
    const validationErrors = {};
    if (!ProductName) validationErrors.ProductName = 'Product Name is required';
    if (!Unit) validationErrors.Unit = 'Unit is required';
    if (ReorderLevel == null) validationErrors.ReorderLevel = 'Reorder Level is required';
    if (!CategoryID) validationErrors.CategoryID = 'Category is required';

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update fields
    product.ProductName = ProductName;
    product.Description = Description;
    product.Unit = Unit;
    product.ReorderLevel = ReorderLevel;
    product.CategoryID = CategoryID;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
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
