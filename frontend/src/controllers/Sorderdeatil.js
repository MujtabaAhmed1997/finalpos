export const SalesOrderDetailvalidator = (values) => {
  const errors = {};

  if (!values.SalesOrderID) {
    errors.SalesOrderID = 'Sales Order ID is required';
  }

  if (!values.ProductID) {
    errors.ProductID = 'Product ID is required';
  }

  if (!values.VariationID) {
    errors.VariationID = 'Variation ID is required';
  }

  // if (values.Quantity === undefined || values.Quantity === '') {
  //   errors.Quantity = 'Quantity is required';
  // } else if (values.Quantity <= 0) {
  //   errors.Quantity = 'Quantity should be greater than 0';
  // }

  // if (values.UnitPrice === undefined || values.UnitPrice === '') {
  //   errors.UnitPrice = 'Unit Price is required';
  // } else if (values.UnitPrice <= 0) {
  //   errors.UnitPrice = 'Unit Price should be greater than 0';
  // }

  // // Additional validation for Quantity and LooseQuantity
  // if (values.UnitsPerPackage > 1) {
  //   // if (values.Quantity <= 0 && values.LooseQuantity > 0) {
  //   //   errors.Quantity = 'Quantity must be greater than 0 if Loose Quantity is provided';
  //   // }
  //   if (values.Quantity > 0 && values.LooseQuantity < 0) {
  //     errors.LooseQuantity = 'Loose Quantity cannot be negative';
  //   }
  // }

  // if (values.LooseQuantity === undefined || values.LooseQuantity === '') {
  //   values.LooseQuantity = 0; // Set default value if not provided
  // } else if (values.LooseQuantity < 0) {
  //   errors.LooseQuantity = 'Loose Quantity cannot be negative';
  // }

  // // Ensure that LooseQuantity is not greater than Quantity when Quantity is provided
  // // if (values.Quantity > 0 && values.LooseQuantity > values.Quantity) {
  // //   errors.LooseQuantity = 'Loose Quantity cannot be greater than Quantity';
  // // }

  return errors;
};
