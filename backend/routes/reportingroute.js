const express = require('express');
const router = express.Router();
const { sequelize, SalesOrderDetail, Product, CustomerPayment, ProductVariation } = require('../models');
const { Op } = require('sequelize');

// Helper function to calculate average selling price
const calculateAverageSellingPrice = async (productId, variationId) => {
  const sales = await SalesOrderDetail.findAll({ 
    where: { 
      ProductID: productId,
      VariationID: variationId 
    } 
  });
  const totalRevenue = sales.reduce((acc, sale) => acc + (sale.UnitPrice-sale.Discount) * sale.Quantity, 0);
  const totalQuantity = sales.reduce((acc, sale) => acc + sale.Quantity, 0);
  return Math.floor(totalQuantity ? totalRevenue / totalQuantity : 0);

};

router.get('/', async (req, res) => {
  const { startDate, endDate } = req.query;

  // Validate and parse dates
  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);
  if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  try {
    console.log(`Fetching report from ${parsedStartDate} to ${parsedEndDate}`);

    // Fetch total sales amount and quantity for each product variation
    const sales = await SalesOrderDetail.findAll({
      attributes: [
        'ProductID',
        'VariationID',
        [sequelize.fn('SUM', sequelize.col('Quantity')), 'totalQuantity'],
        [sequelize.fn('SUM', sequelize.literal('Quantity * (UnitPrice-Discount)'  )), 'totalAmount'],
        [sequelize.fn('SUM', sequelize.col('LooseQuantity')), 'totalLooseQuantity'] // Include loose quantity

      ],
      include: [{ model: Product, attributes:['ProductName'] },{ model: ProductVariation, attributes:['SKU'] }],
      where: {
        createdAt: {
          [Op.between]: [parsedStartDate, parsedEndDate]
        }
      },
      group: ['ProductID', 'VariationID']
    });

    console.log('Sales data fetched:', sales);

    // Fetch daily payments made
    const dailyPayments = await CustomerPayment.findAll({
      where: {
        createdAt: {
          [Op.between]: [parsedStartDate, parsedEndDate]
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('PaymentAmount')), 'totalPayments']  // Updated column name
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))]
    });

    console.log('Daily payments fetched:', dailyPayments);

    // Add average selling price to the sales data
    const reportData = await Promise.all(sales.map(async (sale) => {
      const averageSellingPrice = await calculateAverageSellingPrice(sale.ProductID, sale.VariationID);
      return {
        ...sale.dataValues,
        averageSellingPrice
      };
    }));

    res.json({ reportData, dailyPayments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch report data' });
  }
});

module.exports = router;
