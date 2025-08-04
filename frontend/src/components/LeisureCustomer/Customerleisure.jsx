import axios from "axios";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./Customerleisure.css";

function CustomerLeisureShow() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerLeisureById(selectedCustomer);
    } else {
      setData([]);
      setFilteredData([]);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    filterDataByDateRange();
  }, [data, startDate, endDate]);

  const fetchCustomerLeisureById = (customerId) => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/api/customerleisure/customer/${customerId}`)
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch customer leisure records:", err);
        setLoading(false);
      });
  };

  const fetchCustomers = () => {
    axios
      .get("http://localhost:3001/api/customers")
      .then((res) => {
        const customersData = res.data?.data || [];
        setCustomers(customersData);
        setFilteredCustomers(customersData);
      })
      .catch((err) => {
        console.error("Failed to fetch customers:", err);
        setCustomers([]);
        setFilteredCustomers([]);
      });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!Array.isArray(customers)) {
      setFilteredCustomers([]);
      return;
    }
    const filtered = customers.filter((customer) =>
      customer.CustomerName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomer(customerId);
    if (!Array.isArray(customers)) {
      setSearchTerm("");
      setDropdownVisible(false);
      return;
    }
    const selectedCustomerObj = customers.find(
      (customer) => customer.CustomerID === parseInt(customerId)
    );
    setSearchTerm(selectedCustomerObj ? selectedCustomerObj.CustomerName : "");
    setDropdownVisible(false);
  };

  const handleFocus = () => {
    setDropdownVisible(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setDropdownVisible(false);
    }, 200);
  };

  const handleRowClick = (leisureID) => {
    setExpandedRow(expandedRow === leisureID ? null : leisureID);
  };

  const filterDataByDateRange = () => {
    if (!startDate && !endDate) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) => {
      const transactionDate = new Date(item.TransactionDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return transactionDate >= start && transactionDate <= end;
      } else if (start) {
        return transactionDate >= start;
      } else if (end) {
        return transactionDate <= end;
      }
      return true;
    });

    setFilteredData(filtered);
  };

  const downloadCSV = () => {
    if (!selectedCustomer || filteredData.length === 0) {
      alert("Please select a customer and ensure there's data to download");
      return;
    }

    setIsDownloading(true);

    try {
      const selectedCustomerObj = customers.find(
        (customer) => customer.CustomerID === parseInt(selectedCustomer)
      );

      // Prepare main transaction summary CSV data
      const mainCsvData = [
        [
          "Customer Name",
          "Transaction Type",
          "Transaction Date",
          "Credit",
          "Debit",
          "Balance",
          "Transaction ID"
        ]
      ];

      // Prepare detailed sales orders CSV data
      const salesOrdersCsvData = [
        [
          "Customer Name",
          "Transaction Date",
          "Transaction ID",
          "Product Name",
          "Product SKU",
          "Quantity",
          "Loose Quantity",
          "Unit Price",
          "Discount",
          "Total Amount"
        ]
      ];

      // Prepare detailed return orders CSV data
      const returnOrdersCsvData = [
        [
          "Customer Name",
          "Transaction Date",
          "Transaction ID",
          "Product Name",
          "Product SKU",
          "Returned Quantity",
          "Loose Returned",
          "Unit Price",
          "Return Reason",
          "Total Amount"
        ]
      ];

      // Process each transaction
      filteredData.forEach((item) => {
        // Add to main summary
        mainCsvData.push([
          selectedCustomerObj?.CustomerName || "N/A",
          item.TransactionType,
          new Date(item.TransactionDate).toLocaleDateString(),
          item.Credit || "0",
          item.Debit || "0",
          item.Balance || "0",
          item.TransactionID || "N/A"
        ]);

        // Process Sales Order details
        if (item.TransactionType === "SalesOrder" && item.SalesOrder && item.SalesOrder.length > 0) {
          item.SalesOrder.forEach((detail) => {
            const unitPerPackage = detail.ProductVariation ? detail.ProductVariation.UnitsPerPackage : 1;
            const total = calculateTotal(
              detail.Quantity,
              detail.UnitPrice,
              detail.Discount,
              detail.LooseQuantity,
              unitPerPackage
            );

            salesOrdersCsvData.push([
              selectedCustomerObj?.CustomerName || "N/A",
              new Date(item.TransactionDate).toLocaleDateString(),
              item.TransactionID || "N/A",
              detail.Product ? detail.Product.ProductName : "N/A",
              detail.ProductVariation ? detail.ProductVariation.SKU : "N/A",
              detail.Quantity || "0",
              detail.LooseQuantity || "0",
              detail.UnitPrice || "0",
              detail.Discount || "0",
              total || "0"
            ]);
          });
        }

        // Process Return Order details
        if (item.TransactionType === "ReturnOrder" && item.ReturnOrder && item.ReturnOrder.length > 0) {
          item.ReturnOrder.forEach((detail) => {
            const unitPerPackage = detail.ProductVariation ? detail.ProductVariation.UnitsPerPackage : 1;
            const total = calculateTotal(
              detail.Quantity,
              detail.UnitPrice,
              0,
              detail.LooseQuantity,
              unitPerPackage
            );

            returnOrdersCsvData.push([
              selectedCustomerObj?.CustomerName || "N/A",
              new Date(item.TransactionDate).toLocaleDateString(),
              item.TransactionID || "N/A",
              detail.Product ? detail.Product.ProductName : "N/A",
              detail.ProductVariation ? detail.ProductVariation.SKU : "N/A",
              detail.Quantity || "0",
              detail.LooseQuantity || "0",
              detail.UnitPrice || "0",
              detail.Reason || "N/A",
              total || "0"
            ]);
          });
        }
      });

      // Create combined CSV content with sections
      let combinedCsvContent = "";
      
      // Add Transaction Summary Section
      combinedCsvContent += "=== TRANSACTION SUMMARY ===\n";
      combinedCsvContent += mainCsvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
      
      // Add Sales Orders Section if exists
      if (salesOrdersCsvData.length > 1) {
        combinedCsvContent += "\n\n=== SALES ORDER DETAILS ===\n";
        combinedCsvContent += salesOrdersCsvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
      }
      
      // Add Return Orders Section if exists
      if (returnOrdersCsvData.length > 1) {
        combinedCsvContent += "\n\n=== RETURN ORDER DETAILS ===\n";
        combinedCsvContent += returnOrdersCsvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
      }

      // Add summary statistics
      const totalSales = salesOrdersCsvData.length > 1 ? salesOrdersCsvData.length - 1 : 0;
      const totalReturns = returnOrdersCsvData.length > 1 ? returnOrdersCsvData.length - 1 : 0;
      const totalTransactions = filteredData.length;
      
      combinedCsvContent += "\n\n=== SUMMARY STATISTICS ===\n";
      combinedCsvContent += `"Customer Name","${selectedCustomerObj?.CustomerName || 'N/A'}"\n`;
      combinedCsvContent += `"Total Transactions","${totalTransactions}"\n`;
      combinedCsvContent += `"Sales Order Items","${totalSales}"\n`;
      combinedCsvContent += `"Return Order Items","${totalReturns}"\n`;
      combinedCsvContent += `"Date Range","${startDate || 'All'} to ${endDate || 'All'}"\n`;
      combinedCsvContent += `"Export Date","${new Date().toLocaleDateString()}"\n`;

      // Create and download file
      const blob = new Blob([combinedCsvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const fileName = `${selectedCustomerObj?.CustomerName || 'Customer'}_Leisure_Detailed_${startDate || 'all'}_to_${endDate || 'all'}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloading(false);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error downloading file. Please try again.');
      setIsDownloading(false);
    }
  };

  const clearDateFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  const calculateTotal = (
    quantity,
    unitPrice,
    discount,
    looseQuantity,
    unitPerPackage
  ) => {
    const discountedUnitPrice = unitPrice - discount;
    const looseUnitPrice = discountedUnitPrice / unitPerPackage;
    return Math.floor(
      quantity * discountedUnitPrice + looseQuantity * looseUnitPrice
    );
  };

  const customerName =
    data.length > 0 && data[0].Customer ? data[0].Customer.CustomerName : "";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'SalesOrder':
        return '#28a745';
      case 'ReturnOrder':
        return '#dc3545';
      case 'Payment':
        return '#007bff';
      default:
        return '#6c757d';
    }
  };

  const displayData = filteredData.length > 0 ? filteredData : data;

  return (
    <div className="customer-leisure-container">
      <div className="customer-leisure-card">
        <div className="header-section">
          <div className="header-content">
            <h1 className="main-title">
              <i className="fas fa-users"></i>
              Customer Leisure Dashboard
            </h1>
            <p className="subtitle">Track customer transactions and leisure activities</p>
          </div>
        </div>

        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search for a customer..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => {
                    setSearchTerm("");
                    setFilteredCustomers(customers);
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            
            {dropdownVisible && filteredCustomers.length > 0 && (
              <div className="dropdown-container">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.CustomerID}
                    className="dropdown-item"
                    onMouseDown={() =>
                      handleCustomerSelect(customer.CustomerID.toString())
                    }
                  >
                    <i className="fas fa-user"></i>
                    <span>{customer.CustomerName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading customer data...</p>
          </div>
        ) : (
          <div className="content-section">
            {data.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>No Data Available</h3>
                <p>Select a customer to view their transaction history</p>
              </div>
            ) : (
              <div className="data-section">
                {customerName && (
                  <div className="customer-info">
                    <div className="customer-avatar">
                      <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="customer-details">
                      <h3>{customerName}</h3>
                      <p>Transaction History</p>
                    </div>
                  </div>
                )}

                {/* Date Range Filter Section */}
                <div className="date-filter-section">
                  <div className="date-filter-header">
                    <h4>
                      <i className="fas fa-calendar-alt"></i>
                      Filter by Date Range
                    </h4>
                    <div className="date-filter-controls">
                      <div className="date-input-group">
                        <label>Start Date:</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="date-input"
                        />
                      </div>
                      <div className="date-input-group">
                        <label>End Date:</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="date-input"
                        />
                      </div>
                      <button
                        className="clear-dates-btn"
                        onClick={clearDateFilters}
                        disabled={!startDate && !endDate}
                      >
                        <i className="fas fa-times"></i>
                        Clear
                      </button>
                                             <button
                         className="download-btn"
                         onClick={downloadCSV}
                         disabled={!selectedCustomer || displayData.length === 0 || isDownloading}
                       >
                         <i className={`fas fa-${isDownloading ? 'spinner fa-spin' : 'download'}`}></i>
                         {isDownloading ? 'Downloading...' : 'Download Detailed CSV'}
                       </button>
                    </div>
                  </div>
                  {(startDate || endDate) && (
                    <div className="filter-info">
                      <span>
                        Showing {filteredData.length} of {data.length} transactions
                        {startDate && ` from ${new Date(startDate).toLocaleDateString()}`}
                        {endDate && ` to ${new Date(endDate).toLocaleDateString()}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="table-container">
                  <div className="table-header">
                    <h4>Transaction Summary</h4>
                    <div className="table-stats">
                      <span className="stat-item">
                        <i className="fas fa-list"></i>
                        {displayData.length} Transactions
                      </span>
                      {(startDate || endDate) && (
                        <span className="stat-item filtered">
                          <i className="fas fa-filter"></i>
                          Filtered
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="table-wrapper">
                    <table className="transactions-table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Date</th>
                          <th>Credit</th>
                          <th>Debit</th>
                          <th>Balance</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayData.map((leisure, index) => {
                          let grandTotal = 0;
                          return (
                            <React.Fragment key={index}>
                              <tr className="transaction-row">
                                <td>
                                  <span 
                                    className="transaction-type"
                                    style={{ backgroundColor: getTransactionTypeColor(leisure.TransactionType) }}
                                  >
                                    <i className={`fas fa-${leisure.TransactionType === 'SalesOrder' ? 'shopping-cart' : leisure.TransactionType === 'ReturnOrder' ? 'undo' : 'money-bill'}`}></i>
                                    {leisure.TransactionType}
                                  </span>
                                </td>
                                <td>
                                  <div className="date-cell">
                                    <i className="fas fa-calendar"></i>
                                    {new Date(leisure.TransactionDate).toLocaleDateString()}
                                  </div>
                                </td>
                                <td>
                                  <span className="credit-amount">
                                    {leisure.Credit ? formatCurrency(leisure.Credit) : '-'}
                                  </span>
                                </td>
                                <td>
                                  <span className="debit-amount">
                                    {leisure.Debit ? formatCurrency(leisure.Debit) : '-'}
                                  </span>
                                </td>
                                <td>
                                  <span className="balance-amount">
                                    {formatCurrency(leisure.Balance)}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="details-button"
                                    onClick={() => handleRowClick(leisure.LeisureID)}
                                  >
                                    <i className={`fas fa-${expandedRow === leisure.LeisureID ? 'chevron-up' : 'chevron-down'}`}></i>
                                    {expandedRow === leisure.LeisureID ? "Hide" : "Details"}
                                  </button>
                                </td>
                              </tr>
                              {expandedRow === leisure.LeisureID && (
                                <tr className="details-row">
                                  <td colSpan="6">
                                    <div className="details-content">
                                      {leisure.TransactionType === "SalesOrder" &&
                                      leisure.SalesOrder &&
                                      leisure.SalesOrder.length > 0 ? (
                                        <div className="order-details">
                                          <h5>
                                            <i className="fas fa-shopping-cart"></i>
                                            Sales Order Details
                                          </h5>
                                          <div className="details-table-wrapper">
                                            <table className="details-table">
                                              <thead>
                                                <tr>
                                                  <th>Product</th>
                                                  <th>Variation</th>
                                                  <th>Quantity</th>
                                                  <th>Loose Qty</th>
                                                  <th>Unit Price</th>
                                                  <th>Discount</th>
                                                  <th>Total</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {leisure.SalesOrder.map((detail) => {
                                                  const unitPerPackage =
                                                    detail.ProductVariation
                                                      ? detail.ProductVariation
                                                          .UnitsPerPackage
                                                      : 1;
                                                  const total = calculateTotal(
                                                    detail.Quantity,
                                                    detail.UnitPrice,
                                                    detail.Discount,
                                                    detail.LooseQuantity,
                                                    unitPerPackage
                                                  );
                                                  grandTotal += total;
                                                  return (
                                                    <tr key={detail.SalesOrderDetailID}>
                                                      <td>
                                                        <div className="product-info">
                                                          <i className="fas fa-box"></i>
                                                          {detail.Product
                                                            ? detail.Product.ProductName
                                                            : "N/A"}
                                                        </div>
                                                      </td>
                                                      <td>
                                                        <span className="sku-tag">
                                                          {detail.ProductVariation
                                                            ? detail.ProductVariation.SKU
                                                            : "N/A"}
                                                        </span>
                                                      </td>
                                                      <td>{detail.Quantity}</td>
                                                      <td>{detail.LooseQuantity}</td>
                                                      <td>{formatCurrency(detail.UnitPrice)}</td>
                                                      <td>{formatCurrency(detail.Discount)}</td>
                                                      <td className="total-cell">
                                                        {formatCurrency(total)}
                                                      </td>
                                                    </tr>
                                                  );
                                                })}
                                              </tbody>
                                            </table>
                                          </div>
                                          <div className="grand-total">
                                            <span>Grand Total: {formatCurrency(grandTotal)}</span>
                                          </div>
                                        </div>
                                      ) : leisure.TransactionType === "ReturnOrder" &&
                                        leisure.ReturnOrder &&
                                        leisure.ReturnOrder.length > 0 ? (
                                        <div className="order-details">
                                          <h5>
                                            <i className="fas fa-undo"></i>
                                            Return Order Details
                                          </h5>
                                          <div className="details-table-wrapper">
                                            <table className="details-table">
                                              <thead>
                                                <tr>
                                                  <th>Product</th>
                                                  <th>Variation</th>
                                                  <th>Returned Qty</th>
                                                  <th>Loose Returned</th>
                                                  <th>Unit Price</th>
                                                  <th>Reason</th>
                                                  <th>Total</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {leisure.ReturnOrder.map((detail) => {
                                                  const unitPerPackage =
                                                    detail.ProductVariation
                                                      ? detail.ProductVariation
                                                          .UnitsPerPackage
                                                      : 1;
                                                  const total = calculateTotal(
                                                    detail.Quantity,
                                                    detail.UnitPrice,
                                                    0,
                                                    detail.LooseQuantity,
                                                    unitPerPackage
                                                  );
                                                  grandTotal += total;
                                                  return (
                                                    <tr key={detail.ReturnOrderDetailID}>
                                                      <td>
                                                        <div className="product-info">
                                                          <i className="fas fa-box"></i>
                                                          {detail.Product
                                                            ? detail.Product.ProductName
                                                            : "N/A"}
                                                        </div>
                                                      </td>
                                                      <td>
                                                        <span className="sku-tag">
                                                          {detail.ProductVariation
                                                            ? detail.ProductVariation.SKU
                                                            : "N/A"}
                                                        </span>
                                                      </td>
                                                      <td>{detail.Quantity}</td>
                                                      <td>{detail.LooseQuantity}</td>
                                                      <td>{formatCurrency(detail.UnitPrice)}</td>
                                                      <td>
                                                        <span className="reason-tag">
                                                          {detail.Reason}
                                                        </span>
                                                      </td>
                                                      <td className="total-cell">
                                                        {formatCurrency(total)}
                                                      </td>
                                                    </tr>
                                                  );
                                                })}
                                              </tbody>
                                            </table>
                                          </div>
                                          <div className="grand-total">
                                            <span>Grand Total: {formatCurrency(grandTotal)}</span>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="no-details">
                                          <i className="fas fa-info-circle"></i>
                                          <p>No transaction details available</p>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerLeisureShow;
