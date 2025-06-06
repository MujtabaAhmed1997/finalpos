import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateSupplier } from './validator'; // Adjust the import path as needed

function AddSupplier() {
  const [values, setValues] = useState({
    SupplierName: "",
    ContactName: "",
    Address: "",
    Phone: "",
    Email: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    if (isSubmitting) {
      setErrors(validateSupplier(values));
    }
  }, [values, isSubmitting]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateSupplier(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      axios.post('http://localhost:3001/api/suppliers', values)
        .then(res => {
          navigate('/suppliers'); // Navigate to suppliers page after successful submission
          console.log(res);
        })
        .catch(err => {
          console.error('Error adding supplier:', err);
          // You can handle the error state here if needed
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
            <input
              onChange={handleInput}
              type='text'
              placeholder='Enter supplier name'
              className='form-control rounded-0'
              name='SupplierName'
              value={values.SupplierName}
            />
            {errors.SupplierName && <span className='text-danger'>{errors.SupplierName}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='ContactName'><strong>Contact Name</strong></label>
            <input
              onChange={handleInput}
              type='text'
              placeholder='Enter contact name'
              className='form-control rounded-0'
              name='ContactName'
              value={values.ContactName}
            />
            {errors.ContactName && <span className='text-danger'>{errors.ContactName}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='Address'><strong>Address</strong></label>
            <input
              onChange={handleInput}
              type='text'
              placeholder='Enter address'
              className='form-control rounded-0'
              name='Address'
              value={values.Address}
            />
            {errors.Address && <span className='text-danger'>{errors.Address}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='Phone'><strong>Phone</strong></label>
            <input
              onChange={handleInput}
              type='text'
              placeholder='Enter phone number'
              className='form-control rounded-0'
              name='Phone'
              value={values.Phone}
            />
            {errors.Phone && <span className='text-danger'>{errors.Phone}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='Email'><strong>Email</strong></label>
            <input
              onChange={handleInput}
              type='email'
              placeholder='Enter email'
              className='form-control rounded-0'
              name='Email'
              value={values.Email}
            />
            {errors.Email && <span className='text-danger'>{errors.Email}</span>}
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Supplier'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSupplier;
