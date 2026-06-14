import { Link } from 'react-router-dom';
import React, { useState, useCallback, useEffect } from 'react';
import './Salesordershow.css';
import { useConfirm } from "../../ui/confirm/ConfirmProvider";
import { useToast } from "../../ui/toast/ToastProvider";
import { get, delete_ } from "../../service/apiClient";
import { useInvalidate } from '../../context/DataRefreshContext';
import { useListRefresh } from '../../hooks/useListRefresh';

function SalesOrdershow() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;
  const { confirm } = useConfirm();
  const toast = useToast();
  const invalidate = useInvalidate();

  const fetchSalesOrders = useCallback((page) => {
    setLoading(true);
    get(`/sales-orders?page=${page}&limit=${pageSize}`)
      .then(res => {
        setData(res.data.salesOrders || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalRecords(res.data.totalRecords || 0);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        toast.error("Could not load sales orders.");
        setLoading(false);
      });
  }, [pageSize, toast]);

  useListRefresh('salesOrders', () => fetchSalesOrders(currentPage));

  useEffect(() => {
    fetchSalesOrders(currentPage);
  }, [currentPage, fetchSalesOrders]);

  const handleDelete = async (SalesOrderID) => {
    const ok = await confirm({
      title: "Delete sales order?",
      description: "This will permanently remove the sales order.",
      confirmText: "Delete",
      cancelText: "Cancel",
      tone: "danger",
    });
    if (!ok) return;

    try {
      await delete_(`/sales-orders/${SalesOrderID}`);
      toast.success("Sales order deleted.");
      invalidate('salesOrders');
      fetchSalesOrders(currentPage);
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete sales order. Please try again.");
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
        return 'so-status so-status--paid';
      case 'partial':
        return 'so-status so-status--partial';
      case 'advance':
        return 'so-status so-status--advance';
      case 'overdue':
        return 'so-status so-status--overdue';
      default:
        return 'so-status so-status--pending';
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPaginationRange = () => {
    if (totalPages <= 1) return [1];
    const delta = 2;
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
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return [...new Set(rangeWithDots)];
  };

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="sales-orders-page">
      <div className="sales-orders-page__inner">
        <div className="sales-orders-page__header">
          <div>
            <h2>Sales Orders</h2>
            <p>Manage bills, payments, and receipts</p>
          </div>
          <Link to="/salesorder/add" className="sales-orders-page__add-btn">
            + New Sale
          </Link>
        </div>

        <div className="sales-orders-page__body">
          {loading ? (
            <div className="sales-orders-page__state">
              <div className="sales-orders-page__spinner" />
              <span>Loading sales orders…</span>
            </div>
          ) : data.length === 0 ? (
            <div className="sales-orders-page__state">
              <span className="sales-orders-page__state-icon">📋</span>
              <p>No sales orders found</p>
              <Link to="/salesorder/add" className="sales-orders-page__add-btn">
                Create First Sale
              </Link>
            </div>
          ) : (
            <>
              <div className="sales-orders-table-wrap">
                <table className="sales-orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Paid</th>
                      <th>Remaining</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((order) => (
                      <tr key={order.SalesOrderID}>
                        <td data-label="Order ID">
                          <strong>#{order.SalesOrderID}</strong>
                        </td>
                        <td data-label="Customer">
                          {order.Customer?.CustomerName || 'Walk-in'}
                        </td>
                        <td data-label="Date">{formatDate(order.OrderDate)}</td>
                        <td data-label="Total">
                          <strong>{formatCurrency(order.TotalAmount)}</strong>
                        </td>
                        <td data-label="Paid">{formatCurrency(order.AmountPaid)}</td>
                        <td data-label="Remaining">
                          <span className={order.RemainingAmount > 0 ? 'so-remaining--due' : 'so-remaining--clear'}>
                            {formatCurrency(order.RemainingAmount)}
                          </span>
                        </td>
                        <td data-label="Status">
                          <span className={getStatusBadgeClass(order.PaymentStatus)}>
                            {order.PaymentStatus || 'Pending'}
                          </span>
                        </td>
                        <td data-label="Actions">
                          <div className="so-actions">
                            <Link to={`/salesorder/receipt/${order.SalesOrderID}`} className="so-btn so-btn--view">
                              Receipt
                            </Link>
                            <Link to={`/salesorder/update/${order.SalesOrderID}`} className="so-btn so-btn--pay">
                              Pay
                            </Link>
                            <Link to={`/salesorderdetaillist/${order.SalesOrderID}`} className="so-btn so-btn--items">
                              Items
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(order.SalesOrderID)}
                              className="so-btn so-btn--delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="sales-orders-page__footer">
                <p className="sales-orders-page__info">
                  Showing {startRecord}–{endRecord} of {totalRecords} orders
                </p>
                {totalPages > 1 && (
                  <div className="sales-orders-page__pagination">
                    <button
                      type="button"
                      className="so-page-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Prev
                    </button>
                    {getPaginationRange().map((page, index) => (
                      <button
                        key={`${page}-${index}`}
                        type="button"
                        className={`so-page-btn ${page === currentPage ? 'so-page-btn--active' : ''} ${page === '...' ? 'so-page-btn--dots' : ''}`}
                        onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                        disabled={page === '...'}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="so-page-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesOrdershow;
