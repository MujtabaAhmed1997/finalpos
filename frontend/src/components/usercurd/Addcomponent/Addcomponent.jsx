import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupvalidtion } from '../../../controllers/signupvalidation';
import axios from 'axios';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

function Addcomponent() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigate();

  const onhandleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    // Validate form inputs whenever values change
    setErrors(signupvalidtion(values));
  }, [values]);

  const onhandlesubmit = (event) => {
    event.preventDefault();
    // Check if there are any validation errors
    if (Object.values(errors).every(error => error === '')) {
      // If no errors, submit the form
      axios.post('http://localhost:3001/api/users/signup', values)
        .then(res => {
          navigation('/users');
          console.log(res);
        })
        .catch((err) => {
          setErrors(err);
          console.log("email dp")
        });
    }
  };

  return (
    <div
      className='d-flex vh-100 justify-content-center align-items-center'
      style={{
        backgroundColor: '#263043',
        minHeight: '100vh',
        padding: '1rem'
      }}
    >
      <div
        className='rounded-4 shadow-lg p-5'
        style={{
          minWidth: 400,
          maxWidth: 500,
          width: '100%',
          border: '1px solid #404040',
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className='text-center mb-4'>
          <FaUserPlus size={40} color='#263043' />
          <h3 className='fw-bold mt-2' style={{ color: '#263043' }}>
            Add New User
          </h3>
          <p className='text-muted' style={{ fontSize: 15 }}>
            Create a new user account for your system.
          </p>
        </div>

        <form onSubmit={onhandlesubmit}>
          <div className='mb-3'>
            <label htmlFor='name' className='form-label fw-semibold' style={{ color: '#263043' }}>
              <FaUser className='me-2' />
              Full Name
            </label>
            <input
              onChange={onhandleInput}
              type='text'
              placeholder='Enter user full name'
              className='form-control rounded-3'
              name='name'
              style={{
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                color: '#000000'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#263043';
                e.target.style.boxShadow = '0 0 0 0.2rem rgba(38, 48, 67, 0.25)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#dee2e6';
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            />
            {errors.name && <span className='text-danger small'>{errors.name}</span>}
          </div>

          <div className='mb-3'>
            <label htmlFor='email' className='form-label fw-semibold' style={{ color: '#263043' }}>
              <FaEnvelope className='me-2' />
              Email Address
            </label>
            <input
              onChange={onhandleInput}
              type='email'
              placeholder='Enter user email address'
              className='form-control rounded-3'
              name='email'
              style={{
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                color: '#000000'
              }}
              onFocus={e => {
                e.target.style.borderColor = '#263043';
                e.target.style.boxShadow = '0 0 0 0.2rem rgba(38, 48, 67, 0.25)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#dee2e6';
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            />
            {errors.email && <span className='text-danger small'>{errors.email}</span>}
          </div>

          <div className='mb-4'>
            <label htmlFor='password' className='form-label fw-semibold' style={{ color: '#263043' }}>
              <FaLock className='me-2' />
              Password
            </label>
            <div className='position-relative'>
              <input
                onChange={onhandleInput}
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter user password'
                className='form-control rounded-3'
                name='password'
                style={{
                  background: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  paddingRight: '3rem',
                  color: '#000000'
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#263043';
                  e.target.style.boxShadow = '0 0 0 0.2rem rgba(38, 48, 67, 0.25)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#dee2e6';
                  e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              />
              <button
                type='button'
                className='btn position-absolute'
                style={{
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6c757d'
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className='text-danger small'>{errors.password}</span>}
          </div>

          <button
            type='submit'
            className='btn w-100 rounded-3 fw-bold'
            style={{
              background: '#263043',
              border: 'none',
              fontSize: 18,
              letterSpacing: 1,
              boxShadow: '0 4px 12px rgba(38, 48, 67, 0.3)',
              transition: 'all 0.3s',
              color: 'white',
            }}
            onMouseOver={e => {
              e.target.style.background = '#1a2332';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(38, 48, 67, 0.4)';
            }}
            onMouseOut={e => {
              e.target.style.background = '#263043';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(38, 48, 67, 0.3)';
            }}
          >
            <FaUserPlus className='me-2 mb-1' />
            Add User
          </button>
        </form>
      </div>
    </div>
  )
}

export default Addcomponent
