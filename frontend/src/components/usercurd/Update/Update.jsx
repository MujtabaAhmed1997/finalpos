import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUserEdit, FaUser, FaEnvelope, FaUserTag, FaSpinner } from 'react-icons/fa';

function Update() {
  const { id } = useParams();
  const [values, setValues] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const onhandleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onhandlesubmit = (event) => {
    event.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!values.name.trim()) newErrors.name = 'Name is required';
    if (!values.email.trim()) newErrors.email = 'Email is required';
    if (!values.role.trim()) newErrors.role = 'Role is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    axios.put(`http://localhost:3001/api/usercurd/update/${id}`, values)
      .then(res => {
        navigate('/users');
        console.log(res);
      })
      .catch(err => {
        console.log(err);
        setErrors({ apiError: 'Failed to update user. Please try again.' });
      });
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/api/usercurd/read/${id}`)
      .then(res => {
        console.log(res);
        setValues(v => ({
          ...v,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role
        }));
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setErrors({ apiError: 'Failed to load user data.' });
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div
        className='d-flex vh-100 justify-content-center align-items-center'
        style={{ backgroundColor: '#263043' }}
      >
        <div className='text-center text-white'>
          <FaSpinner className='fa-spin' size={40} />
          <p className='mt-3'>Loading user data...</p>
        </div>
      </div>
    );
  }

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
          <FaUserEdit size={40} color='#263043' />
          <h3 className='fw-bold mt-2' style={{ color: '#263043' }}>
            Edit User
          </h3>
          <p className='text-muted' style={{ fontSize: 15 }}>
            Update user information and permissions.
          </p>
        </div>

        <form onSubmit={onhandlesubmit}>
          {errors.apiError && (
            <div className='alert alert-danger' role='alert'>
              {errors.apiError}
            </div>
          )}

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
              value={values.name}
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
              value={values.email}
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
            <label htmlFor='role' className='form-label fw-semibold' style={{ color: '#263043' }}>
              <FaUserTag className='me-2' />
              Role
            </label>
            <select
              onChange={onhandleInput}
              className='form-control rounded-3'
              name='role'
              value={values.role}
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
            >
              <option value=''>Select a role</option>
              <option value='admin'>Admin</option>
              <option value='manager'>Manager</option>
              <option value='salesman'>Salesman</option>
              <option value='cashier'>Cashier</option>
              <option value='user'>User</option>
            </select>
            {errors.role && <span className='text-danger small'>{errors.role}</span>}
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
            <FaUserEdit className='me-2 mb-1' />
            Update User
          </button>
        </form>
      </div>
    </div>
  );
}

export default Update;
