const express = require('express');
const router = express.Router();
const { SalesOrderDetail } = require('../models');
const ProductVariation = require('../models/productvariation');
const Product = require('../models/product');
const Customer = require('../models/customer');
// Get all SalesOrderDetails with Pagination
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await SalesOrderDetail.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      salesOrderDetails: rows,
      totalPages
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific SalesOrderDetail by ID
router.get('/:id', async (req, res) => {
  try {
    const salesOrderDetail = await SalesOrderDetail.findByPk(req.params.id);
    if (salesOrderDetail) {
      res.status(200).json(salesOrderDetail);
    } else {
      res.status(404).json({ error: 'SalesOrderDetail not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a specific SalesOrderDetail by ID
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await SalesOrderDetail.update(req.body, {
      where: { SalesOrderDetailID: req.params.id }
    });
    if (updated) {
      const updatedSalesOrderDetail = await SalesOrderDetail.findByPk(req.params.id);
      res.status(200).json(updatedSalesOrderDetail);
    } else {
      res.status(404).json({ error: 'SalesOrderDetail not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a specific SalesOrderDetail by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await SalesOrderDetail.destroy({
      where: { SalesOrderDetailID: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'SalesOrderDetail not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create new SalesOrderDetail
router.post('/', async (req, res) => {
  console.log('Received body:', req.body); // Add this line

  try {
    const salesOrderDetails = await SalesOrderDetail.bulkCreate(req.body.entries);
    res.status(201).json(salesOrderDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get SalesOrderDetails by SalesOrderID with Pagination
// router.get('/salesOrder/:id/details', async (req, res) => {
//   const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
//   const salesOrderId = req.params.id;

//   try {
//     const offset = (page - 1) * limit;
//     const { count, rows } = await SalesOrderDetail.findAndCountAll({
//       where: { SalesOrderID: salesOrderId },
//       limit: parseInt(limit),
//       offset: parseInt(offset),include: [
//         {
//           model: Product,
//           attributes: ['ProductName'] // Adjust the attributes according to your Product model
//         },{
//           model:ProductVariation,
//           attribute:['Size']
//         },{
//           model: ProductVariation, // Ensure this model is defined in your Sequelize setup
//           attributes: ['UnitsPerPackage'] // Fetch only the required field
//         }]
//     });

//     const totalPages = Math.ceil(count / limit);
//     res.status(200).json({
//       salesOrderDetails: rows,
//       totalPages
//     });
//   } catch (err) {
//     console.error('Error fetching sales order details:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


router.get('/salesOrder/:id/details', async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
  const salesOrderId = req.params.id;

  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await SalesOrderDetail.findAndCountAll({
      where: { SalesOrderID: salesOrderId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Product,
          attributes: ['ProductName']
        },
        {
          model: ProductVariation,
          attributes: ['Size', 'UnitsPerPackage'] // Adjust the attributes according to your ProductVariation model
        }
      ]
    });

    const totalPages = Math.ceil(count / limit);

    // Calculate the total amount for each detail
    const OrderDetails = rows.map(detail => {
      const { UnitPrice, Discount, LooseQuantity, Quantity, LooseQuantityPrice } = detail;
      const { UnitsPerPackage } = detail.ProductVariation;

      // const discountedPrice = UnitPrice - Discount;
      // const singlePiecePrice = discountedPrice / UnitsPerPackage;
      // const looseQuantityPrice = LooseQuantity * singlePiecePrice;
      // const detailTotal = (Quantity * discountedPrice) + looseQuantityPrice;
      const discountedPrice = UnitPrice - Discount
      const detailTotal = (Quantity * discountedPrice) + LooseQuantityPrice * LooseQuantity;
      const totalsum = Math.round(detailTotal);

      return {
        ...detail.toJSON(),
        total: totalsum
      };
    });

    // Calculate the overall total
    const total = OrderDetails.reduce((acc, detail) => acc + detail.total, 0);

    res.status(200).json({
      OrderDetails,
      totalPages,
      total
    });
  } catch (err) {
    console.error('Error fetching sales order details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get SalesOrderDetails by SalesOrderID with Pagination and Total Calculation
router.get('/salesOrder/:id/total', async (req, res) => {
  const salesOrderId = req.params.id;

  try {

    // Fetch sale order details
    const detail = await SalesOrderDetail.findAll({
      where: { SalesOrderID: salesOrderId },
      include: [{
        model: ProductVariation, // Ensure this model is defined in your Sequelize setup
        attributes: ['UnitsPerPackage'] // Fetch only the required field
      }]

    });
    // Calculate total based on the fetched details
    const total = detail.reduce((acc, detail) => {
      // Extract values from each detail
      const { UnitPrice, Discount, LooseQuantity, Quantity, LooseQuantityPrice } = detail;
      const { UnitsPerPackage } = detail.ProductVariation; // Assuming this relationship is set up


      // Apply the calculation logic
      // const discountedPrice = UnitPrice - Discount;
      // const singlePiecePrice = discountedPrice / UnitsPerPackage;
      // const looseQuantityPrice = LooseQuantity * singlePiecePrice;
      // const detailTotal =( Quantity * discountedPrice )+ looseQuantityPrice;
      const discountedPrice = UnitPrice - Discount
      const detailTotal = (Quantity * discountedPrice) + LooseQuantityPrice * LooseQuantity;



      const totalsum = Math.round(detailTotal);


      console.log(totalsum);

      // Accumulate the total
      return acc + totalsum;
    }, 0);


    res.status(200).json({
      detail, total

    });
  } catch (err) {
    console.error('Error fetching sales order details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// PUT: Update Sales Order Details by EntryID
// router.put('/update/:EntryID', async (req, res) => {
//   try {
//     const { EntryID } = req.params;
//     console.log("update entryid",EntryID)
//     const updatedData = req.body;  // Get the data from the request body

//     // Check if the sales order detail exists
//     const salesOrderDetail = await SalesOrderDetail.findOne({
//       where: { EntryID: EntryID },
//     });

//     if (!salesOrderDetail) {
//       return res.status(404).json({ message: 'Sales Order Details not found' });
//     }

//     // Update the sales order detail
//     await salesOrderDetail.update(updatedData);

//     // Send the updated details as the response
//     res.json(salesOrderDetail);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

router.put('/salesordersdetails/update/:id', async (req, res) => {
  try {
    const { id } = req.params; // Use `id` instead of `EntryID`
    const { BatchID } = req.body;

    const salesOrderDetail = await SalesOrderDetail.findOne({ where: { ID: id } });

    if (!salesOrderDetail) {
      return res.status(404).json({ message: 'Sales Order Detail not found' });
    }

    await salesOrderDetail.update({ BatchID });

    res.json({ message: 'Sales Order Detail updated successfully' });
  } catch (error) {
    console.error('Error updating sales order detail:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});



module.exports = router;
