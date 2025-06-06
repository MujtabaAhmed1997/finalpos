import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SupplierPaymentsList() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const pageSize = 10; // Define the number of records per page

  useEffect(() => {
    fetchSupplierPayments(currentPage);
  }, [currentPage]);

  const fetchSupplierPayments = (page) => {
    setLoading(true);
    axios.get(`http://localhost:3001/api/supplierpayment?page=${page}&pageSize=${pageSize}`)
      .then(res => {
        setData(res.data.supplierPayments);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleDelete = (paymentId) => {
    axios.delete(`http://localhost:3001/api/supplierpayment/${paymentId}`)
      .then(res => {
        console.log('Supplier payment deleted successfully');
        fetchSupplierPayments(currentPage);
      })
      .catch(err => console.log(err));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#1d2634' }}>
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        <h2>Supplier Payments List</h2>
        <div>
          <Link to={'/supplierpayments/add'} className='btn btn-success'>Add +</Link>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <table className='table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Supplier Name</th>
                  <th>Payment Date</th>
                  <th>Purchase Order</th>
                  <th>Payment Amount</th>
                  <th>Payment Method</th>
                  <th>Payment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.SupplierPaymentID}</td>
                    <td>{payment.Supplier ? payment.Supplier.SupplierName : 'N/A'}</td>
                    <td>{new Date(payment.PaymentDate).toLocaleDateString()}</td>
                    <td>{payment.PurchaseOrderID}</td>
                    <td>{payment.PaymentAmount}</td>
                    <td>{payment.PaymentMethod}</td>
                    <td>{payment.PaymentStatus}</td>
                    <td>
                      <Link to={`/supplierpayments/detail/${payment.PaymentID}`} className='btn btn-sm btn-info'>Read</Link>
                      <Link to={`/supplierpayments/update/${payment.PaymentID}`} className='btn btn-sm btn-primary mx-2'>Edit</Link>
                      <button onClick={() => handleDelete(payment.PaymentID)} className='btn btn-sm btn-danger'>Delete</button>
                    </td>
                  </tr>
                ))}
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

export default SupplierPaymentsList;
