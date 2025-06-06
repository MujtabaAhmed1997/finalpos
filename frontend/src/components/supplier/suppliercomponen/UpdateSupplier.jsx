import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState({
    SupplierName: '',
    ContactName: '',
    Address: '',
    Phone: '',
    Email: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:3001/api/suppliers/${id}`)
      .then(res => setSupplier(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplier(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/api/suppliers/${id}`, supplier)
      .then(res => {
        console.log(res);
        navigate('/suppliers');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center'>
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        <h2>Update Supplier</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='SupplierName' className='form-label'>Supplier Name</label>
            <input
              type='text'
              className='form-control'
              id='SupplierName'
              name='SupplierName'
              value={supplier.SupplierName}
              onChange={handleInputChange}
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='ContactName' className='form-label'>Contact Name</label>
            <input
              type='text'
              className='form-control'
              id='ContactName'
              name='ContactName'
              value={supplier.ContactName}
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
              value={supplier.Address}
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
              value={supplier.Phone}
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
              value={supplier.Email}
              onChange={handleInputChange}
            />
          </div>
          <button type='submit' className='btn btn-primary'>Update Supplier</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateSupplier;




