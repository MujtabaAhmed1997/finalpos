import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ReturnOrderForm() {
  const currentDate = new Date().toISOString().split('T')[0];

  const [values, setValues] = useState({
    OrderType: '', // Will be 'Customer' or 'Supplier'
    OrderID: '',
    ReturnDate: currentDate,
    TotalAmount: 0,
    Reason: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderOptions, setOrderOptions] = useState([]); // To store customers or suppliers data
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data when the OrderType changes
    if (values.OrderType === 'Customer') {
      axios.get('http://localhost:3001/api/customers')
        .then((res) => {
          setOrderOptions(res.data); // Assuming response is an array of customers
        })
        .catch((err) => {
          console.error('Error fetching customers:', err);
        });
    } else if (values.OrderType === 'Supplier') {
      axios.get('http://localhost:3001/api/suppliers')
        .then((res) => {
          setOrderOptions(res.data); // Assuming response is an array of suppliers
        })
        .catch((err) => {
          console.error('Error fetching suppliers:', err);
        });
    } else {
      setOrderOptions([]); // Clear the options if no type is selected
    }
  }, [values.OrderType]);

  const handleInput = (event) => {
    const { name, value } = event.target;

    if (name === 'ReturnDate') {
      const dateObject = new Date(value);
      const formattedDate = dateObject.toISOString().split('T')[0];
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

  const validateForm = () => {
    const validationErrors = {};

    if (!values.OrderType) {
      validationErrors.OrderType = 'Order type is required.';
    }

    if (!values.OrderID) {
      validationErrors.OrderID = 'Order ID is required.';
    }

    if (!values.ReturnDate) {
      validationErrors.ReturnDate = 'Return date is required.';
    }

    // if (values.TotalAmount <= 0) {
    //   validationErrors.TotalAmount = 'Total amount must be greater than zero.';
    // }

    if (!values.Reason.trim()) {
      validationErrors.Reason = 'Reason is required.';
    }

    return validationErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      createReturnOrder();
    }
  };

  const createReturnOrder = () => {
    console.log('Payload:', values); // Log the payload being sent

    axios
      .post('http://localhost:3001/api/return-orders', values)
      .then((res) => {
        const returnOrderId = res.data.ReturnOrderID;
        navigate(`/addreturndetails/${returnOrderId}`);
    })
      .catch((err) => {
        if (err.response) {
          // Server responded with a status other than 2xx
          console.error('Error res creating return order:', err.response.data);
        } else if (err.request) {
          // Request was made but no response was received
          console.error('Error req creating return order:', err.request);
        } else {
          // Something happened in setting up the request
          console.error('Error creating return order:', err.message);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
      <div className='w-50 bg-white rounded p-3'>
        <h2>Return Order</h2>
        <form onSubmit={handleSubmit}>
          {/* Order Type Dropdown */}
          <div className='mb-3'>
            <label htmlFor='OrderType'><strong>Order Type</strong></label>
            <select
              name='OrderType'
              className='form-control'
              value={values.OrderType}
              onChange={handleInput}
            >
              <option value=''>Select Order Type</option>
              <option value='Customer'>Customer</option>
              <option value='Supplier'>Supplier</option>
            </select>
            {errors.OrderType && <span className='text-danger'>{errors.OrderType}</span>}
          </div>

          {/* Order ID Dropdown */}
          <div className='mb-3'>
            <label htmlFor='OrderID'><strong>Order ID</strong></label>
            <select
              name='OrderID'
              className='form-control'
              value={values.OrderID}
              onChange={handleInput}
              disabled={orderOptions.length === 0}
            >
              <option value=''>Select {values.OrderType} ID</option>
              {orderOptions.map((option) => (
                <option
                  key={values.OrderType === 'Customer' ? option.CustomerID : option.SupplierID}
                  value={values.OrderType === 'Customer' ? option.CustomerID : option.SupplierID}
                >
                  {values.OrderType === 'Customer'
                    ? `${option.CustomerName} (${option.CustomerID})`
                    : `${option.SupplierName} (${option.SupplierID})`}
                </option>
              ))}
            </select>
            {errors.OrderID && <span className='text-danger'>{errors.OrderID}</span>}
          </div>

          <div className='mb-3'>
            <label htmlFor='ReturnDate'><strong>Return Date</strong></label>
            <input
              onChange={handleInput}
              type='date'
              className='form-control'
              name='ReturnDate'
              value={values.ReturnDate}
            />
            {errors.ReturnDate && <span className='text-danger'>{errors.ReturnDate}</span>}
          </div>

          <div className='mb-3'>
            <label htmlFor='TotalAmount'><strong>Total Amount</strong></label>
            <input
              type='number'
              name='TotalAmount'
              className='form-control'
              value={values.TotalAmount}
              onChange={handleInput}
            />
            {errors.TotalAmount && <span className='text-danger'>{errors.TotalAmount}</span>}
          </div>

          <div className='mb-3'>
            <label htmlFor='Reason'><strong>Reason</strong></label>
            <textarea
              name='Reason'
              className='form-control'
              value={values.Reason}
              onChange={handleInput}
            />
            {errors.Reason && <span className='text-danger'>{errors.Reason}</span>}
          </div>

          <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Create Return Order'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReturnOrderForm;
