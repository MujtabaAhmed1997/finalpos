// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { validateSalesOrder } from '../../controllers/salesvalidator'; // Adjust the import path as needed

// function SalesOrderForm() {
//   const [values, setValues] = useState({
//     CustomerID: '',
//     OrderDate: '',
//     TotalAmount: 0,
//     AmountPaid: 0,
//     RemainingAmount: 0,
//     PaymentStatus: 'Pending'
//   });

//   const [customers, setCustomers] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log('Fetching customers...');
//     axios.get('http://localhost:3001/api/customers')
//       .then(res => {
//         console.log('Customers fetched:', res.data);
//         setCustomers(res.data);
//       })
//       .catch(err => {
//         console.error('Error fetching customers:', err);
//       });
//   }, []);

//   const handleInput = (event) => {
//     const { name, value } = event.target;

//     // Special handling for OrderDate to format it correctly
//     if (name === 'OrderDate') {
//       const dateObject = new Date(value);
//       const formattedDate = dateObject.toISOString().split('T')[0];
//       setValues(prev => ({
//         ...prev,
//         [name]: formattedDate
//       }));
//     } else {
//       setValues(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   useEffect(() => {
//     if (isSubmitting) {
//       setErrors(validateSalesOrder(values));
//     }
//   }, [values, isSubmitting]);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log('Form submitted with values:', values);
//     const validationErrors = validateSalesOrder(values);
//     console.log('Validation errors:', validationErrors);
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       setIsSubmitting(true);
//       console.log('No validation errors, proceeding with API call...');
//       axios.post('http://localhost:3001/api/sales-orders', values)
//         .then(res => {
//           console.log('Response from API:', res); // Add this line
//           const salesOrderId = res.data.SalesOrderID; // Capture the SalesOrderID from the response
//           navigate(`/salesorderdetail/${salesOrderId}`);
//           console.log('Navigation to sales order detail with ID:', salesOrderId);
//         })
//         .catch(err => {
//           console.error('Error creating sales order:', err);
//         })
//         .finally(() => {
//           setIsSubmitting(false);
//         });
//     }
//   };

//   return (
//     <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
//       <div className='w-50 bg-white rounded p-3'>
//         <h2>Sales Order</h2>
//         <form onSubmit={handleSubmit}>
//           <div className='mb-3'>
//             <label htmlFor='CustomerID'><strong>Customer</strong></label>
//             <select
//               onChange={handleInput}
//               className='form-control rounded-0'
//               name='CustomerID'
//               value={values.CustomerID}
//             >
//               <option value="">Select a Customer</option>
//               {customers.map(customer => (
//                 <option key={customer.CustomerID} value={customer.CustomerID}>
//                   {customer.CustomerName}
//                 </option>
//               ))}
//             </select>
//             {errors.CustomerID && <span className='text-danger'>{errors.CustomerID}</span>}
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='OrderDate'><strong>Order Date</strong></label>
//             <input
//               onChange={handleInput}
//               type='date'
//               className='form-control rounded-0'
//               name='OrderDate'
//               value={values.OrderDate}
//             />
//             {errors.OrderDate && <span className='text-danger'>{errors.OrderDate}</span>}
//           </div>
//           <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
//             {isSubmitting ? 'Adding...' : 'Create Sales Order'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SalesOrderForm;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import { validateSalesOrder } from "../../controllers/salesvalidator"; // Adjust the import path as needed

function SalesOrderForm() {
  const currentDate = new Date().toISOString().split("T")[0];

  const [values, setValues] = useState({
    CustomerID: "",
    OrderDate: currentDate, // Set initial date to current date
    TotalAmount: 0,
    AmountPaid: 0,
    RemainingAmount: 0,
    PaymentStatus: "Pending",
  });

  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    CustomerName: "",
    Address: "",
    Phone: "",
    Email: "",
    AvailableBalance: 0.0,
  });

  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching customers...");
    axios
      .get("http://localhost:3001/api/customers")
      .then((res) => {
        console.log("Customers fetched:", res.data);
        const formattedCustomers = res.data.map((customer) => ({
          value: customer.CustomerID,
          label: customer.CustomerName,
        }));
        setCustomers(formattedCustomers);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
      });
  }, []);

  const handleInput = (event) => {
    const { name, value } = event.target;

    // Special handling for OrderDate to format it correctly
    if (name === "OrderDate") {
      const dateObject = new Date(value);
      const formattedDate = dateObject.toISOString().split("T")[0];
      setValues((prev) => ({
        ...prev,
        [name]: formattedDate,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCustomerChange = (selectedOption) => {
    if (selectedOption.__isNew__) {
      setIsNewCustomer(true);
      setNewCustomer((prev) => ({
        ...prev,
        CustomerName: selectedOption.label,
      }));
    } else {
      setIsNewCustomer(false);
      setValues((prev) => ({
        ...prev,
        CustomerID: selectedOption ? selectedOption.value : "",
      }));
    }
  };

  const handleNewCustomerInput = (event) => {
    const { name, value } = event.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isSubmitting) {
      setErrors(validateSalesOrder(values));
    }
  }, [values, isSubmitting]);

  const handleCreateCustomer = () => {
    setIsCreatingCustomer(true);
    axios
      .post("http://localhost:3001/api/customers", newCustomer)
      .then((res) => {
        const newCustomerData = res.data;
        setCustomers((prev) => [
          ...prev,
          {
            value: newCustomerData.CustomerID,
            label: newCustomerData.CustomerName,
          },
        ]);
        setValues((prev) => ({
          ...prev,
          CustomerID: newCustomerData.CustomerID,
        }));
        setIsNewCustomer(false);
        setIsCreatingCustomer(false);
      })
      .catch((err) => {
        console.error("Error creating new customer:", err);
        setIsCreatingCustomer(false);
      });
  };

  const handleCancelCreateCustomer = () => {
    setIsNewCustomer(false);
    setNewCustomer({
      CustomerName: "",
      Address: "",
      Phone: "",
      Email: "",
      AvailableBalance: 0.0,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted with values:", values);
    const validationErrors = validateSalesOrder(values);
    console.log("Validation errors:", validationErrors);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      console.log("No validation errors, proceeding with API call...");
      createSalesOrder(values.CustomerID);
    }
  };

  const createSalesOrder = (customerId) => {
    const salesOrderData = { ...values, CustomerID: customerId };
    axios
      .post("http://localhost:3001/api/sales-orders", salesOrderData)
      .then((res) => {
        console.log("Response from API:", res);
        const salesOrderId = res.data.SalesOrderID;
        navigate(`/salesorderdetail/${salesOrderId}`);
        console.log("Navigation to sales order detail with ID:", salesOrderId);
      })
      .catch((err) => {
        console.error("Error creating sales order:", err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (customers.length > 0 && !values.CustomerID) {
      // Find the "Walk IN" option and set it as the default
      const walkInOption = customers.find(
        (option) => option.label === "Walk IN"
      );

      if (walkInOption) {
        setValues((prev) => ({
          ...prev,
          CustomerID: walkInOption.value,
        }));
      }
    }
  }, [customers]);
  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ backgroundColor: "#263043" }}
    >
      <div className="w-50 bg-white rounded p-3">
        <h2>Sales Order</h2>
        <form
          onSubmit={handleSubmit}
          onKeyPress={(event) => {
            if (event.key === "Enter") handleSubmit(event);
          }}
        >
          <div className="mb-3">
            <label htmlFor="CustomerID">
              <strong>Customer</strong>
            </label>
            <CreatableSelect
              options={customers}
              onChange={handleCustomerChange}
              className="basic-single"
              classNamePrefix="select"
              isClearable
              isSearchable
              name="CustomerID"
              value={customers.find(
                (option) => option.value === values.CustomerID
              )}
            />
            {errors.CustomerID && (
              <span className="text-danger">{errors.CustomerID}</span>
            )}
          </div>

          {isNewCustomer && (
            <>
              <div className="mb-3">
                <label htmlFor="CustomerName">
                  <strong>Customer Name</strong>
                </label>
                <input
                  type="text"
                  name="CustomerName"
                  className="form-control"
                  value={newCustomer.CustomerName}
                  onChange={handleNewCustomerInput}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Address">
                  <strong>Address</strong>
                </label>
                <input
                  type="text"
                  name="Address"
                  className="form-control"
                  value={newCustomer.Address}
                  onChange={handleNewCustomerInput}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Phone">
                  <strong>Phone</strong>
                </label>
                <input
                  type="text"
                  name="Phone"
                  className="form-control"
                  value={newCustomer.Phone}
                  onChange={handleNewCustomerInput}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="Email">
                  <strong>Email</strong>
                </label>
                <input
                  type="email"
                  name="Email"
                  className="form-control"
                  value={newCustomer.Email}
                  onChange={handleNewCustomerInput}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="AvailableBalance">
                  <strong>Available Balance</strong>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="AvailableBalance"
                  className="form-control"
                  value={newCustomer.AvailableBalance}
                  onChange={handleNewCustomerInput}
                />
              </div>
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-primary mb-3"
                  onClick={handleCreateCustomer}
                  disabled={isCreatingCustomer}
                >
                  {isCreatingCustomer
                    ? "Creating Customer..."
                    : "Create Customer"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mb-3"
                  onClick={handleCancelCreateCustomer}
                  disabled={isCreatingCustomer}
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          <div className="mb-3">
            <label htmlFor="OrderDate">
              <strong>Order Date</strong>
            </label>
            <input
              onChange={handleInput}
              type="date"
              className="form-control rounded-0"
              name="OrderDate"
              value={values.OrderDate}
            />
            {errors.OrderDate && (
              <span className="text-danger">{errors.OrderDate}</span>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 rounded-0"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Create Sales Order"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SalesOrderForm;
