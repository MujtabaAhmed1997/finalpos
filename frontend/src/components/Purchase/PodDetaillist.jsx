import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaBox, FaDollarSign, FaListAlt } from 'react-icons/fa';
import './PurchaseOrderDetailList.css';

function PurchaseOrderDetailList() {
  const { id: purchaseOrderId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseOrder, setPurchaseOrder] = useState(null);

  useEffect(() => {
    fetchPurchaseOrderDetails();
    fetchPurchaseOrderInfo();
  }, [purchaseOrderId]);

  const fetchPurchaseOrderDetails = () => {
    setLoading(true);
    axios.get(`http://localhost:3001/api/purchaseordersdetails/purchaseOrder/${purchaseOrderId}/details`)
      .then(res => {
        setDetails(res.data.OrderDetails);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching purchase order details:', err);
        setLoading(false);
      });
  };

  const fetchPurchaseOrderInfo = () => {
    axios.get(`http://localhost:3001/api/purchase-orders/${purchaseOrderId}`)
      .then(res => {
        setPurchaseOrder(res.data);
      })
      .catch(err => {
        console.error('Error fetching purchase order info:', err);
      });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const calculateTotal = () => {
    return details.reduce((sum, detail) => sum + (detail.total || 0), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="purchase-order-detail-container">
      <div className="purchase-order-detail-card">
        <div className="detail-header">
          <div className="header-content">
            <FaShoppingCart className="header-icon" />
            <div className="header-text">
              <h2 className="detail-title">Purchase Order Details</h2>
              <p className="detail-subtitle">
                Order #{purchaseOrderId} - {purchaseOrder?.OrderDate ? new Date(purchaseOrder.OrderDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          <button className="back-button" onClick={handleBackClick}>
            <FaArrowLeft className="back-icon" />
            Back
          </button>
        </div>

        {purchaseOrder && (
          <div className="order-summary">
            <div className="summary-grid">
              <div className="summary-item">
                <FaBox className="summary-icon" />
                <div className="summary-content">
                  <span className="summary-label">Supplier</span>
                  <span className="summary-value">{purchaseOrder.Supplier?.SupplierName || 'N/A'}</span>
                </div>
              </div>
              <div className="summary-item">
                <FaDollarSign className="summary-icon" />
                <div className="summary-content">
                  <span className="summary-label">Total Amount</span>
                  <span className="summary-value">{formatCurrency(purchaseOrder.TotalAmount || 0)}</span>
                </div>
              </div>
              <div className="summary-item">
                <FaListAlt className="summary-icon" />
                <div className="summary-content">
                  <span className="summary-label">Items</span>
                  <span className="summary-value">{details.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading purchase order details...</p>
          </div>
        ) : details.length === 0 ? (
          <div className="empty-state">
            <FaBox className="empty-icon" />
            <h3 className="empty-title">No Details Found</h3>
            <p className="empty-subtitle">This purchase order doesn't have any details yet.</p>
          </div>
        ) : (
          <div className="details-content">
            <div className="table-container">
              <table className="details-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Variation</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((detail, index) => (
                    <tr key={index} className="detail-row">
                      <td className="product-cell">
                        <div className="product-info">
                          <span className="product-name">{detail.Product?.ProductName || 'N/A'}</span>
                          <span className="product-id">ID: {detail.PurchaseOrderDetailID}</span>
                        </div>
                      </td>
                      <td className="variation-cell">
                        <span className="variation-size">{detail.ProductVariation?.Size || 'N/A'}</span>
                        {detail.ProductVariation?.SKU && (
                          <span className="variation-sku">SKU: {detail.ProductVariation.SKU}</span>
                        )}
                      </td>
                      <td className="quantity-cell">
                        <span className="quantity-value">{detail.Quantity}</span>
                      </td>
                      <td className="price-cell">
                        <span className="unit-price">{formatCurrency(detail.UnitPrice || 0)}</span>
                      </td>
                      <td className="total-cell">
                        <span className="total-value">{formatCurrency(detail.total || 0)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="order-total">
              <div className="total-row">
                <span className="total-label">Order Total:</span>
                <span className="total-amount">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PurchaseOrderDetailList;
