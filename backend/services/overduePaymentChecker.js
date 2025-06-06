// // const { Op } = require('sequelize');
// // const Customer = require('../models/customer');
// // const CustomerPayment = require('../models/customerpayment');

// // const checkOverduePayments = async () => {
// //   try {
// //     const fiveDaysAgo = new Date();
// //     fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

// //     // Find customers whose latest payment is older than 5 days or have never made a payment
// //     const overdueCustomers = await Customer.findAll({
// //       include: [{
// //         model: CustomerPayment,
// //         required: false, // This will include customers with no payments
// //         where: {
// //           [Op.or]: [
// //             {
// //               PaymentDate: {
// //                 [Op.lte]: fiveDaysAgo,
// //               },
// //             },
// //             {
// //               CustomerPaymentID: {
// //                 [Op.is]: null, // Customers with no payments
// //               },
// //             },
// //           ],
// //         },
// //       }],
// //     });

// //     // Log the results or take appropriate action
// //     console.log('Overdue Customers:', JSON.stringify(overdueCustomers, null, 2));

// //     // Here you can send notifications or take other actions as needed
// //     return Array.isArray(overdueCustomers) ? overdueCustomers : [];

// //   } catch (error) {
// //     console.error('Error checking overdue payments:', error);
// //   }
// // };

// // module.exports = { checkOverduePayments };



// const { Op } = require('sequelize');
// const Customer = require('../models/customer');
// const CustomerPayment = require('../models/customerpayment');

// const checkOverduePayments = async () => {
//   try {
//     const fiveDaysAgo = new Date();
//     fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

//     // Find customers whose latest payment is older than 5 days
//     const overdueCustomers = await Customer.findAll({
//       include: [{
//         model: CustomerPayment,
//         required: true, // Change to false to include customers with no payments
//         where: {
//           PaymentDate: {
//             [Op.lte]: fiveDaysAgo,
//           },
          
//         },
//       }],
//     });

//     // Log the result for debugging
//     console.log('Overdue customers:', JSON.stringify(overdueCustomers, null, 2));

//     // Ensure the result is an array
//     return Array.isArray(overdueCustomers) ? overdueCustomers : [];
//   } catch (error) {
//     console.error('Error checking overdue payments:', error);
//     return [];
//   }
// };

// module.exports = { checkOverduePayments };

const { Op, fn, col, where, literal } = require('sequelize');
const Customer = require('../models/customer');
const CustomerPayment = require('../models/customerpayment');

const checkOverduePayments = async () => {
  try {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    // Find customers whose latest payment is older than 5 days
    const overdueCustomers = await Customer.findAll({
      include: [{
        model: CustomerPayment,
        required: true,
        where: {
          PaymentDate: {
            [Op.lte]: fiveDaysAgo,
          },
        },
        attributes: [] // Do not fetch CustomerPayment fields
      }],
      where: literal(
        `(SELECT COUNT(*) FROM CustomerPayments WHERE CustomerPayments.CustomerID = Customer.CustomerID AND PaymentDate > '${fiveDaysAgo.toISOString()}') = 0`
      ),
      group: ['Customer.CustomerID'],
      having: where(fn('MAX', col('CustomerPayments.PaymentDate')), { [Op.lte]: fiveDaysAgo })
    });

    // Log the result for debugging
    console.log('Overdue customers:', JSON.stringify(overdueCustomers, null, 2));

    // Ensure the result is an array
    return Array.isArray(overdueCustomers) ? overdueCustomers : [];
  } catch (error) {
    console.error('Error checking overdue payments:', error);
    return [];
  }
};

module.exports = { checkOverduePayments };
