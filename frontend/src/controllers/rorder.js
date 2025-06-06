export const validateReturnOrder = (entry) => {
    let errors = {};
  
    if (!entry.OrderID) {
      errors.OrderID = 'OrderID is required';
    }
  
    // if (!entry.Quantity || entry.Quantity > 0) {
    //   errors.Quantity = 'Quantity must be greater than 0';
    // }
  
    // if (!entry.Reason) {
    //   errors.Reason = 'Reason for return is required';
    // }
  
    return errors;
  };
  