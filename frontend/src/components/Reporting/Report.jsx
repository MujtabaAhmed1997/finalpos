import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { FaChartBar, FaArrowLeft, FaCalendarAlt, FaDollarSign, FaBox, FaChartLine, FaFileAlt, FaSearch, FaDownload, FaPrint, FaFileCsv, FaFileExcel, FaFilePdf, FaCog } from 'react-icons/fa';
import './Report.css';

const ReportComponent = () => {
  const currentDate = new Date().toISOString().split("T")[0];
  const previousDate = new Date();
  previousDate.setDate(previousDate.getDate() - 1);
  const formattedDate = previousDate.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [reportData, setReportData] = useState([]);
  const [dailyPayments, setDailyPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tableOverflow, setTableOverflow] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (startDate && endDate) {
      fetchReportData();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const checkTableOverflow = () => {
      const tableContainers = document.querySelectorAll('.report-table-container');
      tableContainers.forEach(container => {
        const hasOverflow = container.scrollWidth > container.clientWidth;
        if (hasOverflow) {
          container.classList.add('has-overflow');
        } else {
          container.classList.remove('has-overflow');
        }
      });
    };

    // Check on mount and window resize
    checkTableOverflow();
    window.addEventListener('resize', checkTableOverflow);
    
    return () => window.removeEventListener('resize', checkTableOverflow);
  }, [reportData, dailyPayments]);

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get("http://localhost:3001/api/report", {
        params: { startDate, endDate },
      });
      setReportData(response.data.reportData);
      setDailyPayments(response.data.dailyPayments);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch report data", error);
      setError('Failed to load report data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/homepage");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number || 0);
  };

  // Calculate summary statistics
  const totalSales = reportData.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  const totalQuantity = reportData.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
  const totalLooseQuantity = reportData.reduce((sum, item) => sum + (item.totalLooseQuantity || 0), 0);
  const totalPayments = dailyPayments.reduce((sum, payment) => sum + (payment.totalPayments || 0), 0);
  const averageSellingPrice = reportData.length > 0 
    ? reportData.reduce((sum, item) => sum + (item.averageSellingPrice || 0), 0) / reportData.length 
    : 0;

  const handlePrint = () => {
    window.print();
  };

  // Export functionality
  const exportToCSV = (data, filename) => {
    const csvContent = "data:text/csv;charset=utf-8," + data;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSalesDataToCSV = () => {
    setExporting(true);
    
    try {
      // Create CSV header
      const headers = [
        "Product Name",
        "Variation/SKU", 
        "Total Quantity",
        "Loose Quantity",
        "Total Amount",
        "Average Selling Price"
      ].join(",");

      // Create CSV rows
      const rows = reportData.map(item => [
        `"${item.Product?.ProductName || 'N/A'}"`,
        `"${item.ProductVariation?.SKU || 'N/A'}"`,
        item.totalQuantity || 0,
        item.totalLooseQuantity || 0,
        item.totalAmount || 0,
        item.averageSellingPrice || 0
      ].join(","));

      const csvData = [headers, ...rows].join("\n");
      const filename = `sales_report_${startDate}_to_${endDate}.csv`;
      
      exportToCSV(csvData, filename);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV file. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const exportPaymentsDataToCSV = () => {
    setExporting(true);
    
    try {
      // Create CSV header
      const headers = [
        "Date",
        "Total Payments"
      ].join(",");

      // Create CSV rows
      const rows = dailyPayments.map(payment => [
        payment.date,
        payment.totalPayments || 0
      ].join(","));

      const csvData = [headers, ...rows].join("\n");
      const filename = `payments_report_${startDate}_to_${endDate}.csv`;
      
      exportToCSV(csvData, filename);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV file. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const exportSummaryToCSV = () => {
    setExporting(true);
    
    try {
      // Create CSV header
      const headers = [
        "Metric",
        "Value"
      ].join(",");

      // Create CSV rows
      const rows = [
        ["Total Sales", totalSales],
        ["Total Quantity", totalQuantity],
        ["Loose Quantity", totalLooseQuantity],
        ["Total Payments", totalPayments],
        ["Average Selling Price", averageSellingPrice],
        ["Products Sold", reportData.length],
        ["Report Period", `${startDate} to ${endDate}`]
      ].map(row => row.join(","));

      const csvData = [headers, ...rows].join("\n");
      const filename = `summary_report_${startDate}_to_${endDate}.csv`;
      
      exportToCSV(csvData, filename);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV file. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = () => {
    setExporting(true);
    
    try {
      // Create Excel-like CSV with multiple sheets
      let excelData = "";
      
      // Summary Sheet
      excelData += "SUMMARY REPORT\n";
      excelData += `Report Period: ${startDate} to ${endDate}\n\n`;
      excelData += "Metric,Value\n";
      excelData += `Total Sales,${totalSales}\n`;
      excelData += `Total Quantity,${totalQuantity}\n`;
      excelData += `Loose Quantity,${totalLooseQuantity}\n`;
      excelData += `Total Payments,${totalPayments}\n`;
      excelData += `Average Selling Price,${averageSellingPrice}\n`;
      excelData += `Products Sold,${reportData.length}\n\n`;
      
      // Sales Data Sheet
      excelData += "SALES DATA\n";
      excelData += "Product Name,Variation/SKU,Total Quantity,Loose Quantity,Total Amount,Average Selling Price\n";
      reportData.forEach(item => {
        excelData += `"${item.Product?.ProductName || 'N/A'}","${item.ProductVariation?.SKU || 'N/A'}",${item.totalQuantity || 0},${item.totalLooseQuantity || 0},${item.totalAmount || 0},${item.averageSellingPrice || 0}\n`;
      });
      excelData += "\n";
      
      // Payments Data Sheet
      excelData += "DAILY PAYMENTS\n";
      excelData += "Date,Total Payments\n";
      dailyPayments.forEach(payment => {
        excelData += `${payment.date},${payment.totalPayments || 0}\n`;
      });

      const filename = `complete_report_${startDate}_to_${endDate}.csv`;
      exportToCSV(excelData, filename);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Failed to export Excel file. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = () => {
    setExporting(true);
    
    try {
      // Create a formatted text report for PDF
      let pdfContent = "";
      
      // Header
      pdfContent += "SALES REPORT\n";
      pdfContent += "=".repeat(50) + "\n\n";
      pdfContent += `Report Period: ${startDate} to ${endDate}\n`;
      pdfContent += `Generated: ${new Date().toLocaleString()}\n\n`;
      
      // Summary
      pdfContent += "SUMMARY STATISTICS\n";
      pdfContent += "-".repeat(30) + "\n";
      pdfContent += `Total Sales: ${formatCurrency(totalSales)}\n`;
      pdfContent += `Total Quantity: ${formatNumber(totalQuantity)}\n`;
      pdfContent += `Loose Quantity: ${formatNumber(totalLooseQuantity)}\n`;
      pdfContent += `Total Payments: ${formatCurrency(totalPayments)}\n`;
      pdfContent += `Average Selling Price: ${formatCurrency(averageSellingPrice)}\n`;
      pdfContent += `Products Sold: ${reportData.length}\n\n`;
      
      // Sales Data
      pdfContent += "SALES DATA\n";
      pdfContent += "-".repeat(30) + "\n";
      reportData.forEach((item, index) => {
        pdfContent += `${index + 1}. ${item.Product?.ProductName || 'N/A'}\n`;
        pdfContent += `   SKU: ${item.ProductVariation?.SKU || 'N/A'}\n`;
        pdfContent += `   Total Quantity: ${formatNumber(item.totalQuantity)}\n`;
        pdfContent += `   Loose Quantity: ${formatNumber(item.totalLooseQuantity)}\n`;
        pdfContent += `   Total Amount: ${formatCurrency(item.totalAmount)}\n`;
        pdfContent += `   Average Price: ${formatCurrency(item.averageSellingPrice)}\n\n`;
      });
      
      // Payments Data
      pdfContent += "DAILY PAYMENTS\n";
      pdfContent += "-".repeat(30) + "\n";
      dailyPayments.forEach(payment => {
        pdfContent += `${payment.date}: ${formatCurrency(payment.totalPayments)}\n`;
      });

      // Create and download text file (simulating PDF)
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sales_report_${startDate}_to_${endDate}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF file. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleExport = () => {
    setShowExportOptions(!showExportOptions);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading report data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div>
          <div className="error-message">{error}</div>
          <button className="action-button back-button" onClick={fetchReportData}>
            <FaChartBar /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-container">
      <div className="report-card">
        {/* Header */}
        <div className="report-header">
          <FaChartBar size={50} color="#263043" style={{ marginBottom: '1rem' }} />
          <h1 className="report-title">Sales Report</h1>
          <p className="report-subtitle">
            Comprehensive analysis of sales performance and revenue metrics
          </p>
        </div>

        {/* Date Filter */}
        <div className="date-filter-container">
          <h3 className="date-filter-title">
            <FaCalendarAlt className="me-2" />
            Select Date Range
          </h3>
          <div className="date-inputs">
            <div className="date-input-group">
              <label className="date-label">Start Date</label>
              <input
                type="date"
                className="date-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="date-input-group">
              <label className="date-label">End Date</label>
              <input
                type="date"
                className="date-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="report-summary-grid">
          <div className="summary-item">
            <div className="summary-label">
              <FaDollarSign className="me-2" />
              Total Sales
            </div>
            <div className="summary-value">{formatCurrency(totalSales)}</div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">
              <FaBox className="me-2" />
              Total Quantity
            </div>
            <div className="summary-value">{formatNumber(totalQuantity)}</div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">
              <FaChartLine className="me-2" />
              Loose Quantity
            </div>
            <div className="summary-value">{formatNumber(totalLooseQuantity)}</div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">
              <FaDollarSign className="me-2" />
              Total Payments
            </div>
            <div className="summary-value">{formatCurrency(totalPayments)}</div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">
              <FaChartBar className="me-2" />
              Avg. Selling Price
            </div>
            <div className="summary-value">{formatCurrency(averageSellingPrice)}</div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">
              <FaFileAlt className="me-2" />
              Products Sold
            </div>
            <div className="summary-value">{reportData.length}</div>
          </div>
        </div>

        {/* Sales Data Section */}
        <div className="report-section">
          <h2 className="report-section-title">
            <FaChartBar className="me-2" />
            Sales Data
          </h2>
          <div className="report-table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th><FaBox className="me-2" />Product Name</th>
                  <th><FaFileAlt className="me-2" />Variation</th>
                  <th><FaChartLine className="me-2" />Total Quantity</th>
                  <th><FaBox className="me-2" />Loose Quantity</th>
                  <th><FaDollarSign className="me-2" />Total Amount</th>
                  <th><FaChartBar className="me-2" />Average Selling Price</th>
                </tr>
              </thead>
              <tbody>
                {reportData.length > 0 ? (
                  reportData.map((item) => (
                    <tr key={`${item.VariationID}`}>
                      <td style={{ fontWeight: '600' }}>
                        {item.Product?.ProductName || 'N/A'}
                      </td>
                      <td className="sku-cell">
                        {item.ProductVariation?.SKU || 'N/A'}
                      </td>
                      <td className="quantity-cell">
                        {formatNumber(item.totalQuantity)}
                      </td>
                      <td className="quantity-cell">
                        {formatNumber(item.totalLooseQuantity)}
                      </td>
                      <td className="amount-cell">
                        {formatCurrency(item.totalAmount)}
                      </td>
                      <td className="amount-cell">
                        {formatCurrency(item.averageSellingPrice)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="empty-state">
                      <div className="empty-state-icon">
                        <FaChartBar />
                      </div>
                      <div className="empty-state-text">No sales data available</div>
                      <div className="empty-state-subtext">
                        Sales data will appear here for the selected date range
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Payments Section */}
        <div className="report-section">
          <h2 className="report-section-title">
            <FaDollarSign className="me-2" />
            Daily Payments
          </h2>
          <div className="report-table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th><FaCalendarAlt className="me-2" />Date</th>
                  <th><FaDollarSign className="me-2" />Total Payments</th>
                </tr>
              </thead>
              <tbody>
                {dailyPayments.length > 0 ? (
                  dailyPayments.map((payment, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: '600' }}>
                        {new Date(payment.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="amount-cell">
                        {formatCurrency(payment.totalPayments)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="empty-state">
                      <div className="empty-state-icon">
                        <FaDollarSign />
                      </div>
                      <div className="empty-state-text">No payment data available</div>
                      <div className="empty-state-subtext">
                        Payment data will appear here for the selected date range
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="report-actions">
          <button className="action-button back-button" onClick={goBack}>
            <FaArrowLeft />
            Back to Home
          </button>
          <button className="action-button" onClick={handlePrint} style={{
            background: '#28a745',
            color: 'white',
            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.4)'
          }}>
            <FaPrint />
            Print Report
          </button>
          
          {/* Export Button with Dropdown */}
          <div className="export-container" style={{ position: 'relative' }}>
            <button 
              className="action-button" 
              onClick={handleExport} 
              style={{
                background: '#17a2b8',
                color: 'white',
                boxShadow: '0 4px 15px rgba(23, 162, 184, 0.4)'
              }}
            >
              {exporting ? <FaCog className="fa-spin" /> : <FaDownload />}
              {exporting ? 'Exporting...' : 'Export Data'}
            </button>
            
            {showExportOptions && (
              <div className="export-dropdown">
                <button 
                  className="export-option" 
                  onClick={exportSummaryToCSV}
                  disabled={exporting}
                >
                  <FaFileCsv /> Export Summary (CSV)
                </button>
                <button 
                  className="export-option" 
                  onClick={exportSalesDataToCSV}
                  disabled={exporting}
                >
                  <FaFileCsv /> Export Sales Data (CSV)
                </button>
                <button 
                  className="export-option" 
                  onClick={exportPaymentsDataToCSV}
                  disabled={exporting}
                >
                  <FaFileCsv /> Export Payments (CSV)
                </button>
                <button 
                  className="export-option" 
                  onClick={exportToExcel}
                  disabled={exporting}
                >
                  <FaFileExcel /> Export Complete Report (Excel)
                </button>
                <button 
                  className="export-option" 
                  onClick={exportToPDF}
                  disabled={exporting}
                >
                  <FaFilePdf /> Export as Text Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportComponent;
