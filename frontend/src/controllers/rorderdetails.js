export const ReturnOrderDetailValidator = (entry) => {
    let errors = {};
  
    if (!entry.ProductID) {
      errors.ProductID = 'Product is required';
    }
  
    if (!entry.Quantity || entry.Quantity > 0) {
      errors.Quantity = 'Quantity must be greater than 0';
    }
  
    if (!entry.Reason) {
      errors.Reason = 'Reason for return is required';
    }
  
    return errors;
  };
  