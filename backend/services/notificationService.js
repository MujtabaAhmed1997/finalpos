// services/notificationService.js

const logOverdueCustomer = (customer) => {
    console.log(`Customer ID: ${customer.CustomerID}, Customer Name: ${customer.CustomerName} has not made a payment in the last 5 days.`);
  };
  
  module.exports = { logOverdueCustomer };
  