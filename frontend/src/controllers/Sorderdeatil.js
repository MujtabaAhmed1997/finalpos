export const SalesOrderDetailvalidator = (values) => {
  const errors = {};

  if (!values.SalesOrderID) {
    errors.SalesOrderID = 'Sales Order ID is required';
  }

  if (!values.ProductID) {
    errors.ProductID = 'Product is required';
  }

  if (!values.VariationID) {
    errors.VariationID = 'Variation is required';
  }

  const quantity = Number(values.Quantity) || 0;
  const looseQuantity = Number(values.LooseQuantity) || 0;

  if (quantity <= 0 && looseQuantity <= 0) {
    errors.Quantity = 'Enter container quantity or loose quantity';
  }

  if (quantity < 0) {
    errors.Quantity = 'Quantity cannot be negative';
  }

  if (looseQuantity < 0) {
    errors.LooseQuantity = 'Loose quantity cannot be negative';
  }

  if (quantity > 0 && Number(values.ContainerStock) >= 0 && quantity > Number(values.ContainerStock)) {
    errors.Quantity = 'Not enough container stock available';
  }

  if (looseQuantity > 0 && Number(values.LooseStock) >= 0 && looseQuantity > Number(values.LooseStock)) {
    errors.LooseQuantity = 'Not enough loose stock available';
  }

  const unitPrice = Number(values.UnitPrice);
  if (!unitPrice || unitPrice <= 0) {
    errors.UnitPrice = 'Unit price must be greater than 0';
  }

  const discount = Number(values.Discount) || 0;
  if (discount < 0) {
    errors.Discount = 'Discount cannot be negative';
  }

  if (discount > unitPrice) {
    errors.Discount = 'Discount cannot exceed unit price';
  }

  return errors;
};
