import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import { validatePayment } from '../../controllers/spaymentvalidator';

function AddPayment() {
  const [values, setValues] = useState({
    SupplierID: "",
    PaymentDate: "",
    PaymentAmount: "",
    PaymentMethod: "",
    PaymentStatus: ""
  });

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of suppliers
    axios.get('http://localhost:3001/api/suppliers')
      .then(res => {
        const supplierOptions = res.data.map(supplier => ({
          value: supplier.SupplierID,
          label: supplier.SupplierName
        }));
        setSuppliers(supplierOptions);
      })
      .catch(err => {
        console.error('Error fetching suppliers:', err);
      });
  }, []);

  const handleSupplierChange = selectedOption => {
    setSelectedSupplier(selectedOption);
    setValues(prev => ({ ...prev, SupplierID: selectedOption ? selectedOption.value : '' }));
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (isSubmitting) {
      setErrors(validatePayment(values));
    }
  }, [values, isSubmitting]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validatePayment(values);
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
  
      axios.post('http://localhost:3001/api/supplierpayment', values)
        .then(res => {
          const paymentData = res.data;
  
          // Create leisure entry
          const leisureEntry = {
            SupplierID: paymentData.SupplierID,
            TransactionType: 'Payment',
            TransactionID: paymentData.SupplierPaymentID,
            TransactionDate: paymentData.PaymentDate,
            Debit: parseFloat(paymentData.PaymentAmount), // Debit for payment
          };
  
          return axios.post('http://localhost:3001/api/supplierleisure/create', leisureEntry);
        })
        .then(res => {
          console.log('Leisure entry added:', res.data);
          navigate(`/homepage`); // Navigate to homepage after successful submission
        })
        .catch(err => {
          console.error('Error adding payment or leisure entry:', err);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
      <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='SupplierName'><strong>Supplier Name</strong></label>
            <Select
              options={suppliers}
              value={selectedSupplier}
              onChange={handleSupplierChange}
              placeholder='Select Supplier'
              isClearable
              className='form-control rounded-0 p-0'
              classNamePrefix='react-select'
            />
            {errors.SupplierID && <span className='text-danger'>{errors.SupplierID}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='PaymentDate'><strong>Payment Date</strong></label>
            <input
              onChange={handleInput}
              type='date'
              className='form-control rounded-0'
              name='PaymentDate'
              value={values.PaymentDate}
            />
            {errors.PaymentDate && <span className='text-danger'>{errors.PaymentDate}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='PaymentAmount'><strong>Payment Amount</strong></label>
            <input
              onChange={handleInput}
              type='number'
              placeholder='Enter payment amount'
              className='form-control rounded-0'
              name='PaymentAmount'
              value={values.PaymentAmount}
            />
            {errors.PaymentAmount && <span className='text-danger'>{errors.PaymentAmount}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='PaymentMethod'><strong>Payment Method</strong></label>
            <input
              onChange={handleInput}
              type='text'
              placeholder='Enter payment method'
              className='form-control rounded-0'
              name='PaymentMethod'
              value={values.PaymentMethod}
            />
            {errors.PaymentMethod && <span className='text-danger'>{errors.PaymentMethod}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='PaymentStatus'><strong>Payment Status</strong></label>
            <input
              onChange={handleInput}
              type='text'
              placeholder='Enter payment status'
              className='form-control rounded-0'
              name='PaymentStatus'
              value={values.PaymentStatus}
            />
            {errors.PaymentStatus && <span className='text-danger'>{errors.PaymentStatus}</span>}
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPayment;
