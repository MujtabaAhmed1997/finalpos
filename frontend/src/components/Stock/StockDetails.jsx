import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBox, FaArrowLeft, FaHistory, FaChartLine, FaCalendarAlt, FaExchangeAlt, FaPlus, FaMinus, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';
import './StockDetails.css';

function StockDetail() {
  const { variationID } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableOverflow, setTableOverflow] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchStockDetails();
  }, [variationID]);

  useEffect(() => {
    const checkTableOverflow = () => {
      const tableContainer = document.querySelector('.stock-transactions-container');
      if (tableContainer) {
        const hasOverflow = tableContainer.scrollWidth > tableContainer.clientWidth;
        setTableOverflow(hasOverflow);
      }
    };

    // Check on mount and window resize
    checkTableOverflow();
    window.addEventListener('resize', checkTableOverflow);
    
    return () => window.removeEventListener('resize', checkTableOverflow);
  }, [data]); // Re-check when data changes

  const fetchStockDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`http://localhost:3001/api/stocktransaction/stock/${variationID}`);
      setData(res.data);
      console.log('Stock details fetched:', res.data);
    } catch (err) {
      console.error('Error fetching stock details:', err);
      setError('Failed to load stock details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Logic for displaying current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Calculate summary statistics
  const totalTransactions = data.length;
  const totalInQuantity = data
    .filter(item => item.TransactionType === 'IN')
    .reduce((sum, item) => sum + (item.Quantity || 0), 0);
  const totalOutQuantity = data
    .filter(item => item.TransactionType === 'OUT')
    .reduce((sum, item) => sum + (item.Quantity || 0), 0);
  const netQuantity = totalInQuantity - totalOutQuantity;

  // Get product info from first transaction (if available)
  const productInfo = data.length > 0 ? data[0].ProductVariation : null;

  const getTransactionTypeClass = (type) => {
    switch (type?.toUpperCase()) {
      case 'IN':
        return 'in';
      case 'OUT':
        return 'out';
      default:
        return 'adjustment';
    }
  };

  const getTransactionTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'IN':
        return <FaPlus />;
      case 'OUT':
        return <FaMinus />;
      default:
        return <FaExchangeAlt />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading stock details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div>
          <div className="error-message">{error}</div>
          <button className="action-button back-button" onClick={fetchStockDetails}>
            <FaBox /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-details-container">
      <div className="stock-details-card">
        {/* Header */}
        <div className="stock-details-header">
          <FaHistory size={50} color="#263043" style={{ marginBottom: '1rem' }} />
          <h1 className="stock-details-title">Stock Transaction History</h1>
          <p className="stock-details-subtitle">
            {productInfo ? `${productInfo.Product?.ProductName || 'Product'} - ${productInfo.SKU || 'SKU'}` : 'Product Details'}
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="stock-summary-grid">
          <div className="summary-item">
            <div className="summary-label">
              <FaChartLine className="me-2" />
              Total Transactions
            </div>
            <div className="summary-value">{totalTransactions}</div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">
              <FaPlus className="me-2" />
              Total In
            </div>
            <div className="summary-value">{totalInQuantity.toLocaleString()}</div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">
              <FaMinus className="me-2" />
              Total Out
            </div>
            <div className="summary-value">{totalOutQuantity.toLocaleString()}</div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">
              <FaBox className="me-2" />
              Net Quantity
            </div>
            <div className="summary-value" style={{ 
              color: netQuantity >= 0 ? '#28a745' : '#dc3545' 
            }}>
              {netQuantity.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className={`stock-transactions-container ${tableOverflow ? 'has-overflow' : ''}`}>
          <table className="stock-transactions-table">
            <thead>
              <tr>
                <th><FaBox className="me-2" />Product Name</th>
                <th><FaChartLine className="me-2" />SKU</th>
                <th><FaExchangeAlt className="me-2" />Quantity</th>
                <th><FaHistory className="me-2" />Transaction Type</th>
                <th><FaCalendarAlt className="me-2" />Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((transaction, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: '600' }}>
                      {transaction.ProductVariation?.Product?.ProductName || 'N/A'}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      {transaction.ProductVariation?.SKU || 'N/A'}
                    </td>
                    <td>
                      <span className={transaction.TransactionType === 'IN' ? 'quantity-positive' : 'quantity-negative'}>
                        {transaction.TransactionType === 'IN' ? '+' : '-'}{transaction.Quantity || 0}
                      </span>
                    </td>
                    <td>
                      <span className={`transaction-type ${getTransactionTypeClass(transaction.TransactionType)}`}>
                        {getTransactionTypeIcon(transaction.TransactionType)}
                        {transaction.TransactionType || 'N/A'}
                      </span>
                    </td>
                    <td>{formatDate(transaction.TransactionDate)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="empty-state">
                    <div className="empty-state-icon">
                      <FaHistory />
                    </div>
                    <div className="empty-state-text">No transactions found</div>
                    <div className="empty-state-subtext">
                      Transaction history will appear here once available
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pageNumbers.length > 1 && (
          <div className="pagination-container">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>
            
            {pageNumbers.map(number => (
              <button
                key={number}
                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            ))}
            
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
            >
              &raquo;
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="stock-details-actions">
          <Link to="/stocks" className="action-button back-button">
            <FaArrowLeft />
            Back to Stock List
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StockDetail;
