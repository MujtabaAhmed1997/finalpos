

const express = require('express');
const { Op } = require('sequelize');
const { SalesOrder, SalesOrderDetail, SalesBatchAllocation, Batch, Expense } = require('../models/index');

const router = express.Router();

// Profit & Loss API
router.post('/', async (req, res) => {
  try {
    const { startDate, endDate, variationID } = req.body;

    if (!startDate || !endDate || !variationID) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ error: 'Start date, end date, and variationID are required' });
    }

    const startDateTime = `${startDate} 00:00:00`;
    const endDateTime = `${endDate} 23:59:59`;

    console.log(`📅 Fetching data from ${startDateTime} to ${endDateTime} for variationID: ${variationID}`);

    // Get Sales Orders within date range
    const salesOrders = await SalesOrder.findAll({
      where: {
        createdAt: { [Op.between]: [startDateTime, endDateTime] }
      },
      attributes: ['SalesOrderID']
    });

    if (salesOrders.length === 0) {
      console.log("⚠️ No sales orders found for the given date range.");
      return res.json({ message: 'No sales data available for the selected period.', totalRevenue: 0, totalCOGS: 0, totalExpenses: 0, grossProfit: 0, netProfit: 0 });
    }

    const salesOrderIds = salesOrders.map(order => order.SalesOrderID);

    // Get Sales Order Details for the given VariationID
    const salesDetails = await SalesOrderDetail.findAll({
      where: {
        SalesOrderID: { [Op.in]: salesOrderIds },
        VariationID: variationID
      },
      attributes: ['SalesOrderDetailID', 'Quantity', 'LooseQuantity', 'UnitPrice', 'Discount']
    });

    console.log(`📦 Found ${salesDetails.length} sales details for variationID: ${variationID}`);

    if (salesDetails.length === 0) {
      return res.json({ message: 'No sales data found for this variation.', totalRevenue: 0, totalCOGS: 0, totalExpenses: 0, grossProfit: 0, netProfit: 0 });
    }

    const salesOrderDetailIds = salesDetails.map(detail => detail.SalesOrderDetailID);

    // Calculate Total Revenue
    let totalRevenue = salesDetails.reduce((sum, sale) =>
      sum + ((sale.Quantity + sale.LooseQuantity) * sale.UnitPrice) - sale.Discount, 0
    );

    console.log(`💰 Total Revenue: ${totalRevenue}`);

    // Fetch Sales Batch Allocations in bulk
    const salesBatchAllocations = await SalesBatchAllocation.findAll({
      where: {
        SalesOrderDetailID: { [Op.in]: salesOrderDetailIds }
      },
      attributes: ['BatchID', 'Quantity', 'LooseQuantity']
    });

    console.log(`🔄 Found ${salesBatchAllocations.length} batch allocations for COGS calculation`);

    const batchIds = salesBatchAllocations.map(allocation => allocation.BatchID);
    console.log("batchIDs", batchIds)

    // Fetch all batch costs in one query
    const batchCosts = await Batch.findAll({
      where: { BatchID: { [Op.in]: batchIds } },
      attributes: ['BatchID', 'CostPricePerUnit']
    });
    console.log("batch cost", batchCosts)

    const batchCostMap = batchCosts.reduce((map, batch) => {
      map[batch.BatchID] = batch.CostPricePerUnit;
      return map;
    }, {});
    console.log("batchcostmap", batchCostMap)

    let totalCOGS = salesBatchAllocations.reduce((sum, allocation) => {
      const costPerUnit = batchCostMap[allocation.BatchID] || 0;
      console.log("cost per unit", costPerUnit)
      console.log("allocation q", allocation.Quantity)
      console.log("allocation loo", allocation.LooseQuantity)

      return sum + ((allocation.Quantity) * costPerUnit);
    }, 0);

    console.log(`📉 Total COGS: ${totalCOGS}`);

    // Fetch Expenses
    const expenses = await Expense.findAll({
      where: {
        createdAt: { [Op.between]: [startDateTime, endDateTime] }
      },
      attributes: ['Amount']
    });

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.Amount, 0);
    console.log(`💸 Total Expenses: ${totalExpenses}`);

    // Calculate Profits
    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit - totalExpenses;

    console.log(`📊 Gross Profit: ${grossProfit}, Net Profit: ${netProfit}`);

    return res.json({
      variationID,
      totalRevenue,
      totalCOGS,
      totalExpenses,
      grossProfit,
      netProfit
    });

  } catch (error) {
    console.error("❌ Error fetching Profit & Loss data:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
