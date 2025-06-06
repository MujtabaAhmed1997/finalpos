// import axios from "axios";
// import { Link } from "react-router-dom";
// import React, { useState, useEffect } from "react";

// function CustomerLeisureShow() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [customers, setCustomers] = useState([]);
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [expandedRow, setExpandedRow] = useState(null);

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   useEffect(() => {
//     if (selectedCustomer) {
//       fetchCustomerLeisureById(selectedCustomer);
//     } else {
//       setData([]);
//     }
//   }, [selectedCustomer]);

//   const fetchCustomerLeisureById = (customerId) => {
//     setLoading(true);
//     axios
//       .get(`http://localhost:3001/api/customerleisure/customer/${customerId}`)
//       .then((res) => {
//         setData(res.data || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch customer leisure records:", err);
//         setLoading(false);
//       });
//   };

//   if(data)
//   const customerName = data[0];
//   console.log("customer", customerName);
//   const fetchCustomers = () => {
//     axios
//       .get("http://localhost:3001/api/customers")
//       .then((res) => {
//         setCustomers(res.data || []);
//         setFilteredCustomers(res.data || []);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch customers:", err);
//       });
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     const filtered = customers.filter((customer) =>
//       customer.CustomerName.toLowerCase().includes(e.target.value.toLowerCase())
//     );
//     setFilteredCustomers(filtered);
//   };

//   const handleCustomerSelect = (customerId) => {
//     setSelectedCustomer(customerId);
//     const selectedCustomerObj = customers.find(
//       (customer) => customer.CustomerID === parseInt(customerId)
//     );
//     setSearchTerm(selectedCustomerObj ? selectedCustomerObj.CustomerName : "");
//     setDropdownVisible(false);
//   };

//   const handleFocus = () => {
//     setDropdownVisible(true);
//   };

//   const handleBlur = () => {
//     setTimeout(() => {
//       setDropdownVisible(false);
//     }, 200);
//   };

//   const handleRowClick = (leisureID) => {
//     setExpandedRow(expandedRow === leisureID ? null : leisureID);
//   };

//   const calculateTotal = (
//     quantity,
//     unitPrice,
//     discount,
//     looseQuantity,
//     unitPerPackage
//   ) => {
//     const discountedUnitPrice = unitPrice - discount;
//     const looseUnitPrice = (unitPrice - discount) / unitPerPackage;
//     return Math.floor(
//       quantity * discountedUnitPrice + looseQuantity * looseUnitPrice
//     );
//   };

//   return (
//     <div
//       className="d-flex vh-100 justify-content-center align-items-center"
//       style={{ backgroundColor: "#1d2634" }}
//     >
//       <div className="w-100 w-md-50 bg-white rounded p-3">
//         <h2>Customer Leisure List</h2>
//         <div className="mb-3 position-relative">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search Customer"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             onFocus={handleFocus}
//             onBlur={handleBlur}
//           />
//           {dropdownVisible && filteredCustomers.length > 0 && (
//             <ul
//               className="list-group position-absolute w-100"
//               style={{ zIndex: 1000, maxHeight: "150px", overflowY: "auto" }}
//             >
//               {filteredCustomers.map((customer) => (
//                 <li
//                   key={customer.CustomerID}
//                   className="list-group-item list-group-item-action"
//                   onMouseDown={() =>
//                     handleCustomerSelect(customer.CustomerID.toString())
//                   }
//                   style={{ cursor: "pointer" }}
//                 >
//                   {customer.CustomerName}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
//             {data.length === 0 ? (
//               <div>No data available</div>
//             ) : (
//               <div>
//                 {/* <h1>{data[0]}</h1> */}
//                 <table className="table table-hover">
//                   <thead>
//                     <tr>
//                       {/* <th>ID</th> */}
//                       {/* <th>Customer Name</th> */}
//                       <th>Transaction Type</th>
//                       <th>Transaction ID</th>
//                       <th>Transaction Date</th>
//                       <th>Credit</th>
//                       <th>Debit</th>
//                       <th>Balance</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data.map((leisure, index) => {
//                       let grandTotal = 0;
//                       return (
//                         <React.Fragment key={index}>
//                           <tr>
//                             {/* <td>{leisure.LeisureID}</td> */}
//                             {/* <td>
//                             {leisure.Customer
//                               ? leisure.Customer.CustomerName
//                               : "N/A"}
//                           </td> */}
//                             <td>{leisure.TransactionType}</td>
//                             <td>{leisure.TransactionID}</td>
//                             <td>
//                               {new Date(
//                                 leisure.TransactionDate
//                               ).toLocaleDateString()}
//                             </td>
//                             <td>{leisure.Credit}</td>
//                             <td>{leisure.Debit}</td>
//                             <td>{leisure.Balance}</td>
//                             <td>
//                               <button
//                                 className="btn btn-sm btn-info"
//                                 onClick={() =>
//                                   handleRowClick(leisure.LeisureID)
//                                 }
//                               >
//                                 {expandedRow === leisure.LeisureID
//                                   ? "Hide Details"
//                                   : "Show Details"}
//                               </button>
//                             </td>
//                           </tr>
//                           {expandedRow === leisure.LeisureID && (
//                             <tr>
//                               <td colSpan="9">
//                                 <div>
//                                   {/* Sales Order Details */}
//                                   {leisure.TransactionType === "SalesOrder" &&
//                                   leisure.SalesOrder &&
//                                   leisure.SalesOrder.length > 0 ? (
//                                     <>
//                                       <table className="table table-sm">
//                                         <thead>
//                                           <tr>
//                                             <th>Product</th>
//                                             <th>Variation</th>
//                                             <th>Quantity</th>
//                                             <th>Loose Quantity</th>
//                                             <th>Unit Price</th>
//                                             <th>Discount</th>
//                                             <th>Total</th>
//                                           </tr>
//                                         </thead>
//                                         <tbody>
//                                           {leisure.SalesOrder.map((detail) => {
//                                             const unitPerPackage =
//                                               detail.ProductVariation
//                                                 ? detail.ProductVariation
//                                                     .UnitsPerPackage
//                                                 : 1;
//                                             const total = calculateTotal(
//                                               detail.Quantity,
//                                               detail.UnitPrice,
//                                               detail.Discount,
//                                               detail.LooseQuantity,
//                                               unitPerPackage
//                                             );
//                                             grandTotal += total;
//                                             return (
//                                               <tr
//                                                 key={detail.SalesOrderDetailID}
//                                               >
//                                                 <td>
//                                                   {detail.Product
//                                                     ? detail.Product.ProductName
//                                                     : "N/A"}
//                                                 </td>
//                                                 <td>
//                                                   {detail.ProductVariation
//                                                     ? detail.ProductVariation
//                                                         .SKU
//                                                     : "N/A"}
//                                                 </td>
//                                                 <td>{detail.Quantity}</td>
//                                                 <td>{detail.LooseQuantity}</td>
//                                                 <td>{detail.UnitPrice}</td>
//                                                 <td>{detail.Discount}</td>
//                                                 <td>{total.toFixed(2)}</td>
//                                               </tr>
//                                             );
//                                           })}
//                                         </tbody>
//                                       </table>
//                                       <h6>
//                                         Grand Total: {grandTotal.toFixed(2)}
//                                       </h6>
//                                     </>
//                                   ) : (
//                                     <div>No sales order details available</div>
//                                   )}

//                                   {/* Return Order Details */}
//                                   {leisure.TransactionType === "ReturnOrder" &&
//                                   leisure.ReturnOrder &&
//                                   leisure.ReturnOrder.length > 0 ? (
//                                     <>
//                                       <table className="table table-sm">
//                                         <thead>
//                                           <tr>
//                                             <th>Product</th>
//                                             <th>Variation</th>
//                                             <th>Returned Quantity</th>
//                                             <th>Loose Returned Quantity</th>
//                                             <th>Unit Price</th>
//                                             <th>Reason</th>
//                                             <th>Total</th>
//                                           </tr>
//                                         </thead>
//                                         <tbody>
//                                           {leisure.ReturnOrder.map((detail) => {
//                                             const unitPerPackage =
//                                               detail.ProductVariation
//                                                 ? detail.ProductVariation
//                                                     .UnitsPerPackage
//                                                 : 1;
//                                             const total = calculateTotal(
//                                               detail.Quantity,
//                                               detail.UnitPrice,
//                                               0,
//                                               detail.LooseQuantity,
//                                               unitPerPackage
//                                             );
//                                             grandTotal += total;
//                                             return (
//                                               <tr
//                                                 key={detail.ReturnOrderDetailID}
//                                               >
//                                                 <td>
//                                                   {detail.Product
//                                                     ? detail.Product.ProductName
//                                                     : "N/A"}
//                                                 </td>
//                                                 <td>
//                                                   {detail.ProductVariation
//                                                     ? detail.ProductVariation
//                                                         .SKU
//                                                     : "N/A"}
//                                                 </td>
//                                                 <td>{detail.Quantity}</td>
//                                                 <td>{detail.LooseQuantity}</td>
//                                                 <td>{detail.UnitPrice}</td>
//                                                 <td>{detail.Reason}</td>
//                                                 <td>{total.toFixed(2)}</td>
//                                               </tr>
//                                             );
//                                           })}
//                                         </tbody>
//                                       </table>
//                                       <h6>
//                                         Grand Total: {grandTotal.toFixed(2)}
//                                       </h6>
//                                     </>
//                                   ) : (
//                                     <div>No return order details available</div>
//                                   )}
//                                 </div>
//                               </td>
//                             </tr>
//                           )}
//                         </React.Fragment>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default CustomerLeisureShow;

import axios from "axios";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

function CustomerLeisureShow() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerLeisureById(selectedCustomer);
    } else {
      setData([]);
    }
  }, [selectedCustomer]);

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
        setCustomers(res.data || []);
        setFilteredCustomers(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch customers:", err);
      });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = customers.filter((customer) =>
      customer.CustomerName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomer(customerId);
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

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ backgroundColor: "#1d2634" }}
    >
      <div className="w-100 w-md-50 bg-white rounded p-3">
        <h2>Customer Leisure List</h2>
        <div className="mb-3 position-relative">
          <input
            type="text"
            className="form-control"
            placeholder="Search Customer"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {dropdownVisible && filteredCustomers.length > 0 && (
            <ul
              className="list-group position-absolute w-100"
              style={{ zIndex: 1000, maxHeight: "150px", overflowY: "auto" }}
            >
              {filteredCustomers.map((customer) => (
                <li
                  key={customer.CustomerID}
                  className="list-group-item list-group-item-action"
                  onMouseDown={() =>
                    handleCustomerSelect(customer.CustomerID.toString())
                  }
                  style={{ cursor: "pointer" }}
                >
                  {customer.CustomerName}
                </li>
              ))}
            </ul>
          )}
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {data.length === 0 ? (
              <div>No data available</div>
            ) : (
              <div>
                <h4 className="text-primary mb-3">Customer: {customerName}</h4>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Transaction Type</th>
                      {/* <th>Transaction ID</th> */}
                      <th>Transaction Date</th>
                      <th>Credit</th>
                      <th>Debit</th>
                      <th>Balance</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((leisure, index) => {
                      let grandTotal = 0;
                      return (
                        <React.Fragment key={index}>
                          <tr>
                            <td>{leisure.TransactionType}</td>
                            {/* <td>{leisure.TransactionID}</td> */}
                            <td>
                              {new Date(
                                leisure.TransactionDate
                              ).toLocaleDateString()}
                            </td>
                            <td>{leisure.Credit}</td>
                            <td>{leisure.Debit}</td>
                            <td>{leisure.Balance}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() =>
                                  handleRowClick(leisure.LeisureID)
                                }
                              >
                                {expandedRow === leisure.LeisureID
                                  ? "Hide Details"
                                  : "Show Details"}
                              </button>
                            </td>
                          </tr>
                          {expandedRow === leisure.LeisureID && (
                            <tr>
                              <td colSpan="9">
                                <div>
                                  {leisure.TransactionType === "SalesOrder" &&
                                  leisure.SalesOrder &&
                                  leisure.SalesOrder.length > 0 ? (
                                    <>
                                      <table className="table table-sm">
                                        <thead>
                                          <tr>
                                            <th>Product</th>
                                            <th>Variation</th>
                                            <th>Quantity</th>
                                            <th>Loose Quantity</th>
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
                                              <tr
                                                key={detail.SalesOrderDetailID}
                                              >
                                                <td>
                                                  {detail.Product
                                                    ? detail.Product.ProductName
                                                    : "N/A"}
                                                </td>
                                                <td>
                                                  {detail.ProductVariation
                                                    ? detail.ProductVariation
                                                        .SKU
                                                    : "N/A"}
                                                </td>
                                                <td>{detail.Quantity}</td>
                                                <td>{detail.LooseQuantity}</td>
                                                <td>{detail.UnitPrice}</td>
                                                <td>{detail.Discount}</td>
                                                <td>{total.toFixed(2)}</td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                      <h6>
                                        Grand Total: {grandTotal.toFixed(2)}
                                      </h6>
                                    </>
                                  ) : leisure.TransactionType ===
                                      "ReturnOrder" &&
                                    leisure.ReturnOrder &&
                                    leisure.ReturnOrder.length > 0 ? (
                                    <>
                                      <table className="table table-sm">
                                        <thead>
                                          <tr>
                                            <th>Product</th>
                                            <th>Variation</th>
                                            <th>Returned Quantity</th>
                                            <th>Loose Returned Quantity</th>
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
                                              <tr
                                                key={detail.ReturnOrderDetailID}
                                              >
                                                <td>
                                                  {detail.Product
                                                    ? detail.Product.ProductName
                                                    : "N/A"}
                                                </td>
                                                <td>
                                                  {detail.ProductVariation
                                                    ? detail.ProductVariation
                                                        .SKU
                                                    : "N/A"}
                                                </td>
                                                <td>{detail.Quantity}</td>
                                                <td>{detail.LooseQuantity}</td>
                                                <td>{detail.UnitPrice}</td>
                                                <td>{detail.Reason}</td>
                                                <td>{total.toFixed(2)}</td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                      <h6>
                                        Grand Total: {grandTotal.toFixed(2)}
                                      </h6>
                                    </>
                                  ) : (
                                    <div>No transaction details available</div>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerLeisureShow;
