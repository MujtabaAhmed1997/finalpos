// const express = require('express');
// const router = express.Router();
// const { sequelize } = require('../models');
// const { Op } = require('sequelize');

// const StockTransaction = require('../models/stockstranscation');
// const ProductVariation = require('../models/productvariation');
// const SalesOrderDetail = require('../models/salesorderdetail');
// const SalesBatchAllocation = require('../models/salesbatchallocationmodel');

// async function getFIFOStock(VariationID, unitType) {
//     return await StockTransaction.findAll({
//         where: {
//             VariationID,
//             UnitType: unitType,
//             TransactionType: 'IN',
//             RemainingQuantity: { [Op.gt]: 0 }
//         },
//         order: [['TransactionDate', 'ASC']],
//         attributes: ['BatchID', 'RemainingQuantity']
//     });
// }

// async function openStock(VariationID, quantityPerUnit, unitType, batchID, transaction) {
//     const conversionType = unitType === 'Container' ? 'L' : 'KG';

//     await StockTransaction.create({
//         VariationID,
//         TransactionDate: new Date(),
//         Quantity: 1,
//         UnitType: unitType,
//         TransactionType: 'CONVERSION',
//         BatchID: batchID
//     }, { transaction });

//     await StockTransaction.create({
//         VariationID,
//         TransactionDate: new Date(),
//         Quantity: quantityPerUnit,
//         UnitType: conversionType,
//         TransactionType: 'IN',
//         BatchID: batchID,
//         RemainingQuantity: quantityPerUnit
//     }, { transaction });
// }

// router.post('/sell-quantity', async (req, res) => {
//     const { SalesOrderID, ProductID, VariationID, containerQuantity, looseQuantity, unitType, UnitPrice, LooseQuantityPrice, Discount } = req.body;
//     const transaction = await sequelize.transaction();

//     try {
//         const looseUnitType = unitType === 'Container' ? 'L' : 'KG';
//         const containerType = unitType === 'Container' ? 'Container' : 'Sack';

//         const productVariation = await ProductVariation.findByPk(VariationID);
//         if (!productVariation) {
//             return res.status(404).json({ message: 'Product Variation not found' });
//         }

//         const quantityPerContainer = productVariation.UnitsPerPackage;

//         let batchAllocations = [];
//         let batchIDs = [];

//         /** -------- HANDLE CONTAINER SALES -------- */
//         const containerStock = await getFIFOStock(VariationID, containerType);
//         let totalContainerStock = containerStock.reduce((sum, record) => sum + record.RemainingQuantity, 0);

//         if (totalContainerStock < containerQuantity) {
//             return res.status(400).json({ message: `Not enough ${containerType} stock.` });
//         }

//         let remainingContainer = containerQuantity;
//         for (const stock of containerStock) {
//             if (remainingContainer === 0) break;

//             let deduction = Math.min(stock.RemainingQuantity, remainingContainer);
//             stock.RemainingQuantity -= deduction;
//             remainingContainer -= deduction;

//             await stock.save({ transaction });

//             await StockTransaction.create({
//                 VariationID,
//                 TransactionDate: new Date(),
//                 Quantity: deduction,
//                 UnitType: containerType,
//                 TransactionType: 'OUT',
//                 BatchID: stock.BatchID
//             }, { transaction });

//             batchIDs.push(stock.BatchID);
//             batchAllocations.push({ BatchID: stock.BatchID, Quantity: deduction, UnitType: containerType });
//         }

//         /** -------- HANDLE LOOSE SALES -------- */
//         let looseStock = await getFIFOStock(VariationID, looseUnitType);
//         let totalLooseStock = looseStock.reduce((sum, record) => sum + record.RemainingQuantity, 0);

//         if (totalLooseStock < looseQuantity) {
//             let deficit = looseQuantity - totalLooseStock;
//             let requiredContainers = Math.ceil(deficit / quantityPerContainer);

//             if (requiredContainers > totalContainerStock) {
//                 return res.status(400).json({ message: `Not enough ${containerType} to convert.` });
//             }

//             for (let i = 0; i < requiredContainers; i++) {
//                 await openStock(VariationID, quantityPerContainer, looseUnitType, containerStock[i].BatchID, transaction);
//             }

//             looseStock = await getFIFOStock(VariationID, looseUnitType);
//             totalLooseStock = looseStock.reduce((sum, record) => sum + record.RemainingQuantity, 0);
//         }

//         let remainingLoose = looseQuantity;
//         for (const stock of looseStock) {
//             if (remainingLoose === 0) break;

//             let deduction = Math.min(stock.RemainingQuantity, remainingLoose);
//             stock.RemainingQuantity -= deduction;
//             remainingLoose -= deduction;

//             await stock.save({ transaction });

//             await StockTransaction.create({
//                 VariationID,
//                 TransactionDate: new Date(),
//                 Quantity: deduction,
//                 UnitType: looseUnitType,
//                 TransactionType: 'OUT',
//                 BatchID: stock.BatchID
//             }, { transaction });

//             batchIDs.push(stock.BatchID);
//             batchAllocations.push({ BatchID: stock.BatchID, Quantity: deduction, UnitType: looseUnitType });
//         }

//         /** -------- RECORD SALES ORDER DETAILS -------- */
//         await SalesOrderDetail.create({
//             SalesOrderID,
//             ProductID,
//             VariationID,
//             BatchID: batchIDs, // Store multiple BatchIDs as "1,2,3"
//             Quantity: containerQuantity,
//             LooseQuantity: looseQuantity,
//             UnitPrice,
//             LooseQuantityPrice,
//             Discount
//         }, { transaction });

//         /** -------- RECORD SALES BATCH ALLOCATION -------- */
//         for (const batch of batchAllocations) {
//             await SalesBatchAllocation.create({
//                 SalesOrderID,
//                 VariationID,
//                 BatchID: batch.BatchID,
//                 Quantity: batch.Quantity,
//                 UnitType: batch.UnitType
//             }, { transaction });
//         }

//         await transaction.commit();
//         res.status(200).json({ message: 'Sales recorded successfully, stock updated' });

//     } catch (error) {
//         await transaction.rollback();
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const { Op } = require('sequelize');

const StockTransaction = require('../models/stockstranscation');
const ProductVariation = require('../models/productvariation');
const SalesOrderDetail = require('../models/salesorderdetail');
const SalesBatchAllocation = require('../models/salesbatchallocationmodel');

async function getFIFOStock(VariationID, unitType) {
    console.log(`Fetching FIFO stock for VariationID: ${VariationID}, UnitType: ${unitType}`);
    return await StockTransaction.findAll({
        where: {
            VariationID,
            UnitType: unitType,
            TransactionType: 'IN',
            RemainingQuantity: { [Op.gt]: 0 }
        },
        order: [['TransactionDate', 'ASC']],
        attributes: ['TransactionID', 'BatchID', 'RemainingQuantity']
    });
}

async function openStock(VariationID, quantityPerUnit, unitType, batchID, transaction) {
    console.log(`Opening stock for VariationID: ${VariationID}, BatchID: ${batchID}, UnitType: ${unitType}`);
    const conversionType = unitType === 'Container' ? 'L' : 'KG';

    await StockTransaction.create({
        VariationID,
        TransactionDate: new Date(),
        Quantity: 1,
        UnitType: unitType,
        TransactionType: 'CONVERSION',
        BatchID: batchID
    }, { transaction });

    await StockTransaction.create({
        VariationID,
        TransactionDate: new Date(),
        Quantity: quantityPerUnit,
        UnitType: conversionType,
        TransactionType: 'IN',
        BatchID: batchID,
        RemainingQuantity: quantityPerUnit
    }, { transaction });
}

router.post('/sell-quantity', async (req, res) => {
    console.log('Received sell-quantity request:', req.body);
    const { SalesOrderID, ProductID, VariationID, containerQuantity, looseQuantity, unitType, UnitPrice, LooseQuantityPrice, Discount } = req.body;
    const transaction = await sequelize.transaction();

    try {
        console.log(`Processing sales for VariationID: ${VariationID}`);
        const looseUnitType = unitType === 'Container' ? 'L' : 'KG';
        const containerType = unitType === 'Container' ? 'Container' : 'Sack';

        const productVariation = await ProductVariation.findByPk(VariationID);
        if (!productVariation) {
            console.error('Product Variation not found');
            return res.status(404).json({ message: 'Product Variation not found' });
        }

        const quantityPerContainer = productVariation.UnitsPerPackage;
        console.log(`Quantity per container: ${quantityPerContainer}`);

        let batchAllocations = [];
        let batchIDs = [];

        /** -------- HANDLE CONTAINER SALES -------- */
        console.log('Fetching container stock...');
        const containerStock = await getFIFOStock(VariationID, containerType);
        let totalContainerStock = containerStock.reduce((sum, record) => sum + record.RemainingQuantity, 0);
        console.log(`Total container stock available: ${totalContainerStock}`);

        if (totalContainerStock < containerQuantity) {
            console.error('Not enough container stock');
            return res.status(400).json({ message: `Not enough ${containerType} stock.` });
        }

        let remainingContainer = containerQuantity;
        for (const stock of containerStock) {
            if (remainingContainer === 0) break;

            let deduction = Math.min(stock.RemainingQuantity, remainingContainer);
            stock.RemainingQuantity -= deduction;
            remainingContainer -= deduction;
            console.log(`Deducting ${deduction} from BatchID: ${stock.BatchID}`);

            await stock.save({ transaction });
            const stocktar = await StockTransaction.create({
                VariationID,
                TransactionDate: new Date(),
                Quantity: deduction,
                UnitType: containerType,
                TransactionType: 'OUT',
                BatchID: stock.BatchID
            }, { transaction });
            console.log("stock tr", stocktar)
            batchIDs.push(stock.BatchID);
            batchAllocations.push({ BatchID: stock.BatchID, Quantity: deduction, UnitType: containerType });
        }

        /** -------- HANDLE LOOSE SALES -------- */
        console.log('Fetching loose stock...');
        let looseStock = await getFIFOStock(VariationID, looseUnitType);
        let totalLooseStock = looseStock.reduce((sum, record) => sum + record.RemainingQuantity, 0);
        console.log(`Total loose stock available: ${totalLooseStock}`);

        if (totalLooseStock < looseQuantity) {
            let deficit = looseQuantity - totalLooseStock;
            let requiredContainers = Math.ceil(deficit / quantityPerContainer);
            console.log(`Deficit: ${deficit}, Required containers: ${requiredContainers}`);

            if (requiredContainers > totalContainerStock) {
                console.error('Not enough containers to convert');
                return res.status(400).json({ message: `Not enough ${containerType} to convert.` });
            }

            for (let i = 0; i < requiredContainers; i++) {
                await openStock(VariationID, quantityPerContainer, looseUnitType, containerStock[i].BatchID, transaction);
            }

            looseStock = await getFIFOStock(VariationID, looseUnitType);
            totalLooseStock = looseStock.reduce((sum, record) => sum + record.RemainingQuantity, 0);
        }

        let remainingLoose = looseQuantity;
        for (const stock of looseStock) {
            if (remainingLoose === 0) break;

            let deduction = Math.min(stock.RemainingQuantity, remainingLoose);
            stock.RemainingQuantity -= deduction;
            remainingLoose -= deduction;
            console.log(`Deducting ${deduction} from loose BatchID: ${stock.BatchID}`);

            await stock.save({ transaction });
            await StockTransaction.create({
                VariationID,
                TransactionDate: new Date(),
                Quantity: deduction,
                UnitType: looseUnitType,
                TransactionType: 'OUT',
                BatchID: stock.BatchID
            }, { transaction });

            batchIDs.push(stock.BatchID);
            batchAllocations.push({ BatchID: stock.BatchID, Quantity: deduction, UnitType: looseUnitType });
        }

        /** -------- RECORD SALES ORDER DETAILS -------- */
        console.log('Recording sales order details...');
        const salesodde = await SalesOrderDetail.create({
            SalesOrderID,
            ProductID,
            VariationID,
            BatchID: batchIDs.join(','),
            Quantity: containerQuantity,
            LooseQuantity: looseQuantity || 0,
            UnitPrice,
            LooseQuantityPrice,
            Discount
        }, { transaction });
        console.log('Recorded sales order details...', salesodde);


        /** -------- RECORD SALES BATCH ALLOCATION -------- */
        for (const batch of batchAllocations) {
            await SalesBatchAllocation.create({
                SalesOrderID,
                SalesOrderDetailID: salesodde.SalesOrderDetailID,  // Add this field

                VariationID,
                ProductID,
                BatchID: batch.BatchID,
                Quantity: batch.Quantity,
                UnitType: batch.UnitType,
                UnitPrice: UnitPrice,  // Check this value

            }, { transaction });
        }

        await transaction.commit();
        console.log('Sales recorded successfully');
        res.status(200).json({ message: 'Sales recorded successfully, stock updated' });

    } catch (error) {
        console.error('Error processing request:', error);
        await transaction.rollback();
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;