import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function ReturnOrderShow() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const pageSize = 10; // Define the number of records per page

  useEffect(() => {
    fetchReturnOrders(currentPage);
  }, [currentPage]);

  const fetchReturnOrders = (page) => {
    setLoading(true);
    axios.get(`http://localhost:3001/api/return-orders?page=${page}&limit=${pageSize}`)
      .then(res => {
        setData(res.data.returnOrders);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleDelete = (ReturnOrderID) => {
    axios.delete(`http://localhost:3001/api/return-orders/${ReturnOrderID}`)
      .then(res => {
        console.log('Return order deleted successfully');
        fetchReturnOrders(currentPage);
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
        <h2>Return Orders List</h2>
        <div>
          <Link to={'/addreturn'} className='btn btn-success'>Add +</Link>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <table className='table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Order Type</th>
                  <th>Order ID</th>
                  <th>TotalAmount</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((order, index) => (
                  <tr key={index}>
                    <td>{order.ReturnOrderID}</td>
                    <td>{order.OrderType}</td>
                    <td>{order.OrderID}</td>
                    <td>{order.TotalAmount}</td>
                    <td>{order.Reason}</td>
                    <td>
                      <Link to={`/returnorderdetails/${order.ReturnOrderID}`} className='btn btn-sm btn-info'>Read</Link>
                      <Link to={`/returnorders/update/${order.ReturnOrderID}`} className='btn btn-sm btn-primary mx-2'>Edit</Link>
                      <button onClick={() => handleDelete(order.ReturnOrderID)} className='btn btn-sm btn-danger'>Delete</button>
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

export default ReturnOrderShow;
