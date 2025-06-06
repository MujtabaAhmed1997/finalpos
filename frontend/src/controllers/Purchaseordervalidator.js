export const validatePurchaseOrder = (values) => {
    let errors = {};
  
    if (!values.SupplierID) {
      errors.SupplierID = 'Supplier is required';
    }
  
    if (!values.OrderDate) {
      errors.OrderDate = 'Order date is required';
    }
  
    // if (values.TotalAmount <= 0) {
    //   errors.TotalAmount = 'Total amount must be greater than 0';
    // }
  
    // if (values.AmountPaid < 0) {
    //   errors.AmountPaid = 'Amount paid cannot be negative';
    // }
  
    // if (values.PaymentStatus === '') {
    //   errors.PaymentStatus = 'Payment status is required';
    // }
  
    return errors;
  };
  