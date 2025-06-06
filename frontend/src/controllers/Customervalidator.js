export function validateCustomer(values) {
    let errors = {};
  
    // Validate CustomerName
    if (!values.CustomerName.trim()) {
      errors.CustomerName = 'Customer name is required';
    }
  
    // Validate Address (Optional validation example)
    if (!values.Address.trim()) {
      errors.Address = 'Address is required';
    }
  
    // Validate Phone (Example of regex validation)
    if (!values.Phone.trim()) {
      errors.Phone = 'Phone number is required';
    // } else if (!/^\d{10}$/.test(values.Phone)) {
    //   errors.Phone = 'Phone number must be 10 digits';
    }
  
    // Validate Email (Basic email format validation)
    if (!values.Email.trim()) {
      errors.Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.Email)) {
      errors.Email = 'Email address is invalid';
    }
  
    // Validate AvailableBalance (Optional numeric validation example)
    if (values.AvailableBalance === '' || isNaN(values.AvailableBalance)) {
      errors.AvailableBalance = 'Available balance must be a number';
    }
  
    return errors;
  }
  