// routes/customerLeisureRoutes.js

const express = require('express');
const sequelize = require('../db/sequelize');

const router = express.Router();
const CustomerLeisure = require('../models/customerleisure');
const { SalesOrder, SalesOrderDetail,Customer, Product, ProductVariation,ReturnOrder,ReturnOrderDetail } = require('../models');
const CustomerPayment=require('../models/customerpayment')
// Create a new customer leisure record
router.post('/', async (req, res) => {
  try {
    const leisure = await CustomerLeisure.create(req.body);
    res.status(201).json(leisure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to create CustomerLeisure entry
router.post('/create', async (req, res) => {
  const { CustomerID, TransactionType, TransactionID } = req.body;
  let t; // Declare the transaction variable here

  try {
    // Start a transaction
    t = await sequelize.transaction();

    // Fetch the previous balance
    const lastLeisureEntry = await CustomerLeisure.findOne({
      where: { CustomerID },
      order: [['TransactionDate', 'DESC']],
      transaction: t
    });

    let previousBalance = lastLeisureEntry ? lastLeisureEntry.Balance : 0;
    let debit = 0;
    let credit = 0;

    // Prevent duplicate ledger entries for the same transaction
    const existingEntry = await CustomerLeisure.findOne({
      where: { CustomerID, TransactionType, TransactionID },
      transaction: t
    });
    if (existingEntry) {
      await t.commit();
      return res.status(200).json(existingEntry);
    }

    // Determine Credit/Debit based on TransactionType
    if (TransactionType === 'SalesOrder') {
      const salesOrder = await SalesOrder.findByPk(TransactionID, { transaction: t });
      if (!salesOrder) throw new Error('SalesOrder not found');

      credit = parseFloat(salesOrder.TotalAmount) || 0;
      if (credit <= 0) {
        const details = await SalesOrderDetail.findAll({
          where: { SalesOrderID: TransactionID },
          transaction: t
        });
        credit = details.reduce((sum, detail) => {
          const qty = parseFloat(detail.Quantity) || 0;
          const loose = parseFloat(detail.LooseQuantity) || 0;
          const price = parseFloat(detail.UnitPrice) || 0;
          const discount = parseFloat(detail.Discount) || 0;
          const loosePrice = parseFloat(detail.LooseQuantityPrice) || 0;
          return sum + qty * (price - discount) + loose * loosePrice;
        }, 0);
        const amountPaid = parseFloat(salesOrder.AmountPaid) || 0;
        await salesOrder.update({
          TotalAmount: credit,
          RemainingAmount: Math.max(0, credit - amountPaid)
        }, { transaction: t });
      }
    } else if (TransactionType === 'Payment') {
      const customerPayment = await CustomerPayment.findByPk(TransactionID, { transaction: t });
      if (!customerPayment) throw new Error('CustomerPayment not found');

      debit = customerPayment.PaymentAmount;
    }else if (TransactionType === 'ReturnOrder') {
      const returnOrder = await ReturnOrder.findByPk(TransactionID, { transaction: t });
      if (!returnOrder) throw new Error('ReturnOrder not found');

      debit = returnOrder.TotalAmount;
    } 
    else {
      throw new Error('Invalid TransactionType');
    }

    // Calculate the new balance
    const balance = previousBalance + credit - debit;

    // Create a new CustomerLeisure entry
    const newLeisureEntry = await CustomerLeisure.create({
      CustomerID,
      TransactionType,
      TransactionID,
      TransactionDate: new Date(),
      Debit: debit,
      Credit: credit,
      Balance: balance,
    }, { transaction: t });

    // Commit the transaction
    await t.commit();

    // Return the newly created leisure entry
    res.status(201).json(newLeisureEntry);
  } catch (error) {
    // Rollback the transaction in case of error
    if (t) await t.rollback();

    console.error('Error creating CustomerLeisure entry:', error);
    res.status(400).json({ error: error.message });
  }
});



// Get all customer leisure records
router.get('/', async (req, res) => {
  try {
    const leisureRecords = await CustomerLeisure.findAll();
    res.status(200).json(leisureRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single customer leisure record by ID
router.get('/:id', async (req, res) => {
  try {
    const leisure = await CustomerLeisure.findByPk(req.params.id);
    if (leisure) {
      res.status(200).json(leisure);
    } else {
      res.status(404).json({ message: 'Leisure record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/customer/:customerid', async (req, res) => {
  const customerId = req.params.customerid;

  try {
    // Fetch leisure records for the customer
    const leisureRecords = await CustomerLeisure.findAll({
      where: { CustomerID: customerId },
      include: [
        { model: Customer, attributes: ['CustomerName'] }
      ],
      order: [['createdAt', 'DESC']] 
    });

    // If no leisure records found, return 404
    if (leisureRecords.length === 0) {
      return res.status(200).json([]);
    }

    // Enrich leisure records with related sales order details if applicable
    const enrichedLeisureRecords = await Promise.all(
      leisureRecords.map(async (record) => {
        if (record.TransactionType === 'SalesOrder') {
          try {
            // Fetch related sales order and sales order details
            const salesOrderdetail = await SalesOrderDetail.findAll({
              where: { SalesOrderID: record.TransactionID },
              include:[
                {
                  model:Product,
                  attributes:['ProductName']
                },
                {
                  model:ProductVariation,
                  attributes:['SKU','UnitsPerPackage']
                }
              ]
              
            });

            // Attach sales order details to the record
            return { ...record.toJSON(), SalesOrder: salesOrderdetail };
          } catch (error) {
            console.error(`Failed to fetch SalesOrder details for TransactionID ${record.TransactionID}:`, error);
            return { ...record.toJSON(), SalesOrder: null }; // Return record with null SalesOrder
          }
        }else  if (record.TransactionType === 'ReturnOrder') {
          try {
            // Fetch related sales order and sales order details
            const returnOrderdetail = await ReturnOrderDetail.findAll({
              where: { ReturnOrderID: record.TransactionID },
              include:[
                {
                  model:Product,
                  attributes:['ProductName']
                },
                {
                  model:ProductVariation,
                  attributes:['SKU','UnitsPerPackage']
                }
              ]
              
            });

            // Attach sales order details to the record
            return { ...record.toJSON(), ReturnOrder: returnOrderdetail };
          } catch (error) {
            console.error(`Failed to fetch SalesOrder details for TransactionID ${record.TransactionID}:`, error);
            return { ...record.toJSON(), ReturnOrder: null }; // Return record with null SalesOrder
          }
        } else {
          return record.toJSON ? record.toJSON() : record;
        }
      })
    );

    res.status(200).json(enrichedLeisureRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/customerss/:customerid', async (req, res) => {
  const customerId = req.params.customerid;

  // Extract page and pageSize from query params, with default values
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page
  const offset = (page - 1) * pageSize; // Calculate offset

  try {
    // Fetch total count of leisure records for the customer
    const totalRecords = await CustomerLeisure.count({
      where: { CustomerID: customerId }
    });

    // Fetch paginated leisure records for the customer
    const leisureRecords = await CustomerLeisure.findAll({
      where: { CustomerID: customerId },
      include: [{ model: Customer, attributes: ['CustomerName'] }],
      limit: pageSize,
      offset: offset
    });

    // If no leisure records found, return 404
    if (leisureRecords.length === 0) {
      return res.status(200).json([]);
    }

    // Enrich leisure records with related sales order details if applicable
    const enrichedLeisureRecords = await Promise.all(
      leisureRecords.map(async (record) => {
        if (record.TransactionType === 'SalesOrder') {
          try {
            // Fetch related sales order and sales order details
            const salesOrderDetail = await SalesOrderDetail.findAll({
              where: { SalesOrderID: record.TransactionID },
              include: [
                { model: Product, attributes: ['ProductName'] },
                { model: ProductVariation, attributes: ['SKU', 'UnitsPerPackage'] }
              ]
            });

            // Attach sales order details to the record
            return { ...record.toJSON(), SalesOrder: salesOrderDetail };
          } catch (error) {
            console.error(`Failed to fetch SalesOrder details for TransactionID ${record.TransactionID}:`, error);
            return { ...record.toJSON(), SalesOrder: null }; // Return record with null SalesOrder
          }
        } else {
          return record.toJSON ? record.toJSON() : record;
        }
      })
    );

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Return paginated and enriched data with pagination metadata
    res.status(200).json({
      data: enrichedLeisureRecords,
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalRecords: totalRecords
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Fetch leisure records for a specific customer
// router.get('/customer/:customerid', async (req, res) => {
//   const customerId = req.params.customerid;

//   try {
//     // Fetch leisure records for the customer
//     const leisureRecords = await CustomerLeisure.findAll({
//       where: { CustomerID: customerId },
//       include: [
//         { model: Customer, attributes: ['CustomerName'] }
//       ] // Initialize with empty include array
//     });

//     // If leisure records found, include additional data based on TransactionType
//     const enrichedLeisureRecords = await Promise.all(
//       leisureRecords.map(async (record) => {
//         if (record.TransactionType === 'Saleorder') {
//           // Fetch related sales order and sales order details
//           const salesOrder = await SalesOrder.findOne({
//             where: { SaleOrderID: record.TransactionID },
//             include: [{
//               model: SalesOrderDetail,
//               attributes: ['Quantity', 'LooseQuantity', 'ProductID', 'VariationID', 'UnitPrice']
//             }]
//           });
//           return { ...record.toJSON(), SalesOrder: salesOrder };
//         } else {
//           return record;
//         }
//       })
//     );

//     if (enrichedLeisureRecords.length > 0) {
//       res.status(200).json(enrichedLeisureRecords);
//     } else {
//       res.status(404).json({ message: 'Leisure record not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Update a customer leisure record by ID
router.put('/:id', async (req, res) => {
  try {
    const leisure = await CustomerLeisure.findByPk(req.params.id);
    if (leisure) {
      await leisure.update(req.body);
      res.status(200).json(leisure);
    } else {
      res.status(404).json({ message: 'Leisure record not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a customer leisure record by ID
router.delete('/:id', async (req, res) => {
  try {
    const leisure = await CustomerLeisure.findByPk(req.params.id);
    if (leisure) {
      await leisure.destroy();
      res.status(204).json({ message: 'Leisure record deleted' });
    } else {
      res.status(404).json({ message: 'Leisure record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
