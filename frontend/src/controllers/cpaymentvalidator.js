export const validatePayment = (values) => {
  let errors = {};

  if (!values.CustomerID) {
    errors.CustomerID = "Customer ID is required";
  }

  if (!values.PaymentDate) {
    errors.PaymentDate = "Payment Date is required";
  }
  if (!values.PaymentAmount) {
    errors.PaymentAmount = "Payment Amount is required";
  }
  if (!values.PaymentMethod) {
    errors.PaymentMethod = "Payment Method is required";
  }
  if (!values.PaymentStatus) {
    errors.PaymentStatus = "Payment Status is required";
  }

  return errors;
};
