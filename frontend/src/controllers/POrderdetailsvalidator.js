// validator.js
export const validatePurchaseOrderDetail = (values) => {
    const errors = {};
  
    if (!values.PurchaseOrderID) {
      errors.PurchaseOrderID = 'Purchase Order ID is required';
    }
  
    if (!values.ProductID) {
      errors.ProductID = 'Product ID is required';
    }
  
    if (!values.VariationID) {
      errors.VariationID = 'Variation ID is required';
    }
  
    if (!values.Quantity || values.Quantity <= 0) {
      errors.Quantity = 'Quantity is required and should be greater than 0';
    }
  
    if (!values.UnitPrice || values.UnitPrice <= 0) {
      errors.UnitPrice = 'Unit Price is required and should be greater than 0';
    }
  
    return errors;
  };
  