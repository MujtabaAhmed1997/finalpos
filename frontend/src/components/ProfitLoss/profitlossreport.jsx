import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { FaChartLine, FaCalendarAlt, FaBox, FaDollarSign, FaArrowUp, FaArrowDown, FaEquals, FaCog, FaFileAlt } from 'react-icons/fa';
import './ProfitLoss.css';

const ProfitLossScreen = () => {
  const currentDate = new Date().toISOString().split("T")[0];
  const previousDate = new Date();
  previousDate.setDate(previousDate.getDate() - 1);
  const formattedDate = previousDate.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [variationID, setVariationID] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate || !variationID) {
      setError("Please select start date, end date, and variation.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/profitloss/",
        {
          startDate,
          endDate,
          variationID,
        }
      );
      setReportData(response.data);
      setShowReport(true);
    } catch (err) {
      setError("Failed to fetch report. Please try again.");
      console.error("Error fetching profit/loss data:", err);
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getVariationName = (id) => {
    const variations = {
      "1": "Latif Oil",
      "2": "Latif Ghee", 
      "15": "Test"
    };
    return variations[id] || "Unknown";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <div className="loading-text">Generating Profit & Loss Report...</div>
        </div>
      </div>
    );
  }

  if (error && !showReport) {
    return (
      <div className="error-container">
        <div>
          <div className="error-message">{error}</div>
          <button className="generate-button" onClick={() => setError(null)}>
            <FaFileAlt /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profit-loss-container">
      <div className="profit-loss-card">
        {/* Header */}
        <div className="profit-loss-header">
          <FaChartLine size={50} color="#263043" style={{ marginBottom: '1rem' }} />
          <h1 className="profit-loss-title">Profit & Loss Statement</h1>
          <p className="profit-loss-subtitle">
            Comprehensive financial analysis and performance metrics
          </p>
        </div>

        {/* Filter Section */}
        <div className="filter-container">
          <h3 className="filter-title">
            <FaCalendarAlt className="me-2" />
            Select Report Parameters
          </h3>
          <div className="filter-inputs">
            <div className="filter-input-group">
              <label className="filter-label">Start Date</label>
              <input
                type="date"
                className="filter-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="filter-input-group">
              <label className="filter-label">End Date</label>
              <input
                type="date"
                className="filter-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="filter-input-group">
              <label className="filter-label">Product Variation</label>
              <select
                className="filter-input"
                value={variationID}
                onChange={(e) => setVariationID(e.target.value)}
              >
                <option value="">Select Variation</option>
                <option value="1">Latif Oil</option>
                <option value="2">Latif Ghee</option>
                <option value="15">Test</option>
              </select>
            </div>
            <div className="filter-input-group">
              <button
                className="generate-button"
                onClick={handleGenerateReport}
                disabled={loading}
              >
                {loading ? <FaCog className="fa-spin" /> : <FaChartLine />}
                {loading ? "Generating..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Report Display */}
        {showReport && reportData && (
          <>
            {/* Summary Cards */}
            <div className="profit-loss-summary">
              <div className="summary-card revenue">
                <div className="summary-card-header">
                  <FaArrowUp className="me-2" />
                  Total Revenue
                </div>
                <div className="summary-card-value">
                  {formatCurrency(reportData.totalRevenue)}
                </div>
                <div className="summary-card-subtitle">
                  Sales income for the period
                </div>
              </div>
              
              <div className="summary-card cogs">
                <div className="summary-card-header">
                  <FaArrowDown className="me-2" />
                  Cost of Goods Sold
                </div>
                <div className="summary-card-value">
                  {formatCurrency(reportData.totalCOGS)}
                </div>
                <div className="summary-card-subtitle">
                  Direct production costs
                </div>
              </div>
              
              <div className="summary-card profit">
                <div className="summary-card-header">
                  <FaEquals className="me-2" />
                  Net Profit
                </div>
                <div className="summary-card-value">
                  {formatCurrency(reportData.netProfit)}
                </div>
                <div className="summary-card-subtitle">
                  Final profit after all costs
                </div>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="profit-loss-table-container">
              <table className="profit-loss-table">
                <thead>
                  <tr>
                    <th><FaFileAlt className="me-2" />Category</th>
                    <th><FaDollarSign className="me-2" />Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Sales Revenue</strong>
                      <br />
                      <small className="text-muted">Total sales income</small>
                    </td>
                    <td className="amount-positive">
                      {formatCurrency(reportData.totalRevenue)}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Cost of Goods Sold</strong>
                      <br />
                      <small className="text-muted">Direct production costs</small>
                    </td>
                    <td className="amount-negative">
                      -{formatCurrency(reportData.totalCOGS)}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Gross Profit</strong>
                      <br />
                      <small className="text-muted">Revenue minus COGS</small>
                    </td>
                    <td className="amount-positive">
                      {formatCurrency(reportData.grossProfit)}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Total Expenses</strong>
                      <br />
                      <small className="text-muted">Operating expenses</small>
                    </td>
                    <td className="amount-negative">
                      -{formatCurrency(reportData.totalExpenses)}
                    </td>
                  </tr>
                  <tr style={{ 
                    backgroundColor: '#f8f9fa', 
                    borderTop: '2px solid #263043',
                    fontWeight: 'bold'
                  }}>
                    <td>
                      <strong>Net Profit</strong>
                      <br />
                      <small className="text-muted">Final profit/loss</small>
                    </td>
                    <td className={reportData.netProfit >= 0 ? "amount-positive" : "amount-negative"}>
                      {formatCurrency(reportData.netProfit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Additional Information */}
            <div style={{ 
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '15px',
              padding: '1.5rem',
              marginTop: '2rem',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ 
                color: '#2c3e50', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FaBox />
                Report Summary
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <strong>Product:</strong> {getVariationName(variationID)}
                </div>
                <div>
                  <strong>Period:</strong> {startDate} to {endDate}
                </div>
                <div>
                  <strong>Gross Margin:</strong> {
                    reportData.totalRevenue > 0 
                      ? `${((reportData.grossProfit / reportData.totalRevenue) * 100).toFixed(1)}%`
                      : '0%'
                  }
                </div>
                <div>
                  <strong>Net Margin:</strong> {
                    reportData.totalRevenue > 0 
                      ? `${((reportData.netProfit / reportData.totalRevenue) * 100).toFixed(1)}%`
                      : '0%'
                  }
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!showReport && !loading && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaChartLine />
            </div>
            <div className="empty-state-text">No report generated yet</div>
            <div className="empty-state-subtext">
              Select your parameters and click "Generate Report" to view your profit & loss statement
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitLossScreen;
