// routes/supplierLeisureRoutes.js

const express = require('express');
const router = express.Router();
const SupplierLeisure = require('../models/supplierleisure');
const { PurchaseOrder, SupplierPayment, PurchaseOrderDetail,Product,ProductVariation } = require('../models');
const sequelize = require('../db/sequelize');
const adminAuth = require('../auth/adminchecker'); // Import the adminAuth middleware
const Supplier = require('../models/supplier');
const authMiddleware = require('../auth/authtoken');
// Create a new supplier leisure record
router.post('/', async (req, res) => {
  try {
    const leisure = await SupplierLeisure.create(req.body);
    res.status(201).json(leisure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post('/create', async (req, res) => {
  const { SupplierID, TransactionType, TransactionID } = req.body;
  let t; // Declare the transaction variable here

  try {
    // Start a transaction
    t = await sequelize.transaction();

    // Fetch the previous balance
    const lastLeisureEntry = await SupplierLeisure.findOne({
      where: { SupplierID },
      order: [['TransactionDate', 'DESC']],
      transaction: t
    });

    let previousBalance = lastLeisureEntry ? lastLeisureEntry.Balance : 0;
    let debit = 0;
    let credit = 0;

    const existingEntry = await SupplierLeisure.findOne({
      where: { SupplierID, TransactionType, TransactionID },
      transaction: t
    });
    if (existingEntry) {
      await t.commit();
      return res.status(200).json(existingEntry);
    }

    // Determine Credit/Debit based on TransactionType
    if (TransactionType === 'PurchaseOrder') {
      const purchaseorder = await PurchaseOrder.findByPk(TransactionID, { transaction: t });
      if (!purchaseorder) throw new Error('PurchaseOrder not found');

      credit = purchaseorder.TotalAmount;
    } else if (TransactionType === 'Payment') {
      const supplierpayment = await SupplierPayment.findByPk(TransactionID, { transaction: t });
      if (!supplierpayment) throw new Error('supplierpayment not found');

      debit = supplierpayment.PaymentAmount;
    } else {
      throw new Error('Invalid TransactionType');
    }

    // Calculate the new balance
    const balance = previousBalance + credit - debit;

    // Create a new CustomerLeisure entry
    const newLeisureEntry = await SupplierLeisure.create({
      SupplierID,
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

    console.error('Error creating Supplierleisure entry:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/supplier/:supplierid', authMiddleware, async (req, res) => {
  const supplierid = req.params.supplierid;
  

  try {
    // Fetch leisure records for the customer
    const leisureRecords = await SupplierLeisure.findAll({
      where: { SupplierID: supplierid },
      include: [
        { model: Supplier, attributes: ['SupplierName'] }
      ]
    });

    // If no leisure records found, return 404
    if (leisureRecords.length === 0) {
      return res.status(200).json([]);
    }

    // Enrich leisure records with related sales order details if applicable
    const enrichedLeisureRecords = await Promise.all(
      leisureRecords.map(async (record) => {
        if (record.TransactionType === 'PurchaseOrder') {
          try {
            // Fetch related sales order and sales order details
            const purchaseOrderdetail = await PurchaseOrderDetail.findAll({
              where: { PurchaseOrderID: record.TransactionID },
              include:[
                {
                  model:Product,
                  attributes:['ProductName']
                },
                {
                  model:ProductVariation,
                  attributes:['SKU']
                }
              ]
              
            });

            // Attach sales order details to the record
            return { ...record.toJSON(), PurchaseOrder: purchaseOrderdetail };
          } catch (error) {
            console.error(`Failed to fetch PurchaseOrder details for TransactionID ${record.TransactionID}:`, error);
            return { ...record.toJSON(), PurchaseOrder: null }; // Return record with null SalesOrder
          }
        } else {
          return record; // Return record as is if not SalesOrder
        }
      })
    );

    res.status(200).json(enrichedLeisureRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all supplier leisure records
router.get('/',authMiddleware,adminAuth, async (req, res) => {
  try {
    const leisureRecords = await SupplierLeisure.findAll();
    res.status(200).json(leisureRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single supplier leisure record by ID
router.get('/:id',authMiddleware,adminAuth, async (req, res) => {
  try {
    const leisure = await SupplierLeisure.findByPk(req.params.id);
    if (leisure) {
      res.status(200).json(leisure);
    } else {
      res.status(404).json({ message: 'Leisure record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a supplier leisure record by ID
router.put('/:id', async (req, res) => {
  try {
    const leisure = await SupplierLeisure.findByPk(req.params.id);
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

// Delete a supplier leisure record by ID
router.delete('/:id', async (req, res) => {
  try {
    const leisure = await SupplierLeisure.findByPk(req.params.id);
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
