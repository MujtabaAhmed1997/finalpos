import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ReturnOrderShow() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const pageSize = 10; // Define the number of records per page

  useEffect(() => {
    fetchReturnOrders(currentPage);
  }, [currentPage]);

  const fetchReturnOrders = (page) => {
    setLoading(true);
    setError('');
    axios.get(`http://localhost:3001/api/return-orders?page=${page}&limit=${pageSize}`)
      .then(res => {
        setData(res.data.returnOrders);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError('Failed to fetch return orders. Please try again later.');
        setLoading(false);
      });
  };

  const handleDelete = (ReturnOrderID) => {
    if (!window.confirm('Are you sure you want to delete this return order?')) {
      return;
    }

    setLoading(true);
    axios.delete(`http://localhost:3001/api/return-orders/${ReturnOrderID}`)
      .then(res => {
        console.log('Return order deleted successfully');
        setSuccess('Return order deleted successfully!');
        fetchReturnOrders(currentPage);
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch(err => {
        console.log(err);
        setError('Failed to delete return order. Please try again.');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-start px-2 py-4"
      style={{ backgroundColor: "#263043" }}
    >
      <div
        className="rounded-4 shadow-lg p-4 p-md-5 w-100"
        style={{
          maxWidth: 1200,
          width: "100%",
          border: "1px solid #404040",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1" style={{ color: "#263043", fontSize: "1.8rem" }}>
              Return Orders List
            </h3>
            <p className="text-muted mb-0" style={{ fontSize: 15 }}>
              Manage and view all return orders in your system.
            </p>
          </div>
          <Link 
            to={'/addreturn'} 
            className="btn fw-bold"
            style={{
              background: "#263043",
              border: "none",
              fontSize: 16,
              letterSpacing: 0.5,
              boxShadow: "0 4px 12px rgba(38, 48, 67, 0.3)",
              transition: "all 0.3s",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
            onMouseOver={e => {
              e.target.style.background = "#1a2332";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(38, 48, 67, 0.4)";
            }}
            onMouseOut={e => {
              e.target.style.background = "#263043";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(38, 48, 67, 0.3)";
            }}
          >
            Add Return Order +
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert" style={{ borderRadius: "8px" }}>
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success" role="alert" style={{ borderRadius: "8px" }}>
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading return orders...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <Table className="table table-hover" style={{ borderRadius: "8px", overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "#263043", color: "white" }}>
                    <th style={{ padding: "12px 8px", border: "none", fontWeight: "600" }}>ID</th>
                    <th style={{ padding: "12px 8px", border: "none", fontWeight: "600" }}>Order Type</th>
                    <th style={{ padding: "12px 8px", border: "none", fontWeight: "600" }}>Order ID</th>
                    <th style={{ padding: "12px 8px", border: "none", fontWeight: "600" }}>Return Date</th>
                    <th style={{ padding: "12px 8px", border: "none", fontWeight: "600" }}>Total Amount</th>
                    <th style={{ padding: "12px 8px", border: "none", fontWeight: "600" }}>Reason</th>
                    <th style={{ padding: "12px 8px", border: "none", fontWeight: "600" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((order, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #e9ecef" }}>
                        <td style={{ padding: "12px 8px", verticalAlign: "middle" }}>{order.ReturnOrderID}</td>
                        <td style={{ padding: "12px 8px", verticalAlign: "middle" }}>
                          <span 
                            className="badge rounded-pill"
                            style={{
                              background: order.OrderType === 'Customer' ? '#28a745' : '#007bff',
                              color: 'white',
                              padding: '6px 12px',
                              fontSize: '12px'
                            }}
                          >
                            {order.OrderType}
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px", verticalAlign: "middle" }}>{order.OrderID}</td>
                        <td style={{ padding: "12px 8px", verticalAlign: "middle" }}>
                          {new Date(order.ReturnDate).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "12px 8px", verticalAlign: "middle", fontWeight: "500" }}>
                          ${order.TotalAmount}
                        </td>
                        <td style={{ padding: "12px 8px", verticalAlign: "middle" }}>
                          <span style={{ 
                            maxWidth: "200px", 
                            display: "inline-block", 
                            overflow: "hidden", 
                            textOverflow: "ellipsis", 
                            whiteSpace: "nowrap" 
                          }}>
                            {order.Reason}
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px", verticalAlign: "middle" }}>
                          <div className="d-flex gap-2">
                            <Link 
                              to={`/returnorderdetails/${order.ReturnOrderID}`} 
                              className="btn btn-sm"
                              style={{
                                background: "#17a2b8",
                                border: "none",
                                color: "white",
                                fontSize: "12px",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                transition: "all 0.2s"
                              }}
                              onMouseOver={e => {
                                e.target.style.background = "#138496";
                                e.target.style.transform = "translateY(-1px)";
                              }}
                              onMouseOut={e => {
                                e.target.style.background = "#17a2b8";
                                e.target.style.transform = "translateY(0)";
                              }}
                            >
                              View
                            </Link>
                            <Link 
                              to={`/returnorders/update/${order.ReturnOrderID}`} 
                              className="btn btn-sm"
                              style={{
                                background: "#007bff",
                                border: "none",
                                color: "white",
                                fontSize: "12px",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                transition: "all 0.2s"
                              }}
                              onMouseOver={e => {
                                e.target.style.background = "#0056b3";
                                e.target.style.transform = "translateY(-1px)";
                              }}
                              onMouseOut={e => {
                                e.target.style.background = "#007bff";
                                e.target.style.transform = "translateY(0)";
                              }}
                            >
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleDelete(order.ReturnOrderID)} 
                              className="btn btn-sm"
                              style={{
                                background: "#dc3545",
                                border: "none",
                                color: "white",
                                fontSize: "12px",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                transition: "all 0.2s"
                              }}
                              onMouseOver={e => {
                                e.target.style.background = "#c82333";
                                e.target.style.transform = "translateY(-1px)";
                              }}
                              onMouseOut={e => {
                                e.target.style.background = "#dc3545";
                                e.target.style.transform = "translateY(0)";
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        <div>
                          <i className="fas fa-inbox fa-3x mb-3" style={{ color: "#6c757d" }}></i>
                          <p className="mb-0">No return orders found.</p>
                          <small>Start by adding a new return order.</small>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={currentPage === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      style={{
                        margin: "0 2px",
                        border: "1px solid #dee2e6",
                        borderRadius: "4px",
                        transition: "all 0.2s"
                      }}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ReturnOrderShow;
