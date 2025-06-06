

// // const StockTransaction = require('../models/stockstranscation');
// // const ProductVariation = require('../models/productvariation');

// // // Helper function to get available loose stock
// // async function getLooseStock(variationId, unitType) {
// //   const transactions = await StockTransaction.findAll({
// //     where: {
// //       VariationID: variationId,
// //       UnitType: unitType
// //     }
// //   });

// //   let looseStock = 0;
// //   transactions.forEach(transaction => {
// //     if (transaction.TransactionType === 'IN' || transaction.TransactionType === 'CONVERSION') {
// //       looseStock += transaction.Quantity;
// //     } else if (transaction.TransactionType === 'OUT') {
// //       looseStock -= transaction.Quantity;
// //     }
// //   });
// //   console.log("Loose available stock:", looseStock);
// //   return looseStock;
// // }

// // // Helper function to get available container stock
// // async function getContainerStock(variationId) {
// //   const transactions = await StockTransaction.findAll({
// //     where: {
// //       VariationID: variationId,
// //       UnitType: 'Container' // Assuming 'Container' is the unit type for containers
// //     }
// //   });

// //   let containerStock = 0;
// //   transactions.forEach(transaction => {
// //     if (transaction.TransactionType === 'IN') {
// //       containerStock += transaction.Quantity;
// //     } else if (transaction.TransactionType === 'OUT' || transaction.TransactionType === 'CONVERSION') {
// //       containerStock -= transaction.Quantity;
// //     }
// //   });
// //   console.log("Container available stock:", containerStock);
// //   return containerStock;
// // }

// // // Function to open a new container or sack
// // async function openContainer(variationId, quantityPerContainer, unitType) {
// //   await StockTransaction.create({
// //     VariationID: variationId,
// //     TransactionDate: new Date(),
// //     Quantity: -1, // Removing one container or sack
// //     UnitType: 'Container',
// //     TransactionType: 'CONVERSION'
// //   });

// //   await StockTransaction.create({
// //     VariationID: variationId,
// //     TransactionDate: new Date(),
// //     Quantity: quantityPerContainer, // Adding loose quantity
// //     UnitType: unitType,
// //     TransactionType: 'IN'
// //   });
// // }

// // // Function to handle selling both container and loose quantities
// // // async function sellQuantity(variationId, containerQuantity, looseQuantity, unitType) {
// // //   const availableLooseStock = await getLooseStock(variationId, unitType);
// // //   const containerStock = await getContainerStock(variationId);
// // //   const productVariation = await ProductVariation.findByPk(variationId);

// // //   if (!productVariation) {
// // //     throw new Error('ProductVariation not found');
// // //   }

// // //   const quantityPerContainer = productVariation.UnitsPerPackage; // Units per container or sack

// // //   // Handle container quantity first
// // //   if (containerStock >= containerQuantity) {
// // //     await StockTransaction.create({
// // //       VariationID: variationId,
// // //       TransactionDate: new Date(),
// // //       Quantity: containerQuantity,
// // //       UnitType: 'Container',
// // //       TransactionType: 'OUT'
// // //     });
// // //     console.log('Containers sold from container stock');
// // //   } else {
// // //     throw new Error('Not enough containers available');
// // //   }

// // //   // Handle loose quantity
// // //   if (availableLooseStock >= looseQuantity) {
// // //     await StockTransaction.create({
// // //       VariationID: variationId,
// // //       TransactionDate: new Date(),
// // //       Quantity: looseQuantity,
// // //       UnitType: unitType,
// // //       TransactionType: 'OUT'
// // //     });
// // //     console.log('Loose quantity sold from loose stock');
// // //   } else {
// // //     // Calculate how many additional containers are needed
// // //     const deficit = looseQuantity - availableLooseStock;
// // //     const requiredContainers = Math.ceil(deficit / quantityPerContainer);

// // //     if (requiredContainers > containerStock) {
// // //       throw new Error('Not enough containers available to open for loose quantity');
// // //     }

// // //     // Open the required number of containers
// // //     for (let i = 0; i < requiredContainers; i++) {
// // //       await openContainer(variationId, quantityPerContainer, unitType);
// // //     }

// // //     // After opening containers, the available loose stock is now enough
// // //     const newAvailableLooseStock = availableLooseStock + (requiredContainers * quantityPerContainer);

// // //     // Sell the quantity from the newly updated stock
// // //     await StockTransaction.create({
// // //       VariationID: variationId,
// // //       TransactionDate: new Date(),
// // //       Quantity: looseQuantity,
// // //       UnitType: unitType,
// // //       TransactionType: 'OUT'
// // //     });
// // //     console.log('Loose quantity sold by opening new containers and using loose stock');
// // //   }
// // // }
// // // Function to handle selling both container and loose quantities
// // async function sellQuantity(variationId, containerQuantity, looseQuantity, unitType) {
// //   try {
// //     const availableLooseStock = await getLooseStock(variationId, unitType);
// //     const containerStock = await getContainerStock(variationId);
// //     const productVariation = await ProductVariation.findByPk(variationId);

// //     if (!productVariation) {
// //       throw new Error('ProductVariation not found');
// //     }

// //     const quantityPerContainer = productVariation.UnitsPerPackage; // Units per container or sack

// //     // Handle container quantity first
// //     if (containerStock >= containerQuantity) {
// //       await StockTransaction.create({
// //         VariationID: variationId,
// //         TransactionDate: new Date(),
// //         Quantity: containerQuantity,
// //         UnitType: 'Container',
// //         TransactionType: 'OUT'
// //       });
// //       console.log('Containers sold from container stock');
// //     } else {
// //       throw new Error('Not enough containers available');
// //     }

// //     // Handle loose quantity
// //     if (availableLooseStock >= looseQuantity) {
// //       await StockTransaction.create({
// //         VariationID: variationId,
// //         TransactionDate: new Date(),
// //         Quantity: looseQuantity,
// //         UnitType: unitType,
// //         TransactionType: 'OUT'
// //       });
// //       console.log('Loose quantity sold from loose stock');
// //     } else {
// //       // Calculate how many additional containers are needed
// //       const deficit = looseQuantity - availableLooseStock;
// //       const requiredContainers = Math.ceil(deficit / quantityPerContainer);

// //       if (requiredContainers > containerStock) {
// //         throw new Error('Not enough containers available to open for loose quantity');
// //       }

// //       // Open the required number of containers
// //       for (let i = 0; i < requiredContainers; i++) {
// //         await openContainer(variationId, quantityPerContainer, unitType);
// //       }

// //       // After opening containers, the available loose stock is now enough
// //       const newAvailableLooseStock = availableLooseStock + (requiredContainers * quantityPerContainer);

// //       // Sell the quantity from the newly updated stock
// //       await StockTransaction.create({
// //         VariationID: variationId,
// //         TransactionDate: new Date(),
// //         Quantity: looseQuantity,
// //         UnitType: unitType,
// //         TransactionType: 'OUT'
// //       });
// //       console.log('Loose quantity sold by opening new containers and using loose stock');
// //     }
// //   } catch (error) {
// //     console.error('Error in sellQuantity function:', error);
// //     throw error; // Re-throw the error to be handled by the route
// //   }
// // }

// // module.exports = {
// //   sellQuantity
// // };





// const StockTransaction = require('../models/stockstranscation');
// const ProductVariation = require('../models/productvariation');
// const logger = require('../logger'); // Import the logger

// async function getLooseStock(variationId, unitType) {
//   const transactions = await StockTransaction.findAll({
//     where: {
//       VariationID: variationId,
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
//   logger.info(`Loose available stock: ${looseStock}`);
//   return looseStock;
// }

// async function getContainerStock(variationId) {
//   const transactions = await StockTransaction.findAll({
//     where: {
//       VariationID: variationId,
//       UnitType: 'Container'
//     }
//   });

//   let containerStock = 0;
//   transactions.forEach(transaction => {
//     if (transaction.TransactionType === 'IN') {
//       containerStock += transaction.Quantity;
//     } else if (transaction.TransactionType === 'OUT' || transaction.TransactionType === 'CONVERSION') {
//       containerStock -= transaction.Quantity;
//     }
//   });
//   logger.info(`Container available stock: ${containerStock}`);
//   return containerStock;
// }

// async function openContainer(variationId, quantityPerContainer, unitType) {
//   await StockTransaction.create({
//     VariationID: variationId,
//     TransactionDate: new Date(),
//     Quantity: -1,
//     UnitType: 'Container',
//     TransactionType: 'CONVERSION'
//   });

//   await StockTransaction.create({
//     VariationID: variationId,
//     TransactionDate: new Date(),
//     Quantity: quantityPerContainer,
//     UnitType: unitType,
//     TransactionType: 'IN'
//   });
// }

// const initialLooseStock = await getLooseStock(variationId, unitType);
// const initialContainerStock = await getContainerStock(variationId);
// logger.info(`Initial Loose Stock: ${initialLooseStock}`);
// logger.info(`Initial Container Stock: ${initialContainerStock}`);

// async function sellQuantity(variationId, containerQuantity, looseQuantity, unitType) {
//   try {
//     const productVariation = await ProductVariation.findByPk(variationId);

//     if (!productVariation) {
//       throw new Error('ProductVariation not found');
//     }

//     const quantityPerContainer = productVariation.UnitsPerPackage;

//     if (quantityPerContainer === 1) {
//       const totalContainersToSell = containerQuantity + looseQuantity;
//       logger.info(`totalContainersToSell: ${totalContainersToSell}`);

//       const containerStock = await getContainerStock(variationId);
//       logger.info(`Container Stock: ${containerStock}`);

//       if (containerStock >= totalContainersToSell) {
//         await StockTransaction.create({
//           VariationID: variationId,
//           TransactionDate: new Date(),
//           Quantity: totalContainersToSell,
//           UnitType: 'Container',
//           TransactionType: 'OUT'
//         });
//         logger.info('Containers sold from container stock');
//       } else {
//         throw new Error('Not enough containers available');
//       }
//     } else {
//       const containerStock = await getContainerStock(variationId);
//       logger.info(`Container Stock: ${containerStock}`);

//       if (containerStock >= containerQuantity) {
//         await StockTransaction.create({
//           VariationID: variationId,
//           TransactionDate: new Date(),
//           Quantity: containerQuantity,
//           UnitType: 'Container',
//           TransactionType: 'OUT'
//         });
//         logger.info('Containers sold from container stock');
//       } else {
//         throw new Error('Not enough containers available');
//       }

//       const availableLooseStock = await getLooseStock(variationId, unitType);
//       logger.info(`Available Loose Stock: ${availableLooseStock}`);

//       if (availableLooseStock >= looseQuantity) {
//         await StockTransaction.create({
//           VariationID: variationId,
//           TransactionDate: new Date(),
//           Quantity: looseQuantity,
//           UnitType: unitType,
//           TransactionType: 'OUT'
//         });
//         logger.info('Loose quantity sold from loose stock');
//       } else {
//         const deficit = looseQuantity - availableLooseStock;
//         const requiredContainers = Math.ceil(deficit / quantityPerContainer);
//         logger.info(`Deficit: ${deficit}`);
//         logger.info(`Required Containers: ${requiredContainers}`);

//         if (requiredContainers > containerStock) {
//           throw new Error('Not enough containers available to open for loose quantity');
//         }

//         for (let i = 0; i < requiredContainers; i++) {
//           await openContainer(variationId, quantityPerContainer, unitType);
//         }

//         const newAvailableLooseStock = availableLooseStock + (requiredContainers * quantityPerContainer);
//         logger.info(`New Available Loose Stock: ${newAvailableLooseStock}`);

//         await StockTransaction.create({
//           VariationID: variationId,
//           TransactionDate: new Date(),
//           Quantity: looseQuantity,
//           UnitType: unitType,
//           TransactionType: 'OUT'
//         });
//         logger.info('Loose quantity sold by opening new containers and using loose stock');
//       }
//     }
//   } catch (error) {
//     logger.error('Error in sellQuantity function:', error);
//     throw error;
//   }
// }
