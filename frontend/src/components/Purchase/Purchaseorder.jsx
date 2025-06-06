import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validatePurchaseOrder } from '../../controllers/Purchaseordervalidator'; // Adjust the import path as needed

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
        setSuppliers(res.data);
      })
      .catch(err => {
        console.error('Error fetching suppliers:', err);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validatePurchaseOrder(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      axios.post('http://localhost:3001/api/purchase-orders', values)
        .then(res => {
          const purchaseOrderId = res.data.PurchaseOrderID; // Capture the PurchaseOrderID from the response
          navigate(`/purchaseorderdetail/${purchaseOrderId}`);
          console.log(res);
        })
        .catch(err => {
          console.error('Error creating purchase order:', err);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
      <div className='w-50 bg-white rounded p-3'>
        <h2>Purchase Order</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='SupplierID'><strong>Supplier</strong></label>
            <select
              onChange={handleInput}
              className='form-control rounded-0'
              name='SupplierID'
              value={values.SupplierID}
            >
              <option value="">Select a Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.SupplierID} value={supplier.SupplierID}>
                  {supplier.SupplierName}
                </option>
              ))}
            </select>
            {errors.SupplierID && <span className='text-danger'>{errors.SupplierID}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='OrderDate'><strong>Order Date</strong></label>
            <input
              onChange={handleInput}
              type='date'
              className='form-control rounded-0'
              name='OrderDate'
              value={values.OrderDate}
            />
            {errors.OrderDate && <span className='text-danger'>{errors.OrderDate}</span>}
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Create Purchase Order'}
          </button> 
        </form>
      </div>
    </div>
  );
}

export default PurchaseOrderForm;
