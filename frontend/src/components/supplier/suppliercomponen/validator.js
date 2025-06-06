// src/validations/validateSupplier.js

export const validateSupplier = (values) => {
    let errors = {};
  
    if (!values.SupplierName.trim()) {
      errors.SupplierName = "Supplier Name is required";
    }
  
    if (!values.ContactName.trim()) {
      errors.ContactName = "Contact Name is required";
    }
  
    if (!values.Address.trim()) {
      errors.Address = "Address is required";
    }
  
    if (!values.Phone.trim()) {
      errors.Phone = "Phone number is required";
    } else if (!/^[0-9\b]+$/.test(values.Phone)) {
      errors.Phone = "Phone number is invalid";
    }
  
    if (!values.Email.trim()) {
      errors.Email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.Email)) {
      errors.Email = "Email address is invalid";
    }
  
    return errors;
  };
  