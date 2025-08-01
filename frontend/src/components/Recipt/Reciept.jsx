import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPrint, FaArrowLeft, FaReceipt, FaCalendarAlt, FaUser, FaClock, FaBox, FaTag, FaHashtag, FaDollarSign, FaListAlt } from 'react-icons/fa';
import './recipt.css';

const GenericReceipt = ({ orderType }) => {
  const [data, setData] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableOverflow, setTableOverflow] = useState(false);

  const { id: OrderID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder(OrderID);
    fetchOrderDetails(OrderID);
  }, [OrderID]);

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
      const res = await axios.get(
        `http://localhost:3001/api/${orderType}-orders/${id}`
      );
      setData(res.data);
    } catch (err) {
      console.error(`Error fetching ${orderType} order:`, err);
      setError('Failed to load order data');
    }
  };

  const fetchOrderDetails = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/${orderType}ordersdetails/${orderType}Order/${id}/details`
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
        <div className="summary-container">
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
        </div>

        {/* Actions */}
        <div className="receipt-actions">
          <button className="action-button print-button" onClick={handlePrint}>
            <FaPrint />
            Print Receipt
          </button>
          <button className="action-button back-button" onClick={handleNavigate}>
            <FaArrowLeft />
            Back to {orderType === 'sales' ? 'Sales' : 'Purchase'} Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenericReceipt;
