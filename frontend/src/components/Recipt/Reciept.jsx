import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";
import { FaPrint, FaArrowLeft, FaReceipt, FaCalendarAlt, FaUser, FaClock, FaBox, FaTag, FaHashtag, FaDollarSign, FaListAlt, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import './recipt.css';
import '../Sales/sales.css';
import { get } from "../../service/apiClient";
import OrderPrintButtons from "../Sales/OrderPrintButtons";

const GenericReceipt = ({ orderType }) => {
  console.log("GenericReceipt component rendered with orderType:", orderType);
  
  const [data, setData] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableOverflow, setTableOverflow] = useState(false);
  const [todayPayments, setTodayPayments] = useState(null);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  const { id: OrderID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder(OrderID);
    fetchOrderDetails(OrderID);
  }, [OrderID]);

  useEffect(() => {
    if (data) {
      console.log("Data is available, calling fetchTodayPayments", { data, orderType });
      fetchTodayPayments();
    } else {
      console.log("Data is not available yet", { data, orderType });
    }
  }, [data]);

  useEffect(() => {
    const checkTableOverflow = () => {
      const tableContainer = document.querySelector('.receipt-table-container');
      if (tableContainer) {
        const hasOverflow = tableContainer.scrollWidth > tableContainer.clientWidth;
        setTableOverflow(hasOverflow);
      }
    };

    // Check on mount and window resize
    checkTableOverflow();
    window.addEventListener('resize', checkTableOverflow);
    
    return () => window.removeEventListener('resize', checkTableOverflow);
  }, [detail]); // Re-check when detail data changes

  const fetchOrder = async (id) => {
    try {
      console.log("Fetching order with ID:", id, "orderType:", orderType);
      const res = await get(`/${orderType}-orders/${id}`);
      console.log("Order data fetched:", res.data);
      setData(res.data);
    } catch (err) {
      console.error(`Error fetching ${orderType} order:`, err);
      setError('Failed to load order data');
    }
  };

  const fetchOrderDetails = async (id) => {
    try {
      const res = await get(
        `/${orderType}ordersdetails/${orderType}Order/${id}/details`
      );
      setDetail(res.data);
      console.log("Order details fetched:", res.data);
    } catch (err) {
      console.error(`Error fetching ${orderType} order details:`, err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayPayments = async () => {
    if (!data) return;
    
    console.log("Starting fetchTodayPayments with data:", data);
    setPaymentsLoading(true);
    try {
      let entityId;
      let endpoint;
      
      if (orderType === 'sales') {
        entityId = data.CustomerID;
        endpoint = `/customerpayments/today/${entityId}`;
      } else {
        entityId = data.SupplierID;
        endpoint = `/supplierpayments/today/${entityId}`;
      }

      console.log("Entity ID:", entityId, "Endpoint:", endpoint);

      if (entityId) {
        console.log("Making API call to:", endpoint);
        const res = await get(endpoint);
        console.log("API response received:", res.data);
        setTodayPayments(res.data);
        console.log("Today's payments fetched:", res.data);
        console.log("todayPayments structure:", {
          todayPayments: res.data.todayPayments,
          totalToday: res.data.totalToday,
          paymentCount: res.data.paymentCount
        });
      } else {
        console.log("No entityId found, skipping API call");
      }
    } catch (err) {
      console.error('Error fetching today\'s payments:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      // Don't set error state for payments as it's not critical
    } finally {
      console.log("Setting paymentsLoading to false");
      setPaymentsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNavigate = () => {
    if (orderType === "sales") {
      navigate(`/salesorder/show`);
    } else {
      navigate("/purchaseorder");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getPaymentStatusClass = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'paid':
        return 'paid';
      case 'pending':
        return 'pending';
      case 'partial':
        return 'partial';
      case 'advance':
        return 'advance';
      default:
        return 'pending';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading receipt...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div>
          <div className="error-message">{error}</div>
          <button className="action-button back-button" onClick={handleNavigate}>
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!data || !detail) {
    return (
      <div className="error-container">
        <div>
          <div className="error-message">No data available</div>
          <button className="action-button back-button" onClick={handleNavigate}>
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="receipt-container">
      <div className="receipt-card">
        {/* Header */}
        <div className="receipt-header">
          <FaReceipt size={50} color="#263043" style={{ marginBottom: '1rem' }} />
          <h1 className="receipt-title">
            {orderType === 'sales' ? 'Sales Receipt' : 'Purchase Receipt'}
          </h1>
          <p className="receipt-subtitle">
            Order #{OrderID} • {formatDate(data.OrderDate)}
          </p>
        </div>

        {/* Order Information Grid */}
        <div className="receipt-info-grid">
          <div className="info-item">
            <div className="info-label">
              <FaCalendarAlt className="me-2" />
              Order Date
            </div>
            <div className="info-value">{formatDate(data.OrderDate)}</div>
          </div>
          
          <div className="info-item">
            <div className="info-label">
              <FaUser className="me-2" />
              {orderType === 'sales' ? 'Customer' : 'Supplier'}
            </div>
            <div className="info-value">
              {data.Supplier?.SupplierName || data.Customer?.CustomerName || "Unknown"}
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-label">
              <FaClock className="me-2" />
              Generated At
            </div>
            <div className="info-value">{formatTime()}</div>
          </div>
        </div>

        {/* Items Table */}
        <div className={`receipt-table-container ${tableOverflow ? 'has-overflow' : ''}`}>
          <table className="receipt-table">
            <thead>
              <tr>
                <th><FaBox className="me-2" />Product</th>
                <th><FaTag className="me-2" />Variation</th>
                <th><FaHashtag className="me-2" />Quantity</th>
                <th><FaDollarSign className="me-2" />Unit Price</th>
                {orderType === "sales" && (
                  <>
                    <th><FaListAlt className="me-2" />Loose Qty</th>
                    <th><FaDollarSign className="me-2" />Discount</th>
                  </>
                )}
                <th><FaDollarSign className="me-2" />Total</th>
              </tr>
            </thead>
            <tbody>
              {detail.OrderDetails?.length > 0 ? (
                detail.OrderDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Product?.ProductName || 'N/A'}</td>
                    <td>{item.ProductVariation?.Size || '-'}</td>
                    <td>{item.Quantity}</td>
                    <td>{formatCurrency(item.UnitPrice)}</td>
                    {orderType === "sales" && (
                      <>
                        <td>{item.LooseQuantity || 0}</td>
                        <td>{formatCurrency(item.Discount || 0)}</td>
                      </>
                    )}
                    <td>{formatCurrency(item.total)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={orderType === "sales" ? 7 : 5}
                    className="text-center"
                  >
                    No items available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        {/* <div className="summary-container">
          <div className="summary-card">
            <h3 className="summary-title">
              <FaDollarSign className="me-2" />
              Order Summary
            </h3>
            <table className="summary-table">
              <tbody>
                <tr>
                  <th>Total Amount</th>
                  <td>{formatCurrency(data.TotalAmount)}</td>
                </tr>
                <tr>
                  <th>Amount Paid</th>
                  <td>{formatCurrency(data.AmountPaid)}</td>
                </tr>
                <tr>
                  <th>Remaining Amount</th>
                  <td>{formatCurrency(data.RemainingAmount)}</td>
                </tr>
                <tr>
                  <th>Payment Status</th>
                  <td>
                    <span className={`payment-status ${getPaymentStatusClass(data.PaymentStatus)}`}>
                      {data.PaymentStatus || 'Pending'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> */}

        {/* Today's Payments Section */}
        {todayPayments && (
          <div className="payments-container">
            {(() => {
              console.log("Rendering payments container");
              return null;
            })()}
            <div className="payments-card">
              <h3 className="payments-title">
                <FaMoneyBillWave className="me-2" />
                Today's {orderType === 'sales' ? 'Customer' : 'Supplier'} Payments
              </h3>
              
              {(() => {
                console.log("Rendering payments section:", {
                  todayPayments,
                  todayPaymentsArray: todayPayments?.todayPayments,
                  length: todayPayments?.todayPayments?.length,
                  condition: todayPayments?.todayPayments && todayPayments?.todayPayments?.length > 0
                });
                return null;
              })()}
              
              {paymentsLoading ? (
                <div className="payments-loading">
                  <div className="loading-spinner"></div>
                  <span>Loading payments...</span>
                </div>
              ) : todayPayments.todayPayments && todayPayments.todayPayments.length > 0 ? (
                <div className="payments-content">
                  <div className="payments-summary">
                    <div className="payment-stat">
                      <span className="stat-label">Total Today:</span>
                      <span className="stat-value">{formatCurrency(todayPayments.totalToday)}</span>
                    </div>
                    <div className="payment-stat">
                      <span className="stat-label">Payment Count:</span>
                      <span className="stat-value">{todayPayments.paymentCount}</span>
                    </div>
                  </div>
                  
                  <div className="payments-table-container">
                    <table className="payments-table">
                      <thead>
                        <tr>
                          <th><FaCreditCard className="me-2" />Payment Date</th>
                          <th><FaDollarSign className="me-2" />Amount</th>
                          <th><FaListAlt className="me-2" />Payment Method</th>
                          <th><FaListAlt className="me-2" />Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todayPayments.todayPayments.map((payment, index) => (
                          <tr key={index}>
                            <td>{formatDate(payment.PaymentDate)}</td>
                            <td>{formatCurrency(payment.PaymentAmount)}</td>
                            <td>{payment.PaymentMethod || 'N/A'}</td>
                            <td>{payment.Reference || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="no-payments">
                  {(() => {
                    console.log("Rendering no-payments message");
                    return null;
                  })()}
                  <p style={{ 
                    color: '#7f8c8d', 
                    fontSize: '1.1rem', 
                    fontWeight: '500',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    padding: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>No payments recorded for today</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="receipt-actions no-print">
          {orderType === "sales" && (
            <>
              <button className="action-button print-button" onClick={() => navigate("/salesorder/add")}>
                <FaReceipt />
                New Sale
              </button>
              <OrderPrintButtons orderId={OrderID} className="receipt-print-extra" />
            </>
          )}
          <button className="action-button print-button" onClick={handlePrint}>
            <FaPrint />
            Print Receipt
          </button>
          <button className="action-button back-button" onClick={handleNavigate}>
            <FaArrowLeft />
            {orderType === 'sales' ? 'Sales History' : 'Purchase Orders'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenericReceipt;
