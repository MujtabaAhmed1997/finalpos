// routes/productCategoryRoutes.js
const express = require('express');
const router = express.Router();
const ProductCategory = require('../models/productcategory');

// GET all product categories
router.get('/', async (req, res) => {
  try {
    const productCategories = await ProductCategory.findAll({ where: { softdelete: false } });
    res.json(productCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST new product category
router.post('/', async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    if (!categoryName || !description) {
      return res.status(400).json({ message: 'CategoryName and Description are required' });
    }

    const newCategory = await ProductCategory.create({
      CategoryName: categoryName,
      Description: description
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Failed to add category', error: error.message });
  }
});

// PUT update product category
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { categoryName, description } = req.body;

  try {
    const productCategory = await ProductCategory.findOne({ where: { CategoryID: id } });
    ;
    console.log(productCategory)
    if (!productCategory) {
      return res.status(404).json({ message: 'Product category not found' });
    }

    productCategory.CategoryName = categoryName;
    productCategory.Description = description;
    await productCategory.save();

    res.json(productCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET product category by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const productCategory = await ProductCategory.findByPk(id);
    if (!productCategory) {
      return res.status(404).json({ message: 'Product category not found' });
    }
    res.json(productCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// DELETE product category
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const productCategory = await ProductCategory.findByPk(id);
    if (!productCategory) {
      return res.status(404).json({ message: 'Product category not found' });
    }

    await productCategory.update({ softdelete: true })
    res.json({ message: 'Product category soft deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
