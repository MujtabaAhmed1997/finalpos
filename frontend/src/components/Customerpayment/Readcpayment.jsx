import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function EachCustomerPaymentsList() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { customerId } = useParams();
  const pageSize = 10; // Define the number of records per page

  useEffect(() => {
    if (customerId) { // Ensure customerId is defined before fetching data
      fetchCustomerPayments(currentPage);
    }
  }, [currentPage, customerId]);

  const fetchCustomerPayments = (page) => {
    setLoading(true);
    axios.get(`http://localhost:3001/api/customerpayments/customer/${customerId}?page=${page}&pageSize=${pageSize}`)
      .then(res => {
        const payments = res.data.customerPayments        ;
        console.log('Fetched payments:', payments); // Log the fetched data
        if (Array.isArray(payments)) { // Check if payments is an array
          setData(payments);
        } else {
          setData([payments]); // Handle the case where a single payment object is returned
        }
        setTotalPages(res.data.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleDelete = (paymentId) => {
    axios.delete(`http://localhost:3001/api/customerpayments/${paymentId}`)
      .then(res => {
        console.log('Customer payment deleted successfully');
        fetchCustomerPayments(currentPage);
      })
      .catch(err => console.log(err));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#1d2634' }}>
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        <h2>Customer Payments List</h2>
        <div>
          <Link to={'/customerpayments/add'} className='btn btn-success'>Add +</Link>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <table className='table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th>Payment Date</th>
                  <th>Sale Order</th>
                  <th>Payment Amount</th>
                  <th>Payment Method</th>
                  <th>Payment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((payment, index) => (
                    payment && (
                      <tr key={index}>
                        <td>{payment.CustomerPaymentID || 'N/A'}</td>
                        <td>{payment.Customer ? payment.Customer.CustomerName : 'N/A'}</td>
                        <td>{new Date(payment.PaymentDate).toLocaleDateString()}</td>
                        <td>{payment.SalesOrderID || 'N/A'}</td>
                        <td>{payment.PaymentAmount || 'N/A'}</td>
                        <td>{payment.PaymentMethod || 'N/A'}</td>
                        <td>{payment.PaymentStatus || 'N/A'}</td>
                        <td>
                          <Link to={`/customerpayments/detail/${payment.CustomerPaymentID}`} className='btn btn-sm btn-info'>Read</Link>
                          <Link to={`/customerpayments/update/${payment.CustomerPaymentID}`} className='btn btn-sm btn-primary mx-2'>Edit</Link>
                          <button onClick={() => handleDelete(payment.CustomerPaymentID)} className='btn btn-sm btn-danger'>Delete</button>
                        </td>
                      </tr>
                    )
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No payments found</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className='pagination'>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`page-link ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EachCustomerPaymentsList;
