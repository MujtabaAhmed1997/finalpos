const express = require('express');
const router = express.Router();
const { PurchaseOrder } = require('../models/index');
const Supplier =require('../models/supplier');
const SupplierPayment=require('../models/supplierpaymentmodel');
const { Op } = require('sequelize');

// Create PurchaseOrder
router.post('/', async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.create(req.body);
    res.status(201).json(purchaseOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All PurchaseOrders with Pagination
// router.get('/', async (req, res) => {
//   const { page = 1, limit = 3 } = req.query; // Default to page 1 and limit 10

//   try {
//     const offset = (page - 1) * limit;
//     const { count, rows } = await PurchaseOrder.findAndCountAll({
//       include:[ {
//         model: Supplier,
//         attributes: ['SupplierName'], // Include only the SupplierName attribute
//       }
//     ],
      
//       limit: parseInt(limit),
//       offset: parseInt(offset)
//     });

//     const totalPages = Math.ceil(count / limit);
//     res.status(200).json({
//       purchaseOrders: rows,
//       totalPages
//     });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });


// router.get('/', async (req, res) => {
//   const { page = 1, limit = 3, supplierId } = req.query; // Default to page 1 and limit 3

//   try {
//     const offset = (page - 1) * limit;
//     let whereClause = {};

//     if (supplierId) {
//       whereClause = {
//         SupplierId: supplierId
//       };
//     }

//     const { count, rows } = await PurchaseOrder.findAndCountAll({
//       include: [
//         {
//           model: Supplier,
//           attributes: ['SupplierName'], // Include only the SupplierName attribute
//         }
//       ],
//       where: whereClause,
//       limit: parseInt(limit),
//       offset: parseInt(offset)
//     });

//     const totalPages = Math.ceil(count / limit);
//     res.status(200).json({
//       purchaseOrders: rows,
//       totalPages
//     });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });


router.get('/', async (req, res) => {
  const { page = 1, limit = 8, supplierId, startDate, endDate } = req.query;

  try {
    const offset = (page - 1) * limit;
    let whereClause = {};

    if (supplierId) {
      whereClause.SupplierId = supplierId;
    }
    if (startDate && endDate) {
      whereClause.OrderDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const { count, rows } = await PurchaseOrder.findAndCountAll({
      include: [
        {
          model: Supplier,
          attributes: ['SupplierName'],
        },
      ],
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      purchaseOrders: rows,
      totalPages,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Read One PurchaseOrder by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const purchaseOrder = await PurchaseOrder.findByPk(req.params.id, {
//       include: {
//         model: Supplier,
//         attributes: ['SupplierName'],
//       }
//     });
//     if (purchaseOrder) {
//       res.status(200).json(purchaseOrder);
//     } else {
//       res.status(404).json({ error: 'PurchaseOrder not found' });
//     }
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const purchaseOrder = await PurchaseOrder.findByPk(req.params.id, {
//       include: [
//         {
//           model: Supplier,
//           attributes: ['SupplierName'],
//         },
//         // Include SupplierPayments if needed
//         // {
//         //   model: SupplierPayment,
//         //   attributes: ['PaymentAmount'],
//         // },
//       ],
//     });
//     if (purchaseOrder) {
//       res.status(200).json({
//         date: purchaseOrder.OrderDate,
//         supplierName: purchaseOrder.Supplier.SupplierName,
//         totalAmount: purchaseOrder.TotalAmount,
//         amountPaid: purchaseOrder.AmountPaid,
//         remainingAmount: purchaseOrder.RemainingAmount,
//         paymentStatus: purchaseOrder.PaymentStatus,
//         items: [], // Fetch associated items if needed
//       });
//     } else {
//       res.status(404).json({ error: 'PurchaseOrder not found' });
//     }
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// Read One SalesOrder by ID
router.get('/:id', async (req, res) => {
  try {
    const purcahseorder = await PurchaseOrder.findByPk(req.params.id, {
      include: {
        model: Supplier,
        attributes: ['SupplierName'],
      }
    });
    if (purcahseorder) {
      res.status(200).json(purcahseorder);
    } else {
      res.status(404).json({ error: 'purcahseorder not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Update PurchaseOrder by ID
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await PurchaseOrder.update(req.body, {
      where: { PurchaseOrderID: req.params.id }
    });
    if (updated) {
      const updatedPurchaseOrder = await PurchaseOrder.findByPk(req.params.id, {
        include: {
          model: Supplier,
          attributes: ['SupplierName'],
        }
      });
      res.status(200).json(updatedPurchaseOrder);
    } else {
      res.status(404).json({ error: 'PurchaseOrder not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete PurchaseOrder by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await PurchaseOrder.destroy({
      where: { PurchaseOrderID: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'PurchaseOrder not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
// const express = require('express');
// const router = express.Router();
// const { PurchaseOrder } = require('../models/index');
// const Supplier = require('../models/supplier');
// const SupplierPayment = require('../models/supplierpaymentmodel');

// // Create PurchaseOrder
// router.post('/', async (req, res) => {
//   try {
//     const purchaseOrder = await PurchaseOrder.create(req.body);
//     res.status(201).json(purchaseOrder);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Read All PurchaseOrders with Pagination
// router.get('/', async (req, res) => {
//   const { page = 1, limit = 3 } = req.query; // Default to page 1 and limit 3

//   try {
//     const offset = (page - 1) * limit;
//     const { count, rows } = await PurchaseOrder.findAndCountAll({
//       include: [
//         {
//           model: Supplier,
//           attributes: ['SupplierName'], // Include only the SupplierName attribute
//         },
//         {
//           model: SupplierPayment,
//           attributes: ['PaymentAmount'], // Include only the amountPaid attribute
//         },
//       ],
//       limit: parseInt(limit),
//       offset: parseInt(offset)
//     });

//     const purchaseOrdersWithPayments = rows.map(purchaseOrder => {
//       const totalAmountPaid = purchaseOrder.SupplierPayments.reduce((acc, payment) => acc + payment.amountPaid, 0);
//       return {
//         ...purchaseOrder.toJSON(),
//         totalAmountPaid,
//       };
//     });

//     const totalPages = Math.ceil(count / limit);
//     res.status(200).json({
//       purchaseOrders: purchaseOrdersWithPayments,
//       totalPages
//     });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Read One PurchaseOrder by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const purchaseOrder = await PurchaseOrder.findByPk(req.params.id, {
//       include: [
//         {
//           model: Supplier,
//           attributes: ['SupplierName'],
//         },
//         {
//           model: SupplierPayment,
//           attributes: ['PaymentAmount'],
//         },
//       ],
//     });

//     if (purchaseOrder) {
//       const totalAmountPaid = purchaseOrder.SupplierPayments.reduce((acc, payment) => acc + payment.amountPaid, 0);
//       res.status(200).json({
//         ...purchaseOrder.toJSON(),
//         totalAmountPaid,
//       });
//     } else {
//       res.status(404).json({ error: 'PurchaseOrder not found' });
//     }
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Update PurchaseOrder by ID
// router.put('/:id', async (req, res) => {
//   try {
//     const [updated] = await PurchaseOrder.update(req.body, {
//       where: { PurchaseOrderID: req.params.id }
//     });
//     if (updated) {
//       const updatedPurchaseOrder = await PurchaseOrder.findByPk(req.params.id, {
//         include: [
//           {
//             model: Supplier,
//             attributes: ['SupplierName'],
//           },
//           {
//             model: SupplierPayment,
//             attributes: ['amountPaid'],
//           },
//         ],
//       });

//       const totalAmountPaid = updatedPurchaseOrder.SupplierPayments.reduce((acc, payment) => acc + payment.amountPaid, 0);
//       res.status(200).json({
//         ...updatedPurchaseOrder.toJSON(),
//         totalAmountPaid,
//       });
//     } else {
//       res.status(404).json({ error: 'PurchaseOrder not found' });
//     }
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Delete PurchaseOrder by ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const deleted = await PurchaseOrder.destroy({
//       where: { PurchaseOrderID: req.params.id }
//     });
//     if (deleted) {
//       res.status(204).json();
//     } else {
//       res.status(404).json({ error: 'PurchaseOrder not found' });
//     }
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// module.exports = router;
