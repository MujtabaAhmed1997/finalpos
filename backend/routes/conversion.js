//working solutions


// const express = require('express');
// const router = express.Router();
// const StockTransaction = require('../models/stockstranscation'); // Adjust path as needed
// const ProductVariation = require('../models/productvariation'); // Adjust path as needed

// // Helper function to get available loose stock
// async function getLooseStock(VariationID, unitType) {
//   const transactions = await StockTransaction.findAll({
//     where: {
//       VariationID: VariationID,
//       UnitType: unitType
//     }
//   });

//   let looseStock = 0;
//   transactions.forEach(transaction => {
//     if (transaction.TransactionType === 'IN' || transaction.TransactionType === 'CONVERSION') {
//       console.log("INNING LOSE",transaction.Quantity);
//       looseStock += transaction.Quantity;
//     } else if (transaction.TransactionType === 'OUT') {
//       console.log("outing LOSE",transaction.Quantity);
//       looseStock -= transaction.Quantity;
//     }
//   });
//   return looseStock;
// }

// // Helper function to get available container stock
// async function getContainerStock(VariationID) {
//   const transactions = await StockTransaction.findAll({
//     where: {
//       VariationID: VariationID,
//       UnitType: 'Container'
//     }
//   });

//   let containerStock = 0;
//   transactions.forEach(transaction => {
//     if (transaction.TransactionType === 'IN') {
//       console.log("inning", transaction.Quantity);
//       containerStock += transaction.Quantity;
//     } else if (transaction.TransactionType === 'OUT' || transaction.TransactionType === 'CONVERSION') {
//       console.log("out or conversion", transaction.Quantity);
//       containerStock -= transaction.Quantity;
//     }
//     // console.log("Container", containerStock);
//   });
//   return containerStock;
// }

// // Function to open a new container or sack
// async function openContainer(VariationID, quantityPerContainer, unitType) {
//   await StockTransaction.create({
//     VariationID: VariationID,
//     TransactionDate: new Date(),
//     Quantity: 1,
//     UnitType: 'Container',
//     TransactionType: 'CONVERSION'
//   });

//   await StockTransaction.create({
//     VariationID: VariationID,
//     TransactionDate: new Date(),
//     Quantity: quantityPerContainer,
//     UnitType: unitType,
//     TransactionType: 'IN'
//   });
// }

// // Route to handle selling both container and loose quantities
// router.post('/sell-quantity', async (req, res) => {
//   const { VariationID, containerQuantity, looseQuantity, unitType } = req.body;

//   try {
//     const availableLooseStock = await getLooseStock(VariationID, unitType);
//     const containerStock = await getContainerStock(VariationID);
//     const productVariation = await ProductVariation.findByPk(VariationID);

//     if (!productVariation) {
//       return res.status(404).json({ message: 'ProductVariation not found' });
//     }

//     const quantityPerContainer = productVariation.UnitsPerPackage;
//     console.log("container request to be sold", containerQuantity);
//     console.log("Containers avaliable in stock", containerStock);
//     console.log("Loosequantity avaliable in stock", availableLooseStock);


//     if (quantityPerContainer === 1) {
//       // Handle products with UnitsPerPackage === 1
//       const totalContainersToSell = containerQuantity;

//       if (containerStock >= totalContainersToSell) {
//         await StockTransaction.create({
//           VariationID: VariationID,
//           TransactionDate: new Date(),
//           Quantity: totalContainersToSell,
//           UnitType: 'Container',
//           TransactionType: 'OUT'
//         });
//         console.log('Total containers sold from container stock');
//       } else {
//         return res.status(400).json({ message: 'Not enough containers available' });
//       }
//     } else {
//       // Handle container quantity first
//       if (containerStock >= containerQuantity) {
//         await StockTransaction.create({
//           VariationID: VariationID,
//           TransactionDate: new Date(),
//           Quantity: containerQuantity,
//           UnitType: 'Container',
//           TransactionType: 'OUT'
//         });
//         console.log('Containers sold from container stock');
//       } else {
//         return res.status(400).json({ message: 'Not enough containers available' });
//       }

//       // Handle loose quantity
//       if (availableLooseStock >= looseQuantity) {
//         await StockTransaction.create({
//           VariationID: VariationID,
//           TransactionDate: new Date(),
//           Quantity: looseQuantity,
//           UnitType: unitType,
//           TransactionType: 'OUT'
//         });
//         console.log('Loose quantity sold from loose stock');
//       } else {
//         const deficit = looseQuantity - availableLooseStock;
//         const requiredContainers = Math.ceil(deficit / quantityPerContainer);

//         if (requiredContainers > containerStock) {
//           return res.status(400).json({ message: 'Not enough containers available to open for loose quantity' });
//         }

//         for (let i = 0; i < requiredContainers; i++) {
//           await openContainer(VariationID, quantityPerContainer, unitType);
//         }

//         const newAvailableLooseStock = availableLooseStock + (requiredContainers * quantityPerContainer);

//         await StockTransaction.create({
//           VariationID: VariationID,
//           TransactionDate: new Date(),
//           Quantity: looseQuantity,
//           UnitType: unitType,
//           TransactionType: 'OUT'
//         });
//         console.log('Loose quantity sold by opening new containers and using loose stock');
//       }
//     }

//     res.status(200).json({ message: 'Quantity sold and stock updated successfully' });
//   } catch (error) {
//     console.error('Error selling quantity:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// module.exports = router;



// // Helper function to get available loose stock for sacks
// async function getLooseStockKg(VariationID) {
//   const transactions = await StockTransaction.findAll({
//     where: {
//       VariationID: VariationID,
//       UnitType: 'KG' // For loose quantity in kilograms
//     }
//   });

//   let looseStock = 0;
//   transactions.forEach(transaction => {
//     if (transaction.TransactionType === 'IN' || transaction.TransactionType === 'CONVERSION') {
//       looseStock += transaction.Quantity;
//     } else if (transaction.TransactionType === 'OUT') {
//       looseStock -= transaction.Quantity;
//     }
//   });
//   return looseStock;
// }

// // Helper function to get available sack stock
// async function getSackStock(VariationID) {
//   const transactions = await StockTransaction.findAll({
//     where: {
//       VariationID: VariationID,
//       UnitType: 'Sack'
//     }
//   });

//   let sackStock = 0;
//   transactions.forEach(transaction => {
//     if (transaction.TransactionType === 'IN') {
//       sackStock += transaction.Quantity;
//     } else if (transaction.TransactionType === 'OUT' || transaction.TransactionType === 'CONVERSION') {
//       sackStock -= transaction.Quantity;
//     }
//   });
//   return sackStock;
// }

// // Function to open a new sack
// async function openSack(VariationID, quantityPerSack) {
//   await StockTransaction.create({
//     VariationID: VariationID,
//     TransactionDate: new Date(),
//     Quantity: 1,
//     UnitType: 'Sack',
//     TransactionType: 'CONVERSION'
//   });

//   await StockTransaction.create({
//     VariationID: VariationID,
//     TransactionDate: new Date(),
//     Quantity: quantityPerSack,
//     UnitType: 'KG', // Adding loose stock in KG
//     TransactionType: 'IN'
//   });
// }

// // Route to handle selling both sack and loose quantities
// router.post('/sell-sack-quantity', async (req, res) => {
//   const { VariationID, sackQuantity, looseQuantity } = req.body;

//   try {
//     const availableLooseStockKg = await getLooseStockKg(VariationID);
//     const sackStock = await getSackStock(VariationID);
//     const productVariation = await ProductVariation.findByPk(VariationID);

//     if (!productVariation) {
//       return res.status(404).json({ message: 'ProductVariation not found' });
//     }

//     const quantityPerSack = productVariation.UnitsPerPackage; // Number of KG per sack

//     // Handle sack quantity first
//     if (sackStock >= sackQuantity) {
//       await StockTransaction.create({
//         VariationID: VariationID,
//         TransactionDate: new Date(),
//         Quantity: sackQuantity,
//         UnitType: 'Sack',
//         TransactionType: 'OUT'
//       });
//       console.log('Sacks sold from sack stock');
//     } else {
//       return res.status(400).json({ message: 'Not enough sacks available' });
//     }

//     // Handle loose quantity
//     if (availableLooseStockKg >= looseQuantity) {
//       await StockTransaction.create({
//         VariationID: VariationID,
//         TransactionDate: new Date(),
//         Quantity: looseQuantity,
//         UnitType: 'KG',
//         TransactionType: 'OUT'
//       });
//       console.log('Loose quantity sold from loose stock');
//     } else {
//       const deficitKg = looseQuantity - availableLooseStockKg;
//       const requiredSacks = Math.ceil(deficitKg / quantityPerSack);

//       if (requiredSacks > sackStock) {
//         return res.status(400).json({ message: 'Not enough sacks available to open for loose quantity' });
//       }

//       for (let i = 0; i < requiredSacks; i++) {
//         await openSack(VariationID, quantityPerSack);
//       }

//       const newAvailableLooseStockKg = availableLooseStockKg + (requiredSacks * quantityPerSack);

//       await StockTransaction.create({
//         VariationID: VariationID,
//         TransactionDate: new Date(),
//         Quantity: looseQuantity,
//         UnitType: 'KG',
//         TransactionType: 'OUT'
//       });
//       console.log('Loose quantity sold by opening new sacks and using loose stock');
//     }

//     res.status(200).json({ message: 'Sack and loose quantity sold and stock updated successfully' });
//   } catch (error) {
//     console.error('Error selling sack quantity:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });





//solution2


// const express = require('express');
// const router = express.Router();
// const StockTransaction = require('../models/stockstranscation'); // Adjust path as needed
// const ProductVariation = require('../models/productvariation'); // Adjust path as needed

// // Helper function to get available loose stock
// async function getLooseStock(VariationID, unitType) {
//   const transactions = await StockTransaction.findAll({
//     where: {
//       VariationID: VariationID,
//       UnitType: unitType
//     }
//   });

//   let looseStock = 0;
//   transactions.forEach(transaction => {
//     if (transaction.TransactionType === 'IN' || transaction.TransactionType === 'CONVERSION') {
//       looseStock += transaction.Quantity;
//     } else if (transaction.TransactionType === 'OUT') {
//       looseStock -= transaction.Quantity;
//     }
//   });
//   return looseStock;
// }

// // Helper function to get available container or sack stock
// async function getContainerOrSackStock(VariationID, unitType) {
//   const transactions = await StockTransaction.findAll({
//     where: {
//       VariationID: VariationID,
//       UnitType: unitType
//     }
//   });

//   let containerOrSackStock = 0;
//   transactions.forEach(transaction => {
//     if (transaction.TransactionType === 'IN') {
//       containerOrSackStock += transaction.Quantity;
//     } else if (transaction.TransactionType === 'OUT' || transaction.TransactionType === 'CONVERSION') {
//       containerOrSackStock -= transaction.Quantity;
//     }
//   });
//   return containerOrSackStock;
// }

// // Function to open a new container or sack
// async function openContainerOrSack(VariationID, quantityPerContainer, unitType) {
//   await StockTransaction.create({
//     VariationID: VariationID,
//     TransactionDate: new Date(),
//     Quantity: 1,
//     UnitType: unitType,
//     TransactionType: 'CONVERSION'
//   });

//   await StockTransaction.create({
//     VariationID: VariationID,
//     TransactionDate: new Date(),
//     Quantity: quantityPerContainer,
//     UnitType: unitType === 'Container' ? 'L' : 'KG',
//     TransactionType: 'IN'
//   });
// }

// // Route to handle selling both container/sack and loose quantities
// router.post('/sell-quantity', async (req, res) => {
//   const { VariationID, containerOrSackQuantity, looseQuantity, containerOrSackType, looseUnitType } = req.body;

//   try {
//     const availableLooseStock = await getLooseStock(VariationID, looseUnitType);
//     const containerOrSackStock = await getContainerOrSackStock(VariationID, containerOrSackType);
//     const productVariation = await ProductVariation.findByPk(VariationID);
//     console.log(1);
//     if (!productVariation) {
//       return res.status(404).json({ message: 'ProductVariation not found' });
//     }

//     const quantityPerContainerOrSack = productVariation.UnitsPerPackage;

//     if (quantityPerContainerOrSack === 1) {
//       // Handle products with UnitsPerPackage === 1
//       const totalContainersOrSacksToSell = containerOrSackQuantity;

//       if (containerOrSackStock >= totalContainersOrSacksToSell) {
//         await StockTransaction.create({
//           VariationID: VariationID,
//           TransactionDate: new Date(),
//           Quantity: totalContainersOrSacksToSell,
//           UnitType: containerOrSackType,
//           TransactionType: 'OUT'
//         });
//       } else {
//         return res.status(400).json({ message: 'Not enough containers or sacks available' });
//       }
//     } else {
//       // Handle container/sack quantity first
//       if (containerOrSackStock >= containerOrSackQuantity) {
//         await StockTransaction.create({
//           VariationID: VariationID,
//           TransactionDate: new Date(),
//           Quantity: containerOrSackQuantity,
//           UnitType: containerOrSackType,
//           TransactionType: 'OUT'
//         });
//       } else {
//         return res.status(400).json({ message: 'Not enough containers or sacks available' });
//       }

//       // Handle loose quantity
//       if (availableLooseStock >= looseQuantity) {
//         await StockTransaction.create({
//           VariationID: VariationID,
//           TransactionDate: new Date(),
//           Quantity: looseQuantity,
//           UnitType: looseUnitType,
//           TransactionType: 'OUT'
//         });
//       } else {
//         const deficit = looseQuantity - availableLooseStock;
//         const requiredContainersOrSacks = Math.ceil(deficit / quantityPerContainerOrSack);

//         if (requiredContainersOrSacks > containerOrSackStock) {
//           return res.status(400).json({ message: 'Not enough containers or sacks available to open for loose quantity' });
//         }

//         for (let i = 0; i < requiredContainersOrSacks; i++) {
//           await openContainerOrSack(VariationID, quantityPerContainerOrSack, containerOrSackType);
//         }

//         const newAvailableLooseStock = availableLooseStock + (requiredContainersOrSacks * quantityPerContainerOrSack);

//         await StockTransaction.create({
//           VariationID: VariationID,
//           TransactionDate: new Date(),
//           Quantity: looseQuantity,
//           UnitType: looseUnitType,
//           TransactionType: 'OUT'
//         });
//       }
//     }

//     res.status(200).json({ message: 'Quantity sold and stock updated successfully' });
//   } catch (error) {
//     console.error('Error selling quantity:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// module.exports = router;




//last working 28-12-2024

// const express = require('express');
// const router = express.Router();
// const StockTransaction = require('../models/stockstranscation');
// const ProductVariation = require('../models/productvariation');
// const { sequelize } = require('../models');


// //1
// // Helper function to get stock by unit type
// async function getStockByUnitType(VariationID, unitType) {
//   const transactions = await StockTransaction.findAll({
//     where: { VariationID: VariationID, UnitType: unitType }
//   });

//   let stock = 0;
//   transactions.forEach(transaction => {
//     if (transaction.TransactionType === 'IN' || transaction.TransactionType === 'CONVERSION') {
//       stock += transaction.Quantity;
//     } else if (transaction.TransactionType === 'OUT') {
//       stock -= transaction.Quantity;
//     }
//   });
//   return stock;
// }

// //1

// // Function to open new stock (either container or sack)
// async function openStock(VariationID, quantityPerUnit, unitType) {
//   const unitTransactionType = unitType === 'Container' ? 'Container' : 'Sack';

//   await StockTransaction.create({
//     VariationID: VariationID,
//     TransactionDate: new Date(),
//     Quantity: 1,
//     UnitType: unitTransactionType,
//     TransactionType: 'CONVERSION'
//   });

//   await StockTransaction.create({
//     VariationID: VariationID,
//     TransactionDate: new Date(),
//     Quantity: quantityPerUnit,
//     UnitType: unitType === 'Container' ? 'L' : 'KG',
//     TransactionType: 'IN'
//   });
// }

// // Route to handle selling both container and loose quantities
// // router.post('/sell-quantity', async (req, res) => {
// //   const { VariationID, containerQuantity, looseQuantity, unitType } = req.body;
// //   console.log(req.body);

// //   const transaction = await sequelize.transaction(); // Begin transaction

// //   try {
// //     const availableLooseStock = await getStockByUnitType(VariationID, unitType);
// //     const containerStock = await getStockByUnitType(VariationID, unitType);
// //     const productVariation = await ProductVariation.findByPk(VariationID);
// //    console.log("container Stock",containerStock);
// //    console.log("Loose Stock",availableLooseStock);
// //     if (!productVariation) {
// //       return res.status(404).json({ message: 'ProductVariation not found' });
// //     }

// //     const quantityPerContainer = productVariation.UnitsPerPackage;

// //     // Selling container logic
// //     if (containerStock >= containerQuantity) {
// //       console.log(1);
// //       await StockTransaction.create({
// //         VariationID: VariationID,
// //         TransactionDate: new Date(),
// //         Quantity: containerQuantity,
// //         UnitType: unitType,
// //         TransactionType: 'OUT'
// //       }, { transaction });
// //     } else {
// //       return res.status(400).json({ message: 'Not enough containers available 1' });
// //     }

// //     // Selling loose quantity logic
// //     if (availableLooseStock >= looseQuantity) {
// //       await StockTransaction.create({
// //         VariationID: VariationID,
// //         TransactionDate: new Date(),
// //         Quantity: looseQuantity,
// //         UnitType: unitType,
// //         TransactionType: 'OUT'
// //       }, { transaction });
// //     } else {
// //       const deficit = looseQuantity - availableLooseStock;
// //       const requiredContainers = Math.ceil(deficit / quantityPerContainer);

// //       if (requiredContainers > containerStock) {
// //         return res.status(400).json({ message: 'Not enough containers to open for loose quantity 2' });
// //       }

// //       for (let i = 0; i < requiredContainers; i++) {
// //         await openStock(VariationID, quantityPerContainer, unitType);
// //       }

// //       await StockTransaction.create({
// //         VariationID: VariationID,
// //         TransactionDate: new Date(),
// //         Quantity: looseQuantity,
// //         UnitType: unitType,
// //         TransactionType: 'OUT'
// //       }, { transaction });
// //     }

// //     await transaction.commit();  // Commit transaction
// //     res.status(200).json({ message: 'Quantity sold and stock updated successfully' });
// //   } catch (error) {
// //     await transaction.rollback();  // Rollback transaction on error
// //     console.error('Error selling quantity:', error);
// //     res.status(500).json({ message: 'Internal Server Error', error: error.message });
// //   }
// // });

// router.post('/sell-quantity', async (req, res) => {
//   const { VariationID, containerQuantity, looseQuantity, unitType } = req.body;
//   console.log(req.body);

//   const transaction = await sequelize.transaction(); // Begin transaction

//   try {
//     // Get appropriate unit types based on the unitType (Container or Sack)
//     let containerStock, availableLooseStock, looseUnitType;
//     if (unitType === 'Container') {
//       containerStock = await getStockByUnitType(VariationID, 'Container');
//       availableLooseStock = await getStockByUnitType(VariationID, 'L'); // Loose stock for Container
//       looseUnitType = 'L';
//     } else if (unitType === 'Sack') {
//       containerStock = await getStockByUnitType(VariationID, 'Sack');
//       availableLooseStock = await getStockByUnitType(VariationID, 'KG'); // Loose stock for Sack
//       looseUnitType = 'KG';
//       console.log(containerStock);
//       console.log(availableLooseStock);
//     } else {
//       return res.status(400).json({ message: 'Invalid unit type' });
//     }

//     const productVariation = await ProductVariation.findByPk(VariationID);
//     if (!productVariation) {
//       return res.status(404).json({ message: 'ProductVariation not found' });
//     }

//     const quantityPerContainer = productVariation.UnitsPerPackage;

//     // Selling container logic
//     if (containerStock >= containerQuantity) {
//       await StockTransaction.create({
//         VariationID: VariationID,
//         TransactionDate: new Date(),
//         Quantity: containerQuantity,
//         UnitType: unitType, // Either 'Container' or 'Sack'
//         TransactionType: 'OUT'
//       }, { transaction });
//     } else {
//       return res.status(400).json({ message: `Not enough ${unitType.toLowerCase()}s available` });
//     }

//     // Selling loose quantity logic
//     if (availableLooseStock >= looseQuantity) {
//       await StockTransaction.create({
//         VariationID: VariationID,
//         TransactionDate: new Date(),
//         Quantity: looseQuantity,
//         UnitType: looseUnitType, // Either 'L' for Container or 'KG' for Sack
//         TransactionType: 'OUT'
//       }, { transaction });
//     } else {
//       const deficit = looseQuantity - availableLooseStock;
//       const requiredContainers = Math.ceil(deficit / quantityPerContainer);

//       if (requiredContainers > containerStock) {
//         return res.status(400).json({ message: `Not enough ${unitType.toLowerCase()}s to open for loose quantity` });
//       }

//       // Open required containers to convert into loose stock
//       for (let i = 0; i < requiredContainers; i++) {
//         await openStock(VariationID, quantityPerContainer, looseUnitType); // Open container/sack and add loose in L or KG
//       }

//       await StockTransaction.create({
//         VariationID: VariationID,
//         TransactionDate: new Date(),
//         Quantity: looseQuantity,
//         UnitType: looseUnitType, // Again, 'L' for Container or 'KG' for Sack
//         TransactionType: 'OUT'
//       }, { transaction });
//     }

//     await transaction.commit();  // Commit transaction
//     res.status(200).json({ message: 'Quantity sold and stock updated successfully' });
//   } catch (error) {
//     await transaction.rollback();  // Rollback transaction on error
//     console.error('Error selling quantity:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

// module.exports = router;


//sol
const express = require('express');
const router = express.Router();
const StockTransaction = require('../models/stockstranscation');
const ProductVariation = require('../models/productvariation');
const { sequelize } = require('../models');
const { Op } = require('sequelize');


// Helper function to get available stock in FIFO order
async function getFIFOStock(VariationID, unitType) {
  console.log(`Fetching FIFO stock for VariationID: ${VariationID}, UnitType: ${unitType}`);
  const stock = await StockTransaction.findAll({
    where: {
      VariationID: VariationID,
      UnitType: unitType,
      TransactionType: 'IN',
      RemainingQuantity: { [Op.gt]: 0 }
    },
    order: [['TransactionDate', 'ASC']], // FIFO: Oldest stock first
    attributes: ['BatchID', 'Quantity', 'TransactionDate', 'TransactionID', 'RemainingQuantity']
  });
  console.log(`Found FIFO stock: ${JSON.stringify(stock)}`);
  return stock;
}

// Function to open new stock (either container or sack) with the previous BatchID
async function openStock(VariationID, quantityPerUnit, unitType, batchID) {
  console.log(`Opening stock for VariationID: ${VariationID}, QuantityPerUnit: ${quantityPerUnit}, UnitType: ${unitType}, BatchID: ${batchID}`);

  const unitTransactionType = unitType === 'Container' ? 'Container' : 'Sack';

  // Open conversion transaction with the existing BatchID
  await StockTransaction.create({
    VariationID,
    TransactionDate: new Date(),
    Quantity: 1,
    UnitType: unitTransactionType,
    TransactionType: 'CONVERSION',
    BatchID: batchID
  });

  // Add stock to the system with the existing BatchID
  await StockTransaction.create({
    VariationID,
    TransactionDate: new Date(),
    Quantity: quantityPerUnit,
    UnitType: unitType === 'Container' ? 'L' : 'KG',
    TransactionType: 'IN',
    BatchID: batchID,
    RemainingQuantity: quantityPerUnit // Set the initial RemainingQuantity
  });

  console.log(`Stock opened with BatchID: ${batchID} for VariationID: ${VariationID}`);
}

// Adjusted route to sell using FIFO logic
// router.post('/sell-quantity', async (req, res) => {
//   const { VariationID, containerQuantity, looseQuantity, unitType } = req.body;

//   const transaction = await sequelize.transaction(); // Begin transaction
//   console.log('Started transaction for selling quantity.');

//   let createdTransactions = []; // This will hold the created transactions
//   let createdContainerTransactions = []


//   try {
//     // Determine unit types
//     const looseUnitType = unitType === 'Container' ? 'L' : 'KG';
//     const containerType = unitType === 'Container' ? 'Container' : 'Sack';

//     const productVariation = await ProductVariation.findByPk(VariationID);
//     if (!productVariation) {
//       console.log(`ProductVariation not found for VariationID: ${VariationID}`);
//       return res.status(404).json({ message: 'ProductVariation not found' });
//     }

//     console.log(`ProductVariation found: ${JSON.stringify(productVariation)}`);

//     const quantityPerContainer = productVariation.UnitsPerPackage;

//     // Fetch available container stock (FIFO order)
//     const containerStock = await getFIFOStock(VariationID, containerType);
//     let totalContainerStock = containerStock.reduce((sum, record) => sum + record.RemainingQuantity, 0);
//     console.log(`Total available container stock: ${totalContainerStock}`);

//     // Selling container logic (FIFO)
//     if (totalContainerStock >= containerQuantity) {
//       let remainingQuantity = containerQuantity;
//       console.log(`Selling ${containerQuantity} containers from FIFO stock.`);

//       for (const stock of containerStock) {
//         if (remainingQuantity === 0) break;

//         if (stock.RemainingQuantity > 0) {
//           const deduction = Math.min(stock.RemainingQuantity, remainingQuantity);
//           stock.RemainingQuantity -= deduction;
//           remainingQuantity -= deduction;

//           await stock.save({ transaction });

//           await StockTransaction.create({
//             VariationID,
//             TransactionDate: new Date(),
//             Quantity: deduction,
//             UnitType: containerType,
//             TransactionType: 'OUT',
//             BatchID: stock.BatchID // Use the BatchID of the current stock being sold
//           }, { transaction });

//           console.log(`Sold ${deduction} containers. Remaining quantity: ${remainingQuantity}`);
//         }
//       }
//     } else {
//       console.log(`Not enough ${containerType.toLowerCase()}s available.`);
//       return res.status(400).json({ message: `Not enough ${containerType.toLowerCase()}s available` });
//     }

//     // Fetch available loose stock (FIFO order)
//     const looseStock = await getFIFOStock(VariationID, looseUnitType);
//     let totalLooseStock = looseStock.reduce((sum, record) => sum + record.RemainingQuantity, 0);
//     console.log(`Total available loose stock: ${totalLooseStock}`);

//     // Selling loose quantity logic (FIFO)
//     if (totalLooseStock >= looseQuantity) {
//       let remainingQuantity = looseQuantity;
//       console.log(`Selling ${looseQuantity} loose quantity from FIFO stock.`);

//       for (const stock of looseStock) {
//         if (remainingQuantity === 0) break;

//         const deduction = Math.min(stock.RemainingQuantity, remainingQuantity);
//         stock.RemainingQuantity -= deduction;
//         remainingQuantity -= deduction;

//         await stock.save({ transaction });

//         const containertransaction = await StockTransaction.create({
//           VariationID,
//           TransactionDate: new Date(),
//           Quantity: deduction,
//           UnitType: looseUnitType,
//           TransactionType: 'OUT',
//           BatchID: stock.BatchID // Use the BatchID of the current stock being sold
//         }, { transaction });

//         console.log("stockTransaction", containertransaction)
//         createdContainerTransactions.push(containertransaction);
//         console.log(`Sold ${deduction} loose quantity. Remaining quantity: ${remainingQuantity}`);
//       }
//     } else {
//       const deficit = looseQuantity - totalLooseStock;
//       const requiredContainers = Math.ceil(deficit / quantityPerContainer);
//       console.log(`Not enough loose stock. Converting ${requiredContainers} containers to loose stock.`);

//       // Check if enough containers are available for conversion
//       if (requiredContainers > totalContainerStock) {
//         console.log(`Not enough ${containerType.toLowerCase()}s to open for loose quantity.`);
//         return res.status(400).json({ message: `Not enough ${containerType.toLowerCase()}s to open for loose quantity` });
//       }

//       // Open required containers to convert into loose stock
//       for (let i = 0; i < requiredContainers; i++) {
//         await openStock(VariationID, quantityPerContainer, looseUnitType, containerStock[i].BatchID); // Pass existing BatchID
//         console.log(`Opened container ${i + 1} for conversion.`);
//       }

//       // Recalculate loose stock after conversion
//       const updatedLooseStock = await getFIFOStock(VariationID, looseUnitType);
//       totalLooseStock = updatedLooseStock.reduce((sum, record) => sum + record.RemainingQuantity, 0);
//       console.log(`Updated total available loose stock after conversion: ${totalLooseStock}`);

//       let remainingQuantity = looseQuantity;
//       for (const stock of updatedLooseStock) {
//         if (remainingQuantity === 0) break;

//         const deduction = Math.min(stock.RemainingQuantity, remainingQuantity);
//         stock.RemainingQuantity -= deduction;
//         remainingQuantity -= deduction;

//         await stock.save({ transaction });

//         const stockTransaction = await StockTransaction.create({
//           VariationID,
//           TransactionDate: new Date(),
//           Quantity: deduction,
//           UnitType: looseUnitType,
//           TransactionType: 'OUT',
//           BatchID: stock.BatchID // Use the BatchID of the current stock being sold
//         }, { transaction });

//         console.log("stockTransaction", stockTransaction)
//         createdTransactions.push(stockTransaction);


//         console.log(`Sold ${deduction} loose quantity after conversion. Remaining quantity: ${remainingQuantity}`);
//       }
//     }

//     // await transaction.commit(); // Commit transaction
//     // console.log('Transaction committed successfully.');
//     // res.status(200).json({result, message: 'Quantity sold and stock updated successfully' });

//     // Commit transaction after all operations are completed
//     if (transaction.finished !== 'commit') {
//       await transaction.commit();
//       console.log('Transaction committed successfully.');
//     }

//     // Commit the transaction after all operations
//     if (transaction.finished !== 'commit') {
//       await transaction.commit();
//       console.log('Transaction committed successfully.');
//     }

//     // Return the transaction information along with created transactions
//     res.status(200).json({
//       message: 'Quantity sold and stock updated successfully',
//       transaction: {
//         id: transaction.id,
//         status: 'committed',
//         committedAt: transaction.committedAt,
//       },
//       stockTransactions: createdContainerTransactions, // Include the created transactions in the response
//       // containerStock: createdContainerTransactions
//     });

//   } catch (error) {
//     await transaction.rollback(); // Rollback transaction on error
//     console.error('Error selling quantity:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// });

router.post('/sell-quantity', async (req, res) => {
  const { VariationID, containerQuantity, looseQuantity, unitType } = req.body;

  const transaction = await sequelize.transaction();
  console.log('Started transaction for selling quantity.');

  let createdContainerTransactions = []; // Initialize properly
  let createdTransactions = [];

  try {
    const looseUnitType = unitType === 'Container' ? 'L' : 'KG';
    const containerType = unitType === 'Container' ? 'Container' : 'Sack';

    const productVariation = await ProductVariation.findByPk(VariationID);
    if (!productVariation) {
      console.log(`ProductVariation not found for VariationID: ${VariationID}`);
      return res.status(404).json({ message: 'ProductVariation not found' });
    }

    console.log(`ProductVariation found: ${JSON.stringify(productVariation)}`);

    const quantityPerContainer = productVariation.UnitsPerPackage;
    const containerStock = await getFIFOStock(VariationID, containerType);
    let totalContainerStock = containerStock.reduce((sum, record) => sum + record.RemainingQuantity, 0);
    console.log(`Total available container stock: ${totalContainerStock}`);

    if (totalContainerStock >= containerQuantity) {
      let remainingQuantity = containerQuantity;
      console.log(`Selling ${containerQuantity} containers from FIFO stock.`);

      for (const stock of containerStock) {
        if (remainingQuantity === 0) break;

        if (stock.RemainingQuantity > 0) {
          const deduction = Math.min(stock.RemainingQuantity, remainingQuantity);
          stock.RemainingQuantity -= deduction;
          remainingQuantity -= deduction;

          await stock.save({ transaction });

          const transactionRecord = await StockTransaction.create({
            VariationID,
            TransactionDate: new Date(),
            Quantity: deduction,
            UnitType: containerType,
            TransactionType: 'OUT',
            BatchID: stock.BatchID
          }, { transaction });

          createdContainerTransactions.push(transactionRecord); // Store container transactions
          console.log(`Sold ${deduction} containers. Remaining quantity: ${remainingQuantity}`);
        }
      }
    } else {
      console.log(`Not enough ${containerType.toLowerCase()}s available.`);
      return res.status(400).json({ message: `Not enough ${containerType.toLowerCase()}s available` });
    }

    const looseStock = await getFIFOStock(VariationID, looseUnitType);
    let totalLooseStock = looseStock.reduce((sum, record) => sum + record.RemainingQuantity, 0);
    console.log(`Total available loose stock: ${totalLooseStock}`);

    if (totalLooseStock >= looseQuantity) {
      let remainingQuantity = looseQuantity;
      console.log(`Selling ${looseQuantity} loose quantity from FIFO stock.`);

      for (const stock of looseStock) {
        if (remainingQuantity === 0) break;

        const deduction = Math.min(stock.RemainingQuantity, remainingQuantity);
        stock.RemainingQuantity -= deduction;
        remainingQuantity -= deduction;

        await stock.save({ transaction });

        const stockTransaction = await StockTransaction.create({
          VariationID,
          TransactionDate: new Date(),
          Quantity: deduction,
          UnitType: looseUnitType,
          TransactionType: 'OUT',
          BatchID: stock.BatchID
        }, { transaction });

        createdTransactions.push(stockTransaction);
        console.log(`Sold ${deduction} loose quantity. Remaining quantity: ${remainingQuantity}`);
      }
    } else {
      const deficit = looseQuantity - totalLooseStock;
      const requiredContainers = Math.ceil(deficit / quantityPerContainer);
      console.log(`Not enough loose stock. Converting ${requiredContainers} containers to loose stock.`);

      if (requiredContainers > totalContainerStock) {
        console.log(`Not enough ${containerType.toLowerCase()}s to open for loose quantity.`);
        return res.status(400).json({ message: `Not enough ${containerType.toLowerCase()}s to open for loose quantity` });
      }

      for (let i = 0; i < requiredContainers; i++) {
        if (!containerStock[i]) break; // Ensure containerStock[i] exists
        await openStock(VariationID, quantityPerContainer, looseUnitType, containerStock[i].BatchID);
        console.log(`Opened container ${i + 1} for conversion.`);
      }

      const updatedLooseStock = await getFIFOStock(VariationID, looseUnitType);
      totalLooseStock = updatedLooseStock.reduce((sum, record) => sum + record.RemainingQuantity, 0);
      console.log(`Updated total available loose stock after conversion: ${totalLooseStock}`);

      let remainingQuantity = looseQuantity;
      for (const stock of updatedLooseStock) {
        if (remainingQuantity === 0) break;

        const deduction = Math.min(stock.RemainingQuantity, remainingQuantity);
        stock.RemainingQuantity -= deduction;
        remainingQuantity -= deduction;

        await stock.save({ transaction });

        const stockTransaction = await StockTransaction.create({
          VariationID,
          TransactionDate: new Date(),
          Quantity: deduction,
          UnitType: looseUnitType,
          TransactionType: 'OUT',
          BatchID: stock.BatchID
        }, { transaction });

        createdTransactions.push(stockTransaction);
        console.log(`Sold ${deduction} loose quantity after conversion. Remaining quantity: ${remainingQuantity}`);
      }
    }

    await transaction.commit();
    console.log('Transaction committed successfully.');

    res.status(200).json({
      message: 'Quantity sold and stock updated successfully',
      transaction: {
        id: transaction.id,
        status: 'committed'
      },
      stockTransactions: createdTransactions,
      containerStockTransactions: createdContainerTransactions
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error selling quantity:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
