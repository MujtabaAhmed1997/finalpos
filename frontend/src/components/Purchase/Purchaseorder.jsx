import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validatePurchaseOrder } from '../../controllers/Purchaseordervalidator';
import { FaShoppingCart, FaCalendarAlt, FaBuilding } from 'react-icons/fa';
import './PurchaseOrderForm.css';

function PurchaseOrderForm() {
  const [values, setValues] = useState({
    SupplierID: '',
    OrderDate: new Date().toISOString().split('T')[0],
    TotalAmount: 0,
    AmountPaid: 0,
    RemainingAmount: 0,
    PaymentStatus: 'Pending'
  });

  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/suppliers')
      .then(res => {
        setSuppliers(res.data.suppliers || []);
      })
      .catch(err => {
        console.error('Error fetching suppliers:', err);
        setSuppliers([]);
      });
  }, []);

  const handleInput = (event) => {
    const { name, value } = event.target;

    // Special handling for OrderDate to format it correctly
    if (name === 'OrderDate') {
      const dateObject = new Date(value);
      const formattedDate = dateObject.toISOString().split('T')[0];
      setValues(prev => ({
        ...prev,
        [name]: formattedDate
      }));
    } else {
      setValues(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  useEffect(() => {
    if (isSubmitting) {
      setErrors(validatePurchaseOrder(values));
    }
  }, [values, isSubmitting]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({}); // Clear previous errors
    
    const validationErrors = validatePurchaseOrder(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const res = await axios.post('http://localhost:3001/api/purchase-orders', values);
        const purchaseOrderId = res.data.PurchaseOrderID;
        navigate(`/purchaseorderdetail/${purchaseOrderId}`);
        console.log(res);
      } catch (err) {
        console.error('Error creating purchase order:', err);
        if (err.response && err.response.data && err.response.data.message) {
          setErrors({ apiError: err.response.data.message });
        } else {
          setErrors({ apiError: "An unexpected error occurred. Please try again." });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="purchase-order-form-container">
      <div className="purchase-order-form-card">
        <div className="form-header">
          <FaShoppingCart className="header-icon" />
          <h3 className="form-title">Create Purchase Order</h3>
          <p className="form-subtitle">
            Create a new purchase order for your inventory management.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="purchase-order-form">
          {errors.apiError && (
            <div className="alert alert-danger" role="alert">
              {errors.apiError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="SupplierID" className="form-label">
              <FaBuilding className="label-icon" />
              Supplier
            </label>
            <select
              onChange={handleInput}
              className="form-control"
              name="SupplierID"
              value={values.SupplierID}
            >
              <option value="">Select a Supplier</option>
              {Array.isArray(suppliers) && suppliers.map(supplier => (
                <option key={supplier.SupplierID} value={supplier.SupplierID}>
                  {supplier.SupplierName}
                </option>
              ))}
            </select>
            {errors.SupplierID && (
              <span className="error-message">{errors.SupplierID}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="OrderDate" className="form-label">
              <FaCalendarAlt className="label-icon" />
              Order Date
            </label>
            <input
              onChange={handleInput}
              type="date"
              className="form-control"
              name="OrderDate"
              value={values.OrderDate}
            />
            {errors.OrderDate && (
              <span className="error-message">{errors.OrderDate}</span>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            <FaShoppingCart className="button-icon" />
            {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PurchaseOrderForm;
