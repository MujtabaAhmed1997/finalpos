// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { validateCustomer } from '../../controllers/Customervalidator'; // Adjust the import path as needed

// function AddCustomer() {
//     const [values, setValues] = useState({
//       CustomerName: "",
//       Address: "",
//       Phone: "",
//       Email: "",
//       AvailableBalance: 0.0 // Assuming this field is included for customers
//     });

//     const [errors, setErrors] = useState({});
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const navigate = useNavigate();

//     // Handle input changes in the form fields
//     const handleInput = (event) => {
//       setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
//     };

//     // Effect to validate form fields when values change
//     useEffect(() => {
//       if (isSubmitting) {
//         setErrors(validateCustomer(values)); // Adjust based on your validation function
//       }
//     }, [values, isSubmitting]);

//     // Handle form submission
//     const handleSubmit = (event) => {
//       event.preventDefault();
//       const validationErrors = validateCustomer(values); // Adjust based on your validation function
//       setErrors(validationErrors);

//       if (Object.keys(validationErrors).length === 0) {
//         setIsSubmitting(true);
//         axios.post('http://localhost:3001/api/customers', values)
//           .then(res => {
//             navigate('/customers'); // Navigate to customers page after successful submission
//             console.log(res);
//           })
//           .catch(err => {
//             console.error('Error adding customer:', err);
//             // Handle error state if needed
//           })
//           .finally(() => {
//             setIsSubmitting(false);
//           });
//       }
//     };

//     return (
//       <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
//         <div className='w-50 bg-white rounded p-3'>
//           <form onSubmit={handleSubmit}>
//             <div className='mb-3'>
//               <label htmlFor='CustomerName'><strong>Customer Name</strong></label>
//               <input
//                 onChange={handleInput}
//                 type='text'
//                 placeholder='Enter customer name'
//                 className='form-control rounded-0'
//                 name='CustomerName'
//                 value={values.CustomerName}
//               />
//               {errors.CustomerName && <span className='text-danger'>{errors.CustomerName}</span>}
//             </div>
//             <div className='mb-3'>
//               <label htmlFor='Address'><strong>Address</strong></label>
//               <input
//                 onChange={handleInput}
//                 type='text'
//                 placeholder='Enter address'
//                 className='form-control rounded-0'
//                 name='Address'
//                 value={values.Address}
//               />
//               {errors.Address && <span className='text-danger'>{errors.Address}</span>}
//             </div>
//             <div className='mb-3'>
//               <label htmlFor='Phone'><strong>Phone</strong></label>
//               <input
//                 onChange={handleInput}
//                 type='text'
//                 placeholder='Enter phone number'
//                 className='form-control rounded-0'
//                 name='Phone'
//                 value={values.Phone}
//               />
//               {errors.Phone && <span className='text-danger'>{errors.Phone}</span>}
//             </div>
//             <div className='mb-3'>
//               <label htmlFor='Email'><strong>Email</strong></label>
//               <input
//                 onChange={handleInput}
//                 type='email'
//                 placeholder='Enter email'
//                 className='form-control rounded-0'
//                 name='Email'
//                 value={values.Email}
//               />
//               {errors.Email && <span className='text-danger'>{errors.Email}</span>}
//             </div>
//             <div className='mb-3'>
//               <label htmlFor='AvailableBalance'><strong>Available Balance</strong></label>
//               <input
//                 onChange={handleInput}
//                 type='number'
//                 step='0.01'
//                 placeholder='Enter available balance'
//                 className='form-control rounded-0'
//                 name='AvailableBalance'
//                 value={values.AvailableBalance}
//               />
//               {errors.AvailableBalance && <span className='text-danger'>{errors.AvailableBalance}</span>}
//             </div>
//             <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
//               {isSubmitting ? 'Adding...' : 'Add Customer'}
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   export default AddCustomer;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateCustomer } from "../../controllers/Customervalidator"; // Adjust the path if needed

function AddCustomer() {
  const [values, setValues] = useState({
    CustomerName: "",
    Address: "",
    Phone: "",
    Email: "",
    AvailableBalance: 0.0,
  });

  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    if (isSubmitting) {
      setErrors(validateCustomer(values));
    }
  }, [values, isSubmitting]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateCustomer(values);
    setErrors(validationErrors);
    setBackendError("");

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      axios
        .post("http://localhost:3001/api/customers", values)
        .then((res) => {
          navigate("/customers");
        })
        .catch((err) => {
          console.error("Error adding customer:", err);
          if (err.response && err.response.data) {
            if (typeof err.response.data === "string") {
              setBackendError(err.response.data);
            } else if (err.response.data.message) {
              setBackendError(err.response.data.message);
            } else {
              setBackendError("Something went wrong. Please try again.");
            }
          } else {
            setBackendError("Server is not responding.");
          }
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ backgroundColor: "#263043" }}
    >
      <div className="w-50 bg-white rounded p-3">
        <h3 className="mb-3 text-center">Add New Customer</h3>

        {backendError && (
          <div className="alert alert-danger text-center">{backendError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="CustomerName">
              <strong>Customer Name</strong>
            </label>
            <input
              onChange={handleInput}
              type="text"
              placeholder="Enter customer name"
              className="form-control rounded-0"
              name="CustomerName"
              value={values.CustomerName}
            />
            {errors.CustomerName && (
              <span className="text-danger">{errors.CustomerName}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="Address">
              <strong>Address</strong>
            </label>
            <input
              onChange={handleInput}
              type="text"
              placeholder="Enter address"
              className="form-control rounded-0"
              name="Address"
              value={values.Address}
            />
            {errors.Address && (
              <span className="text-danger">{errors.Address}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="Phone">
              <strong>Phone</strong>
            </label>
            <input
              onChange={handleInput}
              type="text"
              placeholder="Enter phone number"
              className="form-control rounded-0"
              name="Phone"
              value={values.Phone}
            />
            {errors.Phone && (
              <span className="text-danger">{errors.Phone}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="Email">
              <strong>Email</strong>
            </label>
            <input
              onChange={handleInput}
              type="email"
              placeholder="Enter email"
              className="form-control rounded-0"
              name="Email"
              value={values.Email}
            />
            {errors.Email && (
              <span className="text-danger">{errors.Email}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="AvailableBalance">
              <strong>Available Balance</strong>
            </label>
            <input
              onChange={handleInput}
              type="number"
              step="0.01"
              placeholder="Enter available balance"
              className="form-control rounded-0"
              name="AvailableBalance"
              value={values.AvailableBalance}
            />
            {errors.AvailableBalance && (
              <span className="text-danger">{errors.AvailableBalance}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 rounded-0"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Customer"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCustomer;
