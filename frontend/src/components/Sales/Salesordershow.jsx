import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Salesordershow.css';

function SalesOrdershow() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
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
        console.log('Sales Orders API Response:', res.data);
        setData(res.data.salesOrders);
        setTotalPages(res.data.totalPages);
        setTotalRecords(res.data.totalRecords || 0);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleDelete = (SalesOrderID) => {
    if (window.confirm('Are you sure you want to delete this sales order?')) {
      axios.delete(`http://localhost:3001/api/sales-orders/${SalesOrderID}`)
        .then(res => {
          console.log('Sales order deleted successfully');
          fetchSalesOrders(currentPage);
        })
        .catch(err => console.log(err));
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'status-badge status-paid';
      case 'pending':
        return 'status-badge status-pending';
      case 'overdue':
        return 'status-badge status-overdue';
      default:
        return 'status-badge status-pending';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate pagination range
  const getPaginationRange = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Calculate start and end record numbers
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="sales-orders-container">
      <div className="sales-content-wrapper">
        <div className="sales-header">
          <h2>Sales Orders</h2>
          <Link to={'/salesorder/add'} className='add-button'>Add New Order</Link>
        </div>
        
        <div className="sales-table-container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading sales orders...</div>
            </div>
          ) : data.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-text">No sales orders found</div>
              <Link to={'/salesorder/add'} className='add-button'>Create Your First Order</Link>
            </div>
          ) : (
            <>
              <table className='sales-table'>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Order Date</th>
                    <th>Total Amount</th>
                    <th>Amount Paid</th>
                    <th>Remaining</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((order, index) => (
                    <tr key={index}>
                      <td>
                        <strong>#{order.SalesOrderID}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{order.Customer ? order.Customer.CustomerName : 'N/A'}</strong>
                        </div>
                      </td>
                      <td>{formatDate(order.OrderDate)}</td>
                      <td>
                        <strong>{formatCurrency(order.TotalAmount)}</strong>
                      </td>
                      <td>{formatCurrency(order.AmountPaid)}</td>
                      <td>
                        <span style={{ 
                          color: order.RemainingAmount > 0 ? '#ffc107' : '#28a745',
                          fontWeight: '600'
                        }}>
                          {formatCurrency(order.RemainingAmount)}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(order.PaymentStatus)}>
                          {order.PaymentStatus || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link 
                            to={`/salesorderdetaillist/${order.SalesOrderID}`} 
                            className='btn-action btn-read'
                          >
                            View
                          </Link>
                          <Link 
                            to={`/salesorders/update/${order.SalesOrderID}`} 
                            className='btn-action btn-edit'
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDelete(order.SalesOrderID)} 
                            className='btn-action btn-delete'
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {data.length > 0 && (
                <div className='pagination-container'>
                  {/* Page Info */}
                  <div className="pagination-info">
                    Showing {startRecord} to {endRecord} of {totalRecords} entries
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="pagination-controls">
                      {/* Previous Button */}
                      <button
                        className={`page-link page-nav ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        ← Previous
                      </button>
                      
                      {/* Page Numbers */}
                      {getPaginationRange().map((page, index) => (
                        <button
                          key={index}
                          className={`page-link ${page === '...' ? 'dots' : ''} ${currentPage === page ? 'active' : ''}`}
                          onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                          disabled={page === '...'}
                        >
                          {page}
                        </button>
                      ))}
                      
                      {/* Next Button */}
                      <button
                        className={`page-link page-nav ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesOrdershow;
