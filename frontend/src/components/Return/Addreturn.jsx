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
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center px-2"
      style={{ backgroundColor: "#263043" }}
    >
      <div
        className="rounded-4 shadow-lg p-4 p-md-5 w-100"
        style={{
          maxWidth: 500,
          width: "100%",
          border: "1px solid #404040",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="text-center mb-4">
          <h3 className="fw-bold mt-2" style={{ color: "#263043", fontSize: "1.5rem" }}>
            Create Return Order
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: 15 }}>
            Add a new return order to your system.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Order Type Dropdown */}
          <div className="mb-3">
            <label htmlFor="OrderType" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Order Type
            </label>
            <select
              name="OrderType"
              className="form-select rounded-3"
              value={values.OrderType}
              onChange={handleInput}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: "1rem",
              }}
              onFocus={e => {
                e.target.style.borderColor = "#263043";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#dee2e6";
                e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              <option value="">Select Order Type</option>
              <option value="Customer">Customer</option>
              <option value="Supplier">Supplier</option>
            </select>
            {errors.OrderType && <span className="text-danger small">{errors.OrderType}</span>}
          </div>

          {/* Order ID Dropdown */}
          <div className="mb-3">
            <label htmlFor="OrderID" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Order ID
            </label>
            <select
              name="OrderID"
              className="form-select rounded-3"
              value={values.OrderID}
              onChange={handleInput}
              disabled={orderOptions.length === 0}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: "1rem",
              }}
              onFocus={e => {
                e.target.style.borderColor = "#263043";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#dee2e6";
                e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            >
              <option value="">Select {values.OrderType} ID</option>
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
            {errors.OrderID && <span className="text-danger small">{errors.OrderID}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="ReturnDate" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Return Date
            </label>
            <input
              onChange={handleInput}
              type="date"
              className="form-control rounded-3"
              name="ReturnDate"
              value={values.ReturnDate}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: "1rem",
              }}
              onFocus={e => {
                e.target.style.borderColor = "#263043";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#dee2e6";
                e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            />
            {errors.ReturnDate && <span className="text-danger small">{errors.ReturnDate}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="TotalAmount" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Total Amount
            </label>
            <input
              type="number"
              name="TotalAmount"
              className="form-control rounded-3"
              value={values.TotalAmount}
              onChange={handleInput}
              placeholder="Enter total amount"
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: "1rem",
              }}
              onFocus={e => {
                e.target.style.borderColor = "#263043";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#dee2e6";
                e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            />
            {errors.TotalAmount && <span className="text-danger small">{errors.TotalAmount}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="Reason" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Reason
            </label>
            <textarea
              name="Reason"
              className="form-control rounded-3"
              value={values.Reason}
              onChange={handleInput}
              placeholder="Enter return reason"
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: "1rem",
                minHeight: 80,
              }}
              onFocus={e => {
                e.target.style.borderColor = "#263043";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#dee2e6";
                e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            />
            {errors.Reason && <span className="text-danger small">{errors.Reason}</span>}
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-3 fw-bold"
            disabled={isSubmitting}
            style={{
              background: "#263043",
              border: "none",
              fontSize: 18,
              letterSpacing: 1,
              boxShadow: "0 4px 12px rgba(38, 48, 67, 0.3)",
              transition: "all 0.3s",
              color: "white",
            }}
            onMouseOver={e => {
              if (!isSubmitting) {
                e.target.style.background = "#1a2332";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(38, 48, 67, 0.4)";
              }
            }}
            onMouseOut={e => {
              if (!isSubmitting) {
                e.target.style.background = "#263043";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(38, 48, 67, 0.3)";
              }
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create Return Order'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReturnOrderForm;
