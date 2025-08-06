import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PurchaseOrderList.css';

function PurchaseOrderlist() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const pageSize = 7;

  useEffect(() => {
    fetchPurchaseOrders(currentPage, selectedSupplier, startDate, endDate);
    fetchSuppliers();
  }, [currentPage, selectedSupplier, startDate, endDate]);

  const fetchPurchaseOrders = (page, supplierId, start, end) => {
    setLoading(true);
    let queryParams = `page=${page}&pageSize=${pageSize}`;
    if (supplierId) queryParams += `&supplierId=${supplierId}`;
    if (start) queryParams += `&startDate=${start.toISOString()}`;
    if (end) queryParams += `&endDate=${end.toISOString()}`;
    console.log(queryParams);
    axios.get(`http://localhost:3001/api/purchase-orders?${queryParams}`)
      .then(res => {
        setData(res.data.purchaseOrders);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const fetchSuppliers = () => {
    axios.get('http://localhost:3001/api/suppliers')
      .then(res => {
        setSuppliers(res.data.suppliers || []);
      })
      .catch(err => {
        console.log(err);
        setSuppliers([]);
      });
  };

  const handleDelete = (purchaseOrderId) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      axios.delete(`http://localhost:3001/api/purchase-orders/${purchaseOrderId}`)
        .then(res => {
          console.log('Purchase order deleted successfully');
          fetchPurchaseOrders(currentPage, selectedSupplier, startDate, endDate);
        })
        .catch(err => console.log(err));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSupplierChange = (event) => {
    setSelectedSupplier(event.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const clearFilters = () => {
    setSelectedSupplier('');
    setStartDate(null);
    setEndDate(null);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Paid': 'status-paid',
      'Pending': 'status-pending',
      'Partial': 'status-partial',
      'Overdue': 'status-overdue'
    };
    return <span className={`status-badge ${statusClasses[status] || 'status-default'}`}>{status}</span>;
  };

  return (
    <div className="purchase-order-container">
      <div className="purchase-order-card">
        <div className="purchase-order-header">
          <h2 className="purchase-order-title">
            <i className="fas fa-shopping-cart"></i>
            Purchase Orders
          </h2>
          <Link to={'/purchaseorders/add'} className="add-button">
            <i className="fas fa-plus"></i>
            Add Purchase Order
          </Link>
        </div>

        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-item">
              <label className="filter-label">Supplier</label>
              <select
                className="filter-select"
                value={selectedSupplier}
                onChange={handleSupplierChange}
              >
                <option value=''>All Suppliers</option>
                {Array.isArray(suppliers) && suppliers.map(supplier => (
                  <option key={supplier.SupplierID} value={supplier.SupplierID}>
                    {supplier.SupplierName}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label className="filter-label">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                className="filter-datepicker"
                placeholderText='Select start date'
                dateFormat='MMM dd, yyyy'
              />
            </div>

            <div className="filter-item">
              <label className="filter-label">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                className="filter-datepicker"
                placeholderText='Select end date'
                dateFormat='MMM dd, yyyy'
              />
            </div>

            <div className="filter-actions">
              <button 
                className="apply-filters-btn" 
                onClick={() => fetchPurchaseOrders(1, selectedSupplier, startDate, endDate)}
              >
                <i className="fas fa-filter"></i>
                Apply Filters
              </button>
              <button className="clear-filters-btn" onClick={clearFilters}>
                <i className="fas fa-times"></i>
                Clear
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading purchase orders...</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="purchase-order-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Supplier</th>
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
                    <tr key={index} className="table-row-x">
                      <td className="order-id">#{order.PurchaseOrderID}</td>
                      <td className="supplier-name">
                        {order.Supplier ? order.Supplier.SupplierName : 'N/A'}
                      </td>
                      <td className="order-date">
                        {new Date(order.OrderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="total-amount">
                        ${parseFloat(order.TotalAmount).toFixed(2)}
                      </td>
                      <td className="amount-paid">
                        ${parseFloat(order.AmountPaid).toFixed(2)}
                      </td>
                      <td className="remaining-amount">
                        ${parseFloat(order.RemainingAmount).toFixed(2)}
                      </td>
                      <td className="status-cell">
                        {getStatusBadge(order.PaymentStatus)}
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <Link 
                            to={`/orderdetail/${order.PurchaseOrderID}`} 
                            className="action-btn view-btn"
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                          <Link 
                            to={`/purchaseorders/update/${order.PurchaseOrderID}`} 
                            className="action-btn edit-btn"
                            title="Edit Order"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button 
                            onClick={() => handleDelete(order.PurchaseOrderID)} 
                            className="action-btn delete-btn"
                            title="Delete Order"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.length === 0 && !loading && (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <h3>No Purchase Orders Found</h3>
                <p>No purchase orders match your current filters.</p>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="pagination-buttons">
                  <button
                    className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PurchaseOrderlist;
