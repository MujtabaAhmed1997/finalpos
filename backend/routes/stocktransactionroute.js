
const StockTransaction = require('../models/stockstranscation');
const ProductVariation = require('../models/productvariation'); // Assuming you have this model
const Product = require('../models/product'); // Assuming you have this model
const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');


// Helper function to get available loose stock
async function getLooseStock(VariationID, unitType) {
  const transactions = await StockTransaction.findAll({
    where: {
      VariationID: VariationID,
      UnitType: unitType
    }
  });

  let looseStock = 0;
  transactions.forEach(transaction => {
    if (transaction.TransactionType === 'IN' || transaction.TransactionType === 'CONVERSION') {
      looseStock += transaction.Quantity;
    } else if (transaction.TransactionType === 'OUT') {
      looseStock -= transaction.Quantity;
    }
  });
  return looseStock;
}

// Helper function to get available container or sack stock
async function getContainerOrSackStock(VariationID, unitType) {
  const transactions = await StockTransaction.findAll({
    where: {
      VariationID: VariationID,
      UnitType: unitType
    }
  });

  let containerOrSackStock = 0;
  transactions.forEach(transaction => {
    if (transaction.TransactionType === 'IN') {
      containerOrSackStock += transaction.Quantity;
    } else if (transaction.TransactionType === 'OUT' || transaction.TransactionType === 'CONVERSION') {
      containerOrSackStock -= transaction.Quantity;
    }
  });
  return containerOrSackStock;
}

function filterNonZeroQuantities(data) {
  const { 
    TotalContainerQuantity, 
    TotalSackQuantity, 
    TotalLooseLQuantity, 
    TotalLooseKgQuantity 
  } = data;

  const nonZeroQuantities = {};

  if (TotalContainerQuantity > 0) {
    nonZeroQuantities.TotalContainerQuantity = TotalContainerQuantity;
  }
  if (TotalSackQuantity > 0) {
    nonZeroQuantities.TotalSackQuantity = TotalSackQuantity;
  }
  if (TotalLooseLQuantity > 0) {
    nonZeroQuantities.TotalLooseLQuantity = TotalLooseLQuantity;
  }
  if (TotalLooseKgQuantity > 0) {
    nonZeroQuantities.TotalLooseKgQuantity = TotalLooseKgQuantity;
  }

  // Check if nonZeroQuantities is empty, if so, return original data with all zeros
  if (Object.keys(nonZeroQuantities).length === 0) {
    return {
      TotalContainerQuantity: 0,
      TotalSackQuantity: 0,
      TotalLooseLQuantity: 0,
      TotalLooseKgQuantity: 0
    };
  }

  // Otherwise, return the non-zero quantities along with the original non-quantity fields
  return {
    ...data,
    ...nonZeroQuantities
  };
}




// Create a new stock transaction
router.post('/',async (req, res) => {
  try {
    const stockTransaction = await StockTransaction.create(req.body);
    res.status(201).json(stockTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all stock transactions
router.get('/', async (req, res) => {
  try {
    const stockTransactions = await StockTransaction.findAll();
    res.status(200).json(stockTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single stock transaction by ID
router.get('/:id',async (req, res) => {
  try {
    const stockTransaction = await StockTransaction.findByPk(req.params.id);
    if (stockTransaction) {
      res.status(200).json(stockTransaction);
    } else {
      res.status(404).json({ error: 'StockTransaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a stock transaction
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await StockTransaction.update(req.body, {
      where: { TransactionID: req.params.id }
    });
    if (updated) {
      const updatedStockTransaction = await StockTransaction.findByPk(req.params.id);
      res.status(200).json(updatedStockTransaction);
    } else {
      res.status(404).json({ error: 'StockTransaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a stock transaction
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await StockTransaction.destroy({
      where: { TransactionID: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'StockTransaction deleted' });
    } else {
      res.status(404).json({ error: 'StockTransaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




router.get('/stock/aggregater', async (req, res) => {
  try {
    const stockVariations = await StockTransaction.findAll({
      attributes: ['VariationID'],
      group: ['VariationID']
    });

    const results = await Promise.all(stockVariations.map(async (stock) => {
      const variationID = stock.VariationID;
      console.log(variationID)

      // Get stock quantities for different unit types
      const totalContainerQuantity = await getContainerOrSackStock(variationID, 'Container');
      const totalSackQuantity = await getContainerOrSackStock(variationID, 'Sack');
      const totalLooseLQuantity = await getLooseStock(variationID, 'L');
      const totalLooseKgQuantity = await getLooseStock(variationID, 'kg');

      // Fetch product details
      const productDetails = await ProductVariation.findOne({
        where: { VariationID: variationID },
        attributes: ['SKU'],
        include: {
          model: Product,
          attributes: ['ProductName']
        }
      });

      return {
        VariationID: variationID,
        SKU: productDetails ? productDetails.SKU : 'N/A',
        ProductName: productDetails ? productDetails.Product.ProductName : 'Unknown',
        TotalContainerQuantity: totalContainerQuantity || 0,
        TotalSackQuantity: totalSackQuantity || 0,
        TotalLooseLQuantity: totalLooseLQuantity || 0,
        TotalLooseKgQuantity: totalLooseKgQuantity || 0
      };
    }));

    res.json(results);
  } catch (err) {
    console.error('Error fetching aggregated stock transactions:', err);
    res.status(500).json({ error: 'An error occurred while fetching aggregated stock transactions.' });
  }
});

router.get('/stock/:variationID', async (req, res) => {
    try {
      const variationID = req.params.variationID;
      const stockDetails = await StockTransaction.findAll({
        where: { VariationID: variationID },
        include: [{
          model: ProductVariation,
          as: 'ProductVariation',
          include: [{
            model: Product,
            as: 'Product'
          }]
        }],
        order: [['TransactionDate', 'DESC']]

      });
  
      if (!stockDetails.length) {
        return res.status(404).json({ error: 'No transactions found for this variation' });
      }
  
      res.json(stockDetails);
    } catch (err) {
      console.error('Error fetching stock item transactions:', err);
      res.status(500).json({ error: 'An error occurred while fetching stock item transactions.' });
    }
  });




router.get('/stk/all', async (req, res) => {
  try {
    const stockVariations = await StockTransaction.findAll({
      attributes: ['VariationID'],
      group: ['VariationID']
    });

    const results = await Promise.all(stockVariations.map(async (stock) => {
      const variationID = stock.VariationID;

      // Get stock quantities for different unit types
      const totalContainerQuantity = await getContainerOrSackStock(variationID, 'Container');
      const totalSackQuantity = await getContainerOrSackStock(variationID, 'Sack');
      const totalLooseLQuantity = await getLooseStock(variationID, 'L');
      const totalLooseKgQuantity = await getLooseStock(variationID, 'kg');

      // Determine containerStock and looseStock
      let containerStock = (totalContainerQuantity > 0) ? totalContainerQuantity : (totalSackQuantity > 0) ? totalSackQuantity : 0;
      let looseStock = (totalLooseLQuantity > 0) ? totalLooseLQuantity : (totalLooseKgQuantity > 0) ? totalLooseKgQuantity : 0;

      // Fetch product details
      const productDetails = await ProductVariation.findOne({
        where: { VariationID: variationID },
        attributes: ['SKU'],
        include: {
          model: Product,
          attributes: ['ProductName']
        }
      });

      return {
        VariationID: variationID,
        SKU: productDetails ? productDetails.SKU : 'N/A',
        ProductName: productDetails ? productDetails.Product.ProductName : 'Unknown',
        ContainerStock: containerStock,
        LooseStock: looseStock
      };
    }));

    res.json(results);
  } catch (err) {
    console.error('Error fetching aggregated stock transactions:', err);
    res.status(500).json({ error: 'An error occurred while fetching aggregated stock transactions.' });
  }
});







router.get('/get-stock/:variationId', async (req, res) => {
  const { variationId } = req.params;

  try {
    const { ProductVariation, Product } = require('../models');
    const variation = await ProductVariation.findByPk(variationId, {
      include: [{ model: Product, attributes: ['Unit'] }],
    });

    const stocks = await StockTransaction.findOne({
      where: { VariationID: variationId },
      attributes: ['UnitType'],
    });

    let unitType = stocks?.UnitType || variation?.Product?.Unit || 'Container';
    if (!['Container', 'Sack'].includes(unitType)) {
      const sackUnits = ['Sack', 'KG', 'Kg', 'kg'];
      unitType = sackUnits.includes(unitType) ? 'Sack' : 'Container';
    }

    const totalContainerQuantity = await getContainerOrSackStock(variationId, 'Container');
    const totalSackQuantity = await getContainerOrSackStock(variationId, 'Sack');
    const totalLooseLQuantity = await getLooseStock(variationId, 'L');
    const totalLooseKgQuantity = await getLooseStock(variationId, 'KG');

    const containersStock = totalContainerQuantity > 0 ? totalContainerQuantity : (totalSackQuantity > 0 ? totalSackQuantity : 0);
    const looseStockquantity = totalLooseLQuantity > 0 ? totalLooseLQuantity : (totalLooseKgQuantity > 0 ? totalLooseKgQuantity : 0);
    const stock = {
      Container: containersStock,
      UnitType: unitType,
      LooseStock: looseStockquantity,
    };

    res.status(200).json({ message: 'Stock fetched successfully', stock });
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


module.exports = router;


