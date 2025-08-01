import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBox, FaEye, FaWarehouse, FaCubes, FaExclamationTriangle, FaCheckCircle, FaClock, FaSearch } from 'react-icons/fa';
import './Stock.css';

function StockComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableOverflow, setTableOverflow] = useState(false);

  useEffect(() => {
    fetchAggregatedStock();
  }, []);

  useEffect(() => {
    const checkTableOverflow = () => {
      const tableContainer = document.querySelector('.stock-table-container');
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

  const fetchAggregatedStock = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`http://localhost:3001/api/stocktransaction/stk/all`);
      setData(res.data);
      console.log(res.data);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to load stock data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStockLevelClass = (packedStock, looseStock) => {
    const totalStock = (packedStock || 0) + (looseStock || 0);
    if (totalStock === 0) return 'low';
    if (totalStock <= 10) return 'low';
    if (totalStock <= 50) return 'medium';
    return 'high';
  };

  const getStockLevelIcon = (packedStock, looseStock) => {
    const totalStock = (packedStock || 0) + (looseStock || 0);
    if (totalStock === 0) return <FaExclamationTriangle />;
    if (totalStock <= 10) return <FaExclamationTriangle />;
    if (totalStock <= 50) return <FaClock />;
    return <FaCheckCircle />;
  };

  const getStockLevelText = (packedStock, looseStock) => {
    const totalStock = (packedStock || 0) + (looseStock || 0);
    if (totalStock === 0) return 'Out of Stock';
    if (totalStock <= 10) return 'Low Stock';
    if (totalStock <= 50) return 'Medium Stock';
    return 'In Stock';
  };

  const filteredData = data.filter(item =>
    item.ProductName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.SKU?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = data.length;
  const totalStock = data.reduce((sum, item) => sum + (item.ContainerStock || 0) + (item.LooseStock || 0), 0);
  const lowStockItems = data.filter(item => {
    const total = (item.ContainerStock || 0) + (item.LooseStock || 0);
    return total <= 10 && total > 0;
  }).length;
  const outOfStockItems = data.filter(item => {
    const total = (item.ContainerStock || 0) + (item.LooseStock || 0);
    return total === 0;
  }).length;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading stock data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div>
          <div className="error-message">{error}</div>
          <button className="action-button" onClick={fetchAggregatedStock}>
            <FaBox /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-container">
      <div className="stock-card">
        {/* Header */}
        <div className="stock-header">
          <FaWarehouse size={50} color="#263043" style={{ marginBottom: '1rem' }} />
          <h1 className="stock-title">Stock Management</h1>
          <p className="stock-subtitle">
            Monitor and manage your inventory levels across all products
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="stock-stats-grid">
          <div className="stat-item">
            <div className="stat-label">
              <FaBox className="me-2" />
              Total Products
            </div>
            <div className="stat-value">{totalProducts}</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-label">
              <FaCubes className="me-2" />
              Total Stock
            </div>
            <div className="stat-value">{totalStock.toLocaleString()}</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-label">
              <FaExclamationTriangle className="me-2" />
              Low Stock Items
            </div>
            <div className="stat-value">{lowStockItems}</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-label">
              <FaClock className="me-2" />
              Out of Stock
            </div>
            <div className="stat-value">{outOfStockItems}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
            <FaSearch 
              style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#6c757d',
                zIndex: 1
              }} 
            />
            <input
              type="text"
              placeholder="Search products or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '2px solid #e9ecef',
                borderRadius: '25px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#263043';
                e.target.style.boxShadow = '0 0 0 0.2rem rgba(38, 48, 67, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Stock Table */}
        <div className={`stock-table-container ${tableOverflow ? 'has-overflow' : ''}`}>
          <table className="stock-table">
            <thead>
              <tr>
                <th><FaBox className="me-2" />Product Name</th>
                <th><FaCubes className="me-2" />SKU</th>
                <th><FaWarehouse className="me-2" />Packed Stock</th>
                <th><FaCubes className="me-2" />Loose Stock</th>
                <th><FaExclamationTriangle className="me-2" />Status</th>
                <th><FaEye className="me-2" />Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  const stockLevelClass = getStockLevelClass(item.ContainerStock, item.LooseStock);
                  const stockLevelIcon = getStockLevelIcon(item.ContainerStock, item.LooseStock);
                  const stockLevelText = getStockLevelText(item.ContainerStock, item.LooseStock);
                  
                  return (
                    <tr key={index}>
                      <td style={{ fontWeight: '600' }}>{item.ProductName || 'N/A'}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {item.SKU || 'N/A'}
                      </td>
                      <td>
                        <span className={`stock-quantity ${stockLevelClass}`}>
                          {item.ContainerStock || 0}
                        </span>
                      </td>
                      <td>
                        <span className={`stock-quantity ${stockLevelClass}`}>
                          {item.LooseStock || 0}
                        </span>
                      </td>
                      <td>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '0.5rem' 
                        }}>
                          {stockLevelIcon}
                          <span style={{ 
                            fontSize: '0.85rem', 
                            fontWeight: '600',
                            color: stockLevelClass === 'low' ? '#dc3545' : 
                                   stockLevelClass === 'medium' ? '#fd7e14' : '#28a745'
                          }}>
                            {stockLevelText}
                          </span>
                        </div>
                      </td>
                      <td>
                        <Link 
                          to={`/stock/read/${item.VariationID}`} 
                          className="action-button"
                        >
                          <FaEye />
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <div className="empty-state-icon">
                      <FaBox />
                    </div>
                    <div className="empty-state-text">
                      {searchTerm ? 'No products found' : 'No stock data available'}
                    </div>
                    <div className="empty-state-subtext">
                      {searchTerm ? 'Try adjusting your search terms' : 'Stock data will appear here once available'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StockComponent;
