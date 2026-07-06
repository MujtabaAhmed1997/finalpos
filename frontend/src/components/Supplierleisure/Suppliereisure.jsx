// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';

// function SupplierLeisureShow() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [suppliers, setSuppliers] = useState([]);
//   const [filteredSuppliers, setFilteredSuppliers] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [expandedRow, setExpandedRow] = useState(null);

//   useEffect(() => {
//     fetchSuppliers();
//   }, []);

//   useEffect(() => {
//     if (selectedSupplier) {
//       fetchSupplierLeisureById(selectedSupplier);
//     } else {
//       setData([]);
//     }
//   }, [selectedSupplier]);

//   const fetchSupplierLeisureById = (supplierId) => {
//     setLoading(true);
//     axios.get(`http://localhost:3001/api/supplierleisure/supplier/${supplierId}`)
//       .then(res => {
//         setData(res.data || []);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Failed to fetch supplier leisure records:', err);
//         setLoading(false);
//       });
//   };

//   const fetchSuppliers = () => {
//     axios.get('http://localhost:3001/api/suppliers')
//       .then(res => {
//         setSuppliers(res.data || []);
//         setFilteredSuppliers(res.data || []);
//       })
//       .catch(err => {
//         console.error('Failed to fetch suppliers:', err);
//       });
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     const filtered = suppliers.filter(supplier =>
//       supplier.SupplierName.toLowerCase().includes(e.target.value.toLowerCase())
//     );
//     setFilteredSuppliers(filtered);
//   };

//   const handleSupplierSelect = (supplierId) => {
//     setSelectedSupplier(supplierId);
//     const selectedSupplierObj = suppliers.find(supplier => supplier.SupplierID === parseInt(supplierId));
//     setSearchTerm(selectedSupplierObj ? selectedSupplierObj.SupplierName : '');
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

//   const calculateTotal = (quantity, unitPrice,  ) => {
//     return Math.floor((quantity * unitPrice) );
//   };

//   return (
//     <div
//       className='d-flex vh-100 justify-content-center align-items-center'
//       style={{ backgroundColor: '#1d2634' }}
//     >
//       <div className='w-100 w-md-50 bg-white rounded p-3'>
//         <h2>Supplier Leisure List</h2>
//         <div className='mb-3 position-relative'>
//           <input
//             type='text'
//             className='form-control'
//             placeholder='Search Supplier'
//             value={searchTerm}
//             onChange={handleSearchChange}
//             onFocus={handleFocus}
//             onBlur={handleBlur}
//           />
//           {dropdownVisible && filteredSuppliers.length > 0 && (
//             <ul className='list-group position-absolute w-100' style={{ zIndex: 1000, maxHeight: '150px', overflowY: 'auto' }}>
//               {filteredSuppliers.map(supplier => (
//                 <li
//                   key={supplier.SupplierID}
//                   className='list-group-item list-group-item-action'
//                   onMouseDown={() => handleSupplierSelect(supplier.SupplierID.toString())}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {supplier.SupplierName}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
        
//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
//             {data.length === 0 ? (
//               <div>No data available</div>
//             ) : (
//               <table className='table'>
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Supplier Name</th>
//                     <th>Transaction Type</th>
//                     <th>Transaction ID</th>
//                     <th>Transaction Date</th>
//                     <th>Credit</th>
//                     <th>Debit</th>
//                     <th>Balance</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.map((leisure, index) => {
//                     let grandTotal = 0;
//                     return (
//                       <React.Fragment key={index}>
//                         <tr>
//                           <td>{leisure.LeisureID}</td>
//                           <td>{leisure.Supplier ? leisure.Supplier.SupplierName : 'N/A'}</td>
//                           <td>{leisure.TransactionType}</td>
//                           <td>{leisure.TransactionID}</td>
//                           <td>{new Date(leisure.TransactionDate).toLocaleDateString()}</td>
//                           <td>{leisure.Credit}</td>
//                           <td>{leisure.Debit}</td>
//                           <td>{leisure.Balance}</td>
//                           <td>
//                             <button
//                               className='btn btn-sm btn-info'
//                               onClick={() => handleRowClick(leisure.LeisureID)}
//                             >
//                               {expandedRow === leisure.LeisureID ? 'Hide Details' : 'Show Details'}
//                             </button>
//                           </td>
//                         </tr>
//                         {expandedRow === leisure.LeisureID && (
//                           <tr>
//                             <td colSpan="9">
//                               <div>
//                                 {leisure.TransactionType === 'PurchaseOrder' && leisure.PurchaseOrder && leisure.PurchaseOrder.length > 0 ? (
//                                   <>
//                                     <table className='table'>
//                                       <thead>
//                                         <tr>
//                                           <th>Product</th>
//                                           <th>Variation</th>
//                                           <th>Quantity</th>
//                                           <th>Unit Price</th>
//                                           <th>Total</th>
//                                         </tr>
//                                       </thead>
//                                       <tbody>
//                                         {leisure.PurchaseOrder.map((detail) => {
//                                           const total = calculateTotal(
//                                             detail.Quantity,
//                                             detail.UnitPrice,
                                            
//                                           );
//                                           grandTotal += total;
//                                           return (
//                                             <tr key={detail.PurchaseOrderDetailID}>
//                                               <td>{detail.Product ? detail.Product.ProductName : 'N/A'}</td>
//                                               <td>{detail.ProductVariation ? detail.ProductVariation.SKU : 'N/A'}</td>
//                                               <td>{detail.Quantity}</td>
//                                               <td>{detail.UnitPrice}</td>
//                                              <td>{total.toFixed(2)}</td>
//                                             </tr>
//                                           );
//                                         })}
//                                       </tbody>
//                                     </table>
//                                     <h6>Grand Total: {grandTotal.toFixed(2)}</h6>
//                                   </>
//                                 ) : (
//                                   <div>No purchase order details available</div>
//                                 )}
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SupplierLeisureShow;


// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';
// import { Navigate } from 'react-router-dom';
// function SupplierLeisureShow() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [suppliers, setSuppliers] = useState([]);
//   const [filteredSuppliers, setFilteredSuppliers] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [userRole, setUserRole] = useState('');

//   // const Navigation=useNavigate();

//   // const history = useHistory();

//   useEffect(() => {
//     const userRole = localStorage.getItem('userRole');
//     console.log(userRole); // Or use your state management
//     if (userRole !== 'admin') {
// console.log("Unauthorized");
// setUserRole(userRole);    }
//   }, []);



//   // useEffect(() => {
//   //   fetchSuppliers();
//   // }, []);

//   // useEffect(() => {
//   //   if (selectedSupplier) {
//   //     fetchSupplierLeisureById(selectedSupplier);
//   //   } else {
//   //     setData([]);
//   //   }
//   // }, [selectedSupplier]);

//   useEffect(() => {
//     if (userRole === 'admin') {
//       fetchSuppliers();
//     }
//   }, [userRole]);

//   useEffect(() => {
//     if (selectedSupplier && userRole === 'admin') {
//       fetchSupplierLeisureById(selectedSupplier);
//     } else {
//       setData([]);
//     }
//   }, [selectedSupplier, userRole]);
//   const fetchSupplierLeisureById = async (supplierId) => {
//     setLoading(true);
//     try {
//       console.log(token);
//       const res = await axios.get(`http://localhost:3001/api/supplierleisure/supplier/${supplierId}`,{
//         headers: {
//           'Authorization': `Bearer ${token}`, // Replace `token` with the actual JWT token
//         },}
//       );
//       setData(res.data || []);
//     } catch (err) {
//       console.error('Failed to fetch supplier leisure records:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSuppliers = async () => {
//     try {
//       const res = await axios.get('http://localhost:3001/api/suppliers');
//       setSuppliers(res.data || []);
//       setFilteredSuppliers(res.data || []);
//     } catch (err) {
//       console.error('Failed to fetch suppliers:', err);
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     const filtered = suppliers.filter(supplier =>
//       supplier.SupplierName.toLowerCase().includes(e.target.value.toLowerCase())
//     );
//     setFilteredSuppliers(filtered);
//   };

//   const handleSupplierSelect = (supplierId) => {
//     setSelectedSupplier(supplierId);
//     const selectedSupplierObj = suppliers.find(supplier => supplier.SupplierID === parseInt(supplierId));
//     setSearchTerm(selectedSupplierObj ? selectedSupplierObj.SupplierName : '');
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

//   const calculateTotal = (quantity, unitPrice) => {
//     return Math.floor((quantity * unitPrice));
//   };

//   if (userRole !== 'admin') {
//     return (
//       <div
//         className='d-flex vh-100 justify-content-center align-items-center'
//         style={{ backgroundColor: '#1d2634' }}
//       >
//         <div className='w-100 w-md-50 bg-white rounded p-3'>
//           <h2>Unauthorized Access</h2>
//           <p>You are unauthorized to view this page. Only admins can access this section.</p>
//           {/* <button className='btn btn-success' onClick={Navigation('/homepage')}>Go Back</button> */}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className='d-flex vh-100 justify-content-center align-items-center'
//       style={{ backgroundColor: '#1d2634' }}
//     >
//       <div className='w-100 w-md-50 bg-white rounded p-3'>
//         <h2>Supplier Leisure List</h2>
//         <div className='mb-3 position-relative'>
//           <input
//             type='text'
//             className='form-control'
//             placeholder='Search Supplier'
//             value={searchTerm}
//             onChange={handleSearchChange}
//             onFocus={handleFocus}
//             onBlur={handleBlur}
//           />
//           {dropdownVisible && filteredSuppliers.length > 0 && (
//             <ul className='list-group position-absolute w-100' style={{ zIndex: 1000, maxHeight: '150px', overflowY: 'auto' }}>
//               {filteredSuppliers.map(supplier => (
//                 <li
//                   key={supplier.SupplierID}
//                   className='list-group-item list-group-item-action'
//                   onMouseDown={() => handleSupplierSelect(supplier.SupplierID.toString())}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {supplier.SupplierName}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
        
//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
//             {data.length === 0 ? (
//               <div>No data available</div>
//             ) : (
//               <table className='table'>
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Supplier Name</th>
//                     <th>Transaction Type</th>
//                     <th>Transaction ID</th>
//                     <th>Transaction Date</th>
//                     <th>Credit</th>
//                     <th>Debit</th>
//                     <th>Balance</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.map((leisure, index) => {
//                     let grandTotal = 0;
//                     return (
//                       <React.Fragment key={index}>
//                         <tr>
//                           <td>{leisure.LeisureID}</td>
//                           <td>{leisure.Supplier ? leisure.Supplier.SupplierName : 'N/A'}</td>
//                           <td>{leisure.TransactionType}</td>
//                           <td>{leisure.TransactionID}</td>
//                           <td>{new Date(leisure.TransactionDate).toLocaleDateString()}</td>
//                           <td>{leisure.Credit}</td>
//                           <td>{leisure.Debit}</td>
//                           <td>{leisure.Balance}</td>
//                           <td>
//                             <button
//                               className='btn btn-sm btn-info'
//                               onClick={() => handleRowClick(leisure.LeisureID)}
//                             >
//                               {expandedRow === leisure.LeisureID ? 'Hide Details' : 'Show Details'}
//                             </button>
//                           </td>
//                         </tr>
//                         {expandedRow === leisure.LeisureID && (
//                           <tr>
//                             <td colSpan="9">
//                               <div>
//                                 {leisure.TransactionType === 'PurchaseOrder' && leisure.PurchaseOrder && leisure.PurchaseOrder.length > 0 ? (
//                                   <>
//                                     <table className='table'>
//                                       <thead>
//                                         <tr>
//                                           <th>Product</th>
//                                           <th>Variation</th>
//                                           <th>Quantity</th>
//                                           <th>Unit Price</th>
//                                           <th>Total</th>
//                                         </tr>
//                                       </thead>
//                                       <tbody>
//                                         {leisure.PurchaseOrder.map((detail) => {
//                                           const total = calculateTotal(
//                                             detail.Quantity,
//                                             detail.UnitPrice,
//                                           );
//                                           grandTotal += total;
//                                           return (
//                                             <tr key={detail.PurchaseOrderDetailID}>
//                                               <td>{detail.Product ? detail.Product.ProductName : 'N/A'}</td>
//                                               <td>{detail.ProductVariation ? detail.ProductVariation.SKU : 'N/A'}</td>
//                                               <td>{detail.Quantity}</td>
//                                               <td>{detail.UnitPrice}</td>
//                                               <td>{total.toFixed(2)}</td>
//                                             </tr>
//                                           );
//                                         })}
//                                       </tbody>
//                                     </table>
//                                     <h6>Grand Total: {grandTotal.toFixed(2)}</h6>
//                                   </>
//                                 ) : (
//                                   <div>No purchase order details available</div>
//                                 )}
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SupplierLeisureShow;



// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import jwt_decode from 'jwt-decode';


// function SupplierLeisureShow() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [suppliers, setSuppliers] = useState([]);
//   const [filteredSuppliers, setFilteredSuppliers] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [userRole, setUserRole] = useState('');
//   const token = localStorage.getItem('authToken'); // Fetching the token from localStorage
//  console.log("token",token);
//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   const userRole = localStorage.getItem('userRole');
//   //   console.log(userRole); // Or use your state management
//   //   if (userRole !== 'admin') {
//   //     console.log("Unauthorized");
//   //     setUserRole(userRole);
//   //   }
//   // }, []);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       try {
//         const decoded = jwt_decode(token);
//         console.log('Decoded JWT:', decoded);
//         const role = decoded.role; // Replace 'role' with the actual key in your payload
//         setUserRole(role);
//         if (role !== 'admin') {
//           console.log("Unauthorized");
//           navigate('/homepage'); // Redirect to an unauthorized page or another action
//         }
//       } catch (error) {
//         console.error('Token decoding failed:', error);
//         navigate('/login'); // Redirect to login if the token is invalid
//       }
//     } else {
//       navigate('/login'); // Redirect to login if no token is present
//     }
//   }, [navigate]);
  
//   useEffect(() => {
//     if (userRole === 'admin') {
//       fetchSuppliers();
//     }
//   }, [userRole]);

//   useEffect(() => {
//     if (selectedSupplier && userRole === 'admin') {
//       fetchSupplierLeisureById(selectedSupplier);
//     } else {
//       setData([]);
//     }
//   }, [selectedSupplier, userRole]);

//   const fetchSupplierLeisureById = async (supplierId) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`http://localhost:3001/api/supplierleisure/supplier/${supplierId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       setData(res.data || []);
//     } catch (err) {
//       console.error('Failed to fetch supplier leisure records:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSuppliers = async () => {
//     try {
//       const res = await axios.get('http://localhost:3001/api/suppliers', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       setSuppliers(res.data || []);
//       setFilteredSuppliers(res.data || []);
//     } catch (err) {
//       console.error('Failed to fetch suppliers:', err);
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     const filtered = suppliers.filter(supplier =>
//       supplier.SupplierName.toLowerCase().includes(e.target.value.toLowerCase())
//     );
//     setFilteredSuppliers(filtered);
//   };

//   const handleSupplierSelect = (supplierId) => {
//     setSelectedSupplier(supplierId);
//     const selectedSupplierObj = suppliers.find(supplier => supplier.SupplierID === parseInt(supplierId));
//     setSearchTerm(selectedSupplierObj ? selectedSupplierObj.SupplierName : '');
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

//   const calculateTotal = (quantity, unitPrice) => {
//     return Math.floor((quantity * unitPrice));
//   };

//   if (userRole !== 'admin') {
//     return (
//       <div
//         className='d-flex vh-100 justify-content-center align-items-center'
//         style={{ backgroundColor: '#1d2634' }}
//       >
//         <div className='w-100 w-md-50 bg-white rounded p-3'>
//           <h2>Unauthorized Access</h2>
//           <p>You are unauthorized to view this page. Only admins can access this section.</p>
//           {/* <button className='btn btn-success' onClick={Navigation('/homepage')}>Go Back</button> */}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className='d-flex vh-100 justify-content-center align-items-center'
//       style={{ backgroundColor: '#1d2634' }}
//     >
//       <div className='w-100 w-md-50 bg-white rounded p-3'>
//         <h2>Supplier Leisure List</h2>
//         <div className='mb-3 position-relative'>
//           <input
//             type='text'
//             className='form-control'
//             placeholder='Search Supplier'
//             value={searchTerm}
//             onChange={handleSearchChange}
//             onFocus={handleFocus}
//             onBlur={handleBlur}
//           />
//           {dropdownVisible && filteredSuppliers.length > 0 && (
//             <ul className='list-group position-absolute w-100' style={{ zIndex: 1000, maxHeight: '150px', overflowY: 'auto' }}>
//               {filteredSuppliers.map(supplier => (
//                 <li
//                   key={supplier.SupplierID}
//                   className='list-group-item list-group-item-action'
//                   onMouseDown={() => handleSupplierSelect(supplier.SupplierID.toString())}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {supplier.SupplierName}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
        
//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
//             {data.length === 0 ? (
//               <div>No data available</div>
//             ) : (
//               <table className='table'>
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Supplier Name</th>
//                     <th>Transaction Type</th>
//                     <th>Transaction ID</th>
//                     <th>Transaction Date</th>
//                     <th>Credit</th>
//                     <th>Debit</th>
//                     <th>Balance</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.map((leisure, index) => {
//                     let grandTotal = 0;
//                     return (
//                       <React.Fragment key={index}>
//                         <tr>
//                           <td>{leisure.LeisureID}</td>
//                           <td>{leisure.Supplier ? leisure.Supplier.SupplierName : 'N/A'}</td>
//                           <td>{leisure.TransactionType}</td>
//                           <td>{leisure.TransactionID}</td>
//                           <td>{new Date(leisure.TransactionDate).toLocaleDateString()}</td>
//                           <td>{leisure.Credit}</td>
//                           <td>{leisure.Debit}</td>
//                           <td>{leisure.Balance}</td>
//                           <td>
//                             <button
//                               className='btn btn-sm btn-info'
//                               onClick={() => handleRowClick(leisure.LeisureID)}
//                             >
//                               {expandedRow === leisure.LeisureID ? 'Hide Details' : 'Show Details'}
//                             </button>
//                           </td>
//                         </tr>
//                         {expandedRow === leisure.LeisureID && (
//                           <tr>
//                             <td colSpan="9">
//                               <div>
//                                 {leisure.TransactionType === 'PurchaseOrder' && leisure.PurchaseOrder && leisure.PurchaseOrder.length > 0 ? (
//                                   <>
//                                     <table className='table'>
//                                       <thead>
//                                         <tr>
//                                           <th>Product</th>
//                                           <th>Variation</th>
//                                           <th>Quantity</th>
//                                           <th>Unit Price</th>
//                                           <th>Total</th>
//                                         </tr>
//                                       </thead>
//                                       <tbody>
//                                         {leisure.PurchaseOrder.map((detail) => {
//                                           const total = calculateTotal(
//                                             detail.Quantity,
//                                             detail.UnitPrice,
//                                           );
//                                           grandTotal += total;
//                                           return (
//                                             <tr key={detail.PurchaseOrderDetailID}>
//                                               <td>{detail.Product ? detail.Product.ProductName : 'N/A'}</td>
//                                               <td>{detail.ProductVariation ? detail.ProductVariation.SKU : 'N/A'}</td>
//                                               <td>{detail.Quantity}</td>
//                                               <td>{detail.UnitPrice}</td>
//                                               <td>{total.toFixed(2)}</td>
//                                             </tr>
//                                           );
//                                         })}
//                                       </tbody>
//                                     </table>
//                                     <h6>Grand Total: {grandTotal.toFixed(2)}</h6>
//                                   </>
//                                 ) : (
//                                   <div>No purchase order details available</div>
//                                 )}
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default SupplierLeisureShow;


import React, { useState, useEffect } from 'react';
import { get } from "../../service/apiClient";
import { fetchAllSuppliers } from "../../utils/apiHelpers";

function SupplierLeisureShow() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (selectedSupplier) {
      fetchSupplierLeisureById(selectedSupplier);
    } else {
      setData([]);
    }
  }, [selectedSupplier]);

  const fetchSupplierLeisureById = async (supplierId) => {
    setLoading(true);
    try {
      const res = await get(`/supplierleisure/supplier/${supplierId}`);
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch supplier leisure records:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const list = await fetchAllSuppliers(get);
      setSuppliers(list);
      setFilteredSuppliers(list);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
      setSuppliers([]);
      setFilteredSuppliers([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = suppliers.filter(supplier =>
      supplier.SupplierName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  };

  const handleSupplierSelect = (supplierId) => {
    setSelectedSupplier(supplierId);
    const selectedSupplierObj = suppliers.find(supplier => supplier.SupplierID === parseInt(supplierId));
    setSearchTerm(selectedSupplierObj ? selectedSupplierObj.SupplierName : '');
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

  const calculateTotal = (quantity, unitPrice) => {
    return Math.floor((quantity * unitPrice));
  };

  return (
    <div
      className='d-flex vh-100 justify-content-center align-items-center'
      style={{ backgroundColor: '#1d2634' }}
    >
      <div className='w-100 w-md-50 bg-white rounded p-3'>
        <h2>Supplier Leisure List</h2>
        <div className='mb-3 position-relative'>
          <input
            type='text'
            className='form-control'
            placeholder='Search Supplier'
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {dropdownVisible && filteredSuppliers.length > 0 && (
            <ul className='list-group position-absolute w-100' style={{ zIndex: 1000, maxHeight: '150px', overflowY: 'auto' }}>
              {filteredSuppliers.map(supplier => (
                <li
                  key={supplier.SupplierID}
                  className='list-group-item list-group-item-action'
                  onMouseDown={() => handleSupplierSelect(supplier.SupplierID.toString())}
                  style={{ cursor: 'pointer' }}
                >
                  {supplier.SupplierName}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {data.length === 0 ? (
              <div>No data available</div>
            ) : (
              <table className='table'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Supplier Name</th>
                    <th>Transaction Type</th>
                    <th>Transaction ID</th>
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
                          <td>{leisure.LeisureID}</td>
                          <td>{leisure.Supplier ? leisure.Supplier.SupplierName : 'N/A'}</td>
                          <td>{leisure.TransactionType}</td>
                          <td>{leisure.TransactionID}</td>
                          <td>{new Date(leisure.TransactionDate).toLocaleDateString()}</td>
                          <td>{leisure.Credit}</td>
                          <td>{leisure.Debit}</td>
                          <td>{leisure.Balance}</td>
                          <td>
                            <button
                              className='btn btn-sm btn-info'
                              onClick={() => handleRowClick(leisure.LeisureID)}
                            >
                              {expandedRow === leisure.LeisureID ? 'Hide Details' : 'Show Details'}
                            </button>
                          </td>
                        </tr>
                        {expandedRow === leisure.LeisureID && (
                          <tr>
                            <td colSpan="9">
                              <div>
                                {leisure.TransactionType === 'PurchaseOrder' && leisure.PurchaseOrder && leisure.PurchaseOrder.length > 0 ? (
                                  <>
                                    <table className='table'>
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
                                        {leisure.PurchaseOrder.map((detail) => {
                                          const total = calculateTotal(
                                            detail.Quantity,
                                            detail.UnitPrice,
                                          );
                                          grandTotal += total;
                                          return (
                                            <tr key={detail.PurchaseOrderDetailID}>
                                              <td>{detail.Product ? detail.Product.ProductName : 'N/A'}</td>
                                              <td>{detail.ProductVariation ? detail.ProductVariation.SKU : 'N/A'}</td>
                                              <td>{detail.Quantity}</td>
                                              <td>{detail.UnitPrice}</td>
                                              <td>{total.toFixed(2)}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                    <h6>Grand Total: {grandTotal.toFixed(2)}</h6>
                                  </>
                                ) : (
                                  <div>No purchase order details available</div>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SupplierLeisureShow;
