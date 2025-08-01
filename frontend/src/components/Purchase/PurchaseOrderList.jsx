// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';
// // import './purchaseorder.css';

// function PurchaseOrderlist() {
//   const [data, setData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const pageSize = 10; // Define the number of records per page

//   useEffect(() => {
//     fetchPurchaseOrders(currentPage);
//   }, [currentPage]);

//   const fetchPurchaseOrders = (page) => {
//     setLoading(true);
//     axios.get(`http://localhost:3001/api/purchase-orders?page=${page}&${pageSize}`)
//       .then(res => {
//         setData(res.data.purchaseOrders);
//         setTotalPages(res.data.totalPages);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.log(err);
//         setLoading(false);
//       });
//   };

//   const handleDelete = (PurchaseOrderID) => {
//     axios.delete(`http://localhost:3001/api/purchase-orders/${PurchaseOrderID}`)
//       .then(res => {
//         console.log('Purchase order deleted successfully');
//         fetchPurchaseOrders(currentPage);
//       })
//       .catch(err => console.log(err));
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div
//       className='d-flex vh-100 justify-content-center align-items-center'
//       style={{ backgroundColor: '#1d2634' }}
//     >
//       <div className='w-100 w-md-50 bg-white rounded p-3'>
//         <h2>Purchase Orders List</h2>
//         <div>
//           <Link to={'/purchaseorders/add'} className='btn btn-success'>Add +</Link>
//         </div>
//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           <>
//             <table className='table'>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Supplier Name</th>
//                   <th>Order Date</th>
//                   <th>Total Amount</th>
//                   <th>Amount Paid</th>
//                   <th>Remaining Amount</th>
//                   <th>Payment Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((order, index) => (
//                   <tr key={index}>
//                     <td>{order.PurchaseOrderID}</td>
//                     <td>{order.Supplier ? order.Supplier.SupplierName : 'N/A'}</td>
//                     <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
//                     <td>{order.TotalAmount}</td>
//                     <td>{order.AmountPaid}</td>
//                     <td>{order.RemainingAmount}</td>
//                     <td>{order.PaymentStatus}</td>
//                     <td>
//                       <Link to={`/orderdetail/${order.PurchaseOrderID}`} className='btn btn-sm btn-info'>Read</Link>
//                       <Link to={`/purchaseorders/update/${order.PurchaseOrderID}`} className='btn btn-sm btn-primary mx-2'>Edit</Link>
//                       <button onClick={() => handleDelete(order.PurchaseOrderID)} className='btn btn-sm btn-danger'>Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className='pagination'>
//               {Array.from({ length: totalPages }, (_, index) => (
//                 <button
//                   key={index}
//                   className={`page-link ${currentPage === index + 1 ? 'active' : ''}`}
//                   onClick={() => handlePageChange(index + 1)}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PurchaseOrderlist;




// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';

// function PurchaseOrderlist() {
//   const [data, setData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [suppliers, setSuppliers] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState('');
//   const navigate = useNavigate();
//   const pageSize = 10; // Define the number of records per page

//   useEffect(() => {
//     fetchPurchaseOrders(currentPage, selectedSupplier);
//     fetchSuppliers();
//   }, [currentPage, selectedSupplier]);
 
//   const fetchPurchaseOrders = (page, supplierId) => {
//     setLoading(true);
//     const queryParams = `page=${page}&limit=${pageSize}${supplierId ? `&supplierId=${supplierId}` : ''}`;
//     axios.get(`http://localhost:3001/api/purchase-orders?${queryParams}`)
//       .then(res => {
//         setData(res.data.purchaseOrders);
//         setTotalPages(res.data.totalPages);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.log(err);
//         setLoading(false);
//       });
//   };
  
  

//   const fetchSuppliers = () => {
//     axios.get('http://localhost:3001/api/suppliers')
//       .then(res => {
//         setSuppliers(res.data);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   };

//   const handleDelete = (purchaseOrderId) => {
//     axios.delete(`http://localhost:3001/api/purchase-orders/${purchaseOrderId}`)
//       .then(res => {
//         console.log('Purchase order deleted successfully');
//         fetchPurchaseOrders(currentPage, selectedSupplier);
//       })
//       .catch(err => console.log(err));
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleSupplierChange = (event) => {
//     setSelectedSupplier(event.target.value);
//   };

//   return (
//     <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#1d2634' }}>
//       <div className='w-100 w-md-50 bg-white rounded p-3'>
//         <h2>Purchase Orders List</h2>
//         <div className='mb-3'>
//           <select
//             className='form-select'
//             value={selectedSupplier}
//             onChange={handleSupplierChange}
//           >
//             <option value=''>Select Supplier</option>
//             {suppliers.map(supplier => (
//               <option key={supplier.SupplierID} value={supplier.SupplierID}>
//                 {supplier.SupplierName}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <Link to={'/purchaseorders/add'} className='btn btn-success'>Add +</Link>
//         </div>
//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           <>
//             <table className='table'>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Supplier Name</th>
//                   <th>Order Date</th>
//                   <th>Total Amount</th>
//                   <th>Amount Paid</th>
//                   <th>Remaining Amount</th>
//                   <th>Payment Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((order, index) => (
//                   <tr key={index}>
//                     <td>{order.PurchaseOrderID}</td>
//                     <td>{order.Supplier ? order.Supplier.SupplierName : 'N/A'}</td>
//                     <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
//                     <td>{order.TotalAmount}</td>
//                     <td>{order.AmountPaid}</td>
//                     <td>{order.RemainingAmount}</td>
//                     <td>{order.PaymentStatus}</td>
//                     <td>
//                       <Link to={`/orderdetail/${order.PurchaseOrderID}`} className='btn btn-sm btn-info'>Read</Link>
//                       <Link to={`/purchaseorders/update/${order.PurchaseOrderID}`} className='btn btn-sm btn-primary mx-2'>Edit</Link>
//                       <button onClick={() => handleDelete(order.PurchaseOrderID)} className='btn btn-sm btn-danger'>Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className='pagination'>
//               {Array.from({ length: totalPages }, (_, index) => (
//                 <button
//                   key={index}
//                   className={`page-link ${currentPage === index + 1 ? 'active' : ''}`}
//                   onClick={() => handlePageChange(index + 1)}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PurchaseOrderlist;


// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// function PurchaseOrderlist() {
//   const [data, setData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [suppliers, setSuppliers] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState('');
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const navigate = useNavigate();
//   const pageSize = 7; // Define the number of records per page

//   useEffect(() => {
//     fetchPurchaseOrders(currentPage, selectedSupplier, startDate, endDate);
//     fetchSuppliers();
//   }, [currentPage, selectedSupplier, startDate, endDate]);

//   const fetchPurchaseOrders = (page, supplierId, start, end) => {
//     setLoading(true);
//     let queryParams = `page=${page}&pageSize=${pageSize}`;
//     if (supplierId) queryParams += `&supplierId=${supplierId}`;
//     if (start) queryParams += `&startDate=${start.toISOString()}`;
//     if (end) queryParams += `&endDate=${end.toISOString()}`;
//       console.log(queryParams)
//     axios.get(`http://localhost:3001/api/purchase-orders?${queryParams}`)
//       .then(res => {

//         setData(res.data.purchaseOrders);
//         setTotalPages(res.data.totalPages);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.log(err);
//         setLoading(false);
//       });
//   };

//   const fetchSuppliers = () => {
//     axios.get('http://localhost:3001/api/suppliers')
//       .then(res => {
//         setSuppliers(res.data);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   };

//   const handleDelete = (purchaseOrderId) => {
//     axios.delete(`http://localhost:3001/api/purchase-orders/${purchaseOrderId}`)
//       .then(res => {
//         console.log('Purchase order deleted successfully');
//         fetchPurchaseOrders(currentPage, selectedSupplier, startDate, endDate);
//       })
//       .catch(err => console.log(err));
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleSupplierChange = (event) => {
//     setSelectedSupplier(event.target.value);
//   };

//   const handleStartDateChange = (date) => {
//     setStartDate(date);
//   };

//   const handleEndDateChange = (date) => {
//     setEndDate(date);
//   };

//   const clearFilters = () => {
//     setSelectedSupplier('');
//     setStartDate(null);
//     setEndDate(null);
//   };

//   return (
//     <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#1d2634' }}>
//       <div className='w-100 w-md-75 bg-white rounded p-3'>
//         <h2 className='mb-4'>Purchase Orders List</h2>
//         <div className='row mb-3'>
//           <div className='col-md-3'>
//             <select
//               className='form-select'
//               value={selectedSupplier}
//               onChange={handleSupplierChange}
//             >
//               <option value=''>Select Supplier</option>
//               {suppliers.map(supplier => (
//                 <option key={supplier.SupplierID} value={supplier.SupplierID}>
//                   {supplier.SupplierName}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className='col-md-3'>
//             <DatePicker
//               selected={startDate}
//               onChange={handleStartDateChange}
//               className='form-control'
//               placeholderText='Start Date'
//               dateFormat='yyyy-MM-dd'
//             />
//           </div>
//           <div className='col-md-3'>
//             <DatePicker
//               selected={endDate}
//               onChange={handleEndDateChange}
//               className='form-control'
//               placeholderText='End Date'
//               dateFormat='yyyy-MM-dd'
//             />
//           </div>
//           <div className='col-md-3'>
//             <button className='btn btn-secondary mx-2' onClick={() => fetchPurchaseOrders(1, selectedSupplier, startDate, endDate)}>Apply Filters</button>
//             <button className='btn btn-outline-secondary' onClick={clearFilters}>Clear Filters</button>
//           </div>
//         </div>
//         <div>
//           <Link to={'/purchaseorders/add'} className='btn btn-success'>Add +</Link>
//         </div>
//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           <>
//             <table className='table mt-4'>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Supplier Name</th>
//                   <th>Order Date</th>
//                   <th>Total Amount</th>
//                   <th>Amount Paid</th>
//                   <th>Remaining Amount</th>
//                   <th>Payment Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((order, index) => (
//                   <tr key={index}>
//                     <td>{order.PurchaseOrderID}</td>
//                     <td>{order.Supplier ? order.Supplier.SupplierName : 'N/A'}</td>
//                     <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
//                     <td>{order.TotalAmount}</td>
//                     <td>{order.AmountPaid}</td>
//                     <td>{order.RemainingAmount}</td>
//                     <td>{order.PaymentStatus}</td>
//                     <td>
//                       <Link to={`/orderdetail/${order.PurchaseOrderID}`} className='btn btn-sm btn-info'>Read</Link>
//                       <Link to={`/purchaseorders/update/${order.PurchaseOrderID}`} className='btn btn-sm btn-primary mx-2'>Edit</Link>
//                       <button onClick={() => handleDelete(order.PurchaseOrderID)} className='btn btn-sm btn-danger'>Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className='pagination'>
//               {Array.from({ length: totalPages }, (_, index) => (
//                 <button
//                   key={index}
//                   className={`page-link ${currentPage === index + 1 ? 'active' : ''}`}
//                   onClick={() => handlePageChange(index + 1)}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PurchaseOrderlist;


import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function PurchaseOrderlist() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const pageSize = 7; // Define the number of records per page

  useEffect(() => {
    fetchPurchaseOrders(currentPage, selectedSupplier, startDate, endDate);
    fetchSuppliers();
  }, [currentPage, selectedSupplier, startDate, endDate]);

  const fetchPurchaseOrders = (page, supplierId, start, end) => {
    setLoading(true);
    let queryParams = `page=${page}&pageSize=${pageSize}`;
    if (supplierId) queryParams += `&supplierId=${supplierId}`;
    if (start) queryParams += `&startDate=${start.toISOString()}`;
    if (end) queryParams += `&endDate=${end.toISOString()}`;
    console.log(queryParams);
    axios.get(`http://localhost:3001/api/purchase-orders?${queryParams}`)
      .then(res => {
        setData(res.data.purchaseOrders);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const fetchSuppliers = () => {
    axios.get('http://localhost:3001/api/suppliers')
      .then(res => {
        setSuppliers(res.data.suppliers || []);
      })
      .catch(err => {
        console.log(err);
        setSuppliers([]);
      });
  };

  const handleDelete = (purchaseOrderId) => {
    axios.delete(`http://localhost:3001/api/purchase-orders/${purchaseOrderId}`)
      .then(res => {
        console.log('Purchase order deleted successfully');
        fetchPurchaseOrders(currentPage, selectedSupplier, startDate, endDate);
      })
      .catch(err => console.log(err));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSupplierChange = (event) => {
    setSelectedSupplier(event.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const clearFilters = () => {
    setSelectedSupplier('');
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#1d2634' }}>
      <div className='w-100 w-md-75 bg-white rounded p-3'>
        <h2 className='mb-4'>Purchase Orders List</h2>
        <div className='row mb-3'>
          <div className='col-12 col-md-3 mb-2 mb-md-0'>
            <select
              className='form-select'
              value={selectedSupplier}
              onChange={handleSupplierChange}
            >
              <option value=''>Select Supplier</option>
              {Array.isArray(suppliers) && suppliers.map(supplier => (
                <option key={supplier.SupplierID} value={supplier.SupplierID}>
                  {supplier.SupplierName}
                </option>
              ))}
            </select>
          </div>
          <div className='col-12 col-md-3 mb-2 mb-md-0'>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              className='form-control'
              placeholderText='Start Date'
              dateFormat='yyyy-MM-dd'
            />
          </div>
          <div className='col-12 col-md-3 mb-2 mb-md-0'>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              className='form-control'
              placeholderText='End Date'
              dateFormat='yyyy-MM-dd'
            />
          </div>
          <div className='col-12 col-md-3 d-flex flex-column flex-md-row justify-content-between'>
            <button className='btn btn-secondary mb-2 mb-md-0' onClick={() => fetchPurchaseOrders(1, selectedSupplier, startDate, endDate)}>Apply Filters</button>
            <button className='btn btn-outline-secondary' onClick={clearFilters}>Clear Filters</button>
          </div>
        </div>
        <div>
          <Link to={'/purchaseorders/add'} className='btn btn-success'>Add +</Link>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <table className='table mt-4'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Supplier Name</th>
                  <th>Order Date</th>
                  <th>Total Amount</th>
                  <th>Amount Paid</th>
                  <th>Remaining Amount</th>
                  <th>Payment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((order, index) => (
                  <tr key={index}>
                    <td>{order.PurchaseOrderID}</td>
                    <td>{order.Supplier ? order.Supplier.SupplierName : 'N/A'}</td>
                    <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                    <td>{order.TotalAmount}</td>
                    <td>{order.AmountPaid}</td>
                    <td>{order.RemainingAmount}</td>
                    <td>{order.PaymentStatus}</td>
                    <td>
                      <Link to={`/orderdetail/${order.PurchaseOrderID}`} className='btn btn-sm btn-info'>Read</Link>
                      <Link to={`/purchaseorders/update/${order.PurchaseOrderID}`} className='btn btn-sm btn-primary mx-2'>Edit</Link>
                      <button onClick={() => handleDelete(order.PurchaseOrderID)} className='btn btn-sm btn-danger'>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='pagination'>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`page-link ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PurchaseOrderlist;
