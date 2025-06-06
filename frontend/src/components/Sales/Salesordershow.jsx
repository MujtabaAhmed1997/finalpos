import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function SalesOrdershow() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const pageSize = 10; // Define the number of records per page

  useEffect(() => {
    fetchSalesOrders(currentPage);
  }, [currentPage]);

  const fetchSalesOrders = (page) => {
    setLoading(true);
    axios.get(`http://localhost:3001/api/sales-orders?page=${page}&limit=${pageSize}`)
      .then(res => {
        setData(res.data.salesOrders);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleDelete = (SalesOrderID) => {
    axios.delete(`http://localhost:3001/api/sales-orders/${SalesOrderID}`)
      .then(res => {
        console.log('Sales order deleted successfully');
        fetchSalesOrders(currentPage);
      })
      .catch(err => console.log(err));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div
      className='d-flex vh-100 justify-content-center align-items-center'
      style={{ backgroundColor: '#1d2634' }}
    >
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        <h2>Sales Orders List</h2>
        <div>
          <Link to={'/salesorder/add'} className='btn btn-success'>Add +</Link>
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
                  <th>Order Date</th>
                  <th>Total Amount</th>
                  <th>Amount Paid</th>
                  <th>Remaining Amount</th>
                  <th>Payment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((order, index) => (
                  <tr key={index}>
                    <td>{order.SalesOrderID}</td>
                    <td>{order.Customer ? order.Customer.CustomerName : 'N/A'}</td>
                    <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                    <td>{order.TotalAmount}</td>
                    <td>{order.AmountPaid}</td>
                    <td>{order.RemainingAmount}</td>
                    <td>{order.PaymentStatus}</td>
                    <td>
                      <Link to={`/salesorderdetaillist/${order.SalesOrderID}`} className='btn btn-sm btn-info'>Read</Link>
                      <Link to={`/salesorders/update/${order.SalesOrderID}`} className='btn btn-sm btn-primary mx-2'>Edit</Link>
                      <button onClick={() => handleDelete(order.SalesOrderID)} className='btn btn-sm btn-danger'>Delete</button>
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

export default SalesOrdershow;
