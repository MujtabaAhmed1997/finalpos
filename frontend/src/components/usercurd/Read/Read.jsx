import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaUserTag, FaCalendar, FaArrowLeft, FaEdit, FaSpinner } from 'react-icons/fa';

function Read() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/usercurd/read/${id}`)
      .then(res => {
        console.log(res);
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div
        className='d-flex vh-100 justify-content-center align-items-center'
        style={{ backgroundColor: '#263043' }}
      >
        <div className='text-center text-white'>
          <FaSpinner className='fa-spin' size={40} />
          <p className='mt-3'>Loading user details...</p>
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
          minWidth: 600,
          maxWidth: 800,
          width: '100%',
          border: '1px solid #404040',
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className='text-center mb-4'>
          <FaUser size={40} color='#263043' />
          <h3 className='fw-bold mt-2' style={{ color: '#263043' }}>
            User Details
          </h3>
          <p className='text-muted' style={{ fontSize: 15 }}>
            View detailed information about the user.
          </p>
        </div>

        {products.length > 0 ? (
          <div>
            <div className='mb-4'>
              <h4 className='fw-bold' style={{ color: '#263043' }}>
                {products[0].name}
              </h4>
            </div>

            <div className='table-responsive'>
              <table className='table table-hover'>
                <thead>
                  <tr style={{ backgroundColor: '#263043', color: 'white' }}>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td>
                        <span className='badge bg-secondary rounded-pill'>#{product.id}</span>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <FaUser className='me-2' color='#263043' />
                          {product.name}
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <FaEnvelope className='me-2' color='#263043' />
                          {product.email}
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <FaUserTag className='me-2' color='#263043' />
                          <span className={`badge rounded-pill ${
                            product.role === 'admin' ? 'bg-danger' :
                            product.role === 'manager' ? 'bg-warning' :
                            product.role === 'salesman' ? 'bg-success' :
                            product.role === 'cashier' ? 'bg-info' : 'bg-secondary'
                          }`}>
                            {product.role}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          <FaCalendar className='me-2' color='#263043' />
                          {formatDate(product.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div className='d-flex gap-2'>
                          <Link
                            to={'/users'}
                            className='btn btn-sm'
                            style={{
                              background: '#6c757d',
                              color: 'white',
                              border: 'none',
                              borderRadius: '20px',
                              padding: '0.5rem 1rem'
                            }}
                          >
                            <FaArrowLeft className='me-1' />
                            Back
                          </Link>
                          <Link
                            to={`/users/update/${product.id}`}
                            className='btn btn-sm'
                            style={{
                              background: '#263043',
                              color: 'white',
                              border: 'none',
                              borderRadius: '20px',
                              padding: '0.5rem 1rem'
                            }}
                          >
                            <FaEdit className='me-1' />
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className='text-center'>
            <FaUser size={60} color='#6c757d' />
            <h5 className='mt-3' style={{ color: '#6c757d' }}>No user found</h5>
            <p className='text-muted'>The requested user could not be found.</p>
            <Link
              to={'/users'}
              className='btn'
              style={{
                background: '#263043',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '0.75rem 1.5rem'
              }}
            >
              <FaArrowLeft className='me-2' />
              Back to Users
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Read;
