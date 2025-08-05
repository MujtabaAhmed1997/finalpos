const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Create a new product
router.post('/', async (req, res) => {
  const { ProductName, Description, Unit, ReorderLevel, CategoryID } = req.body;

  try {
    // Validation
    const validationErrors = {};
    
    if (!ProductName || ProductName.trim() === '') {
      validationErrors.ProductName = 'Product Name is required';
    }
    
    if (!Unit || Unit.trim() === '') {
      validationErrors.Unit = 'Unit is required';
    }
    
    if (ReorderLevel === null || ReorderLevel === undefined || ReorderLevel === '') {
      validationErrors.ReorderLevel = 'Reorder Level is required';
    } else if (isNaN(ReorderLevel) || parseInt(ReorderLevel) < 0) {
      validationErrors.ReorderLevel = 'Reorder Level must be a positive number';
    }
    
    if (!CategoryID || CategoryID === '') {
      validationErrors.CategoryID = 'Category is required';
    } else if (isNaN(CategoryID) || parseInt(CategoryID) <= 0) {
      validationErrors.CategoryID = 'Invalid category selected';
    }

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const product = await Product.create({
      ProductName: ProductName.trim(),
      Description: Description ? Description.trim() : '',
      Unit: Unit.trim(),
      ReorderLevel: parseInt(ReorderLevel),
      CategoryID: parseInt(CategoryID)
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const formattedErrors = {};
      error.errors.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors
      });
    }
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category selected',
        errors: {
          CategoryID: 'The selected category does not exist'
        }
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to create product'
    });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({ 
      where: { softdelete: false },
      order: [['ProductName', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to fetch products'
    });
  }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    if (!productId || isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
        errors: {
          id: 'Product ID must be a valid number'
        }
      });
    }

    const product = await Product.findOne({
      where: {
        ProductID: parseInt(productId),
        softdelete: false
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        error: 'The requested product does not exist or has been deleted'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to fetch product'
    });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { ProductName, Description, Unit, ReorderLevel, CategoryID } = req.body;

    // Validate product ID
    if (!productId || isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
        errors: {
          id: 'Product ID must be a valid number'
        }
      });
    }

    // Validation
    const validationErrors = {};
    
    if (!ProductName || ProductName.trim() === '') {
      validationErrors.ProductName = 'Product Name is required';
    }
    
    if (!Unit || Unit.trim() === '') {
      validationErrors.Unit = 'Unit is required';
    }
    
    if (ReorderLevel === null || ReorderLevel === undefined || ReorderLevel === '') {
      validationErrors.ReorderLevel = 'Reorder Level is required';
    } else if (isNaN(ReorderLevel) || parseInt(ReorderLevel) < 0) {
      validationErrors.ReorderLevel = 'Reorder Level must be a positive number';
    }
    
    if (!CategoryID || CategoryID === '') {
      validationErrors.CategoryID = 'Category is required';
    } else if (isNaN(CategoryID) || parseInt(CategoryID) <= 0) {
      validationErrors.CategoryID = 'Invalid category selected';
    }

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const product = await Product.findByPk(parseInt(productId));
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        error: 'The requested product does not exist'
      });
    }

    // Update fields
    product.ProductName = ProductName.trim();
    product.Description = Description ? Description.trim() : '';
    product.Unit = Unit.trim();
    product.ReorderLevel = parseInt(ReorderLevel);
    product.CategoryID = parseInt(CategoryID);

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const formattedErrors = {};
      error.errors.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors
      });
    }
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category selected',
        errors: {
          CategoryID: 'The selected category does not exist'
        }
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to update product'
    });
  }
});

// Delete a product (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    if (!productId || isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
        errors: {
          id: 'Product ID must be a valid number'
        }
      });
    }

    const product = await Product.findByPk(parseInt(productId));
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        error: 'The requested product does not exist'
      });
    }

    // Soft delete: set softdelete to true
    await product.update({ softdelete: true });

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Failed to delete product'
    });
  }
});

module.exports = router;
