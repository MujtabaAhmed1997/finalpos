// controllers/SalesOrderValidator.js

export function validateSalesOrder(values) {
    const errors = {};
  
    if (!values.CustomerID) {
      errors.CustomerID = 'Customer is required';
    }
  
    if (!values.OrderDate) {
      errors.OrderDate = 'Order Date is required';
    } else if (isNaN(Date.parse(values.OrderDate))) {
      errors.OrderDate = 'Order Date is invalid';
    }
  
    if (values.TotalAmount < 0) {
      errors.TotalAmount = 'Total Amount cannot be negative';
    }
  
    if (values.AmountPaid < 0) {
      errors.AmountPaid = 'Amount Paid cannot be negative';
    }
  
    if (values.RemainingAmount < 0) {
      errors.RemainingAmount = 'Remaining Amount cannot be negative';
    }
  
    if (!values.PaymentStatus) {
      errors.PaymentStatus = 'Payment Status is required';
    } else if (!['Pending', 'Paid', 'Partial'].includes(values.PaymentStatus)) {
      errors.PaymentStatus = 'Payment Status must be one of: Pending, Paid, Partial';
    }
  
    return errors;
  }
  