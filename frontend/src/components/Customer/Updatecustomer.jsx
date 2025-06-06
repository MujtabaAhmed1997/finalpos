import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    CustomerName: '',
    Address: '',
    Phone: '',
    Email: '',
    AvailableBalance: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:3001/api/customers/${id}`)
      .then(res => setCustomer(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/api/customers/${id}`, customer)
      .then(res => {
        console.log(res);
        navigate('/customers');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center'>
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        <h2>Update Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='CustomerName' className='form-label'>Customer Name</label>
            <input
              type='text'
              className='form-control'
              id='CustomerName'
              name='CustomerName'
              value={customer.CustomerName}
              onChange={handleInputChange}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='Address' className='form-label'>Address</label>
            <input
              type='text'
              className='form-control'
              id='Address'
              name='Address'
              value={customer.Address}
              onChange={handleInputChange}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='Phone' className='form-label'>Phone</label>
            <input
              type='text'
              className='form-control'
              id='Phone'
              name='Phone'
              value={customer.Phone}
              onChange={handleInputChange}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='Email' className='form-label'>Email</label>
            <input
              type='email'
              className='form-control'
              id='Email'
              name='Email'
              value={customer.Email}
              onChange={handleInputChange}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='AvailableBalance' className='form-label'>Available Balance</label>
            <input
              type='number'
              step='0.01'
              className='form-control'
              id='AvailableBalance'
              name='AvailableBalance'
              value={customer.AvailableBalance}
              onChange={handleInputChange}
            />
          </div>
          <button type='submit' className='btn btn-primary'>Update Customer</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCustomer;
