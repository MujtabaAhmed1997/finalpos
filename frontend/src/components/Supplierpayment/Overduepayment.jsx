// // // // // // // src/components/OverdueCustomers.js
// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import axios from 'axios';

// // // // // // const OverdueCustomers = () => {
// // // // // //   const [customers, setCustomers] = useState([]);

// // // // // //   useEffect(() => {
// // // // // //     const fetchOverdueCustomers = async () => {
// // // // // //       try {
// // // // // //         const response = await axios.get('http://localhost:3001/api/overdue');
// // // // // //         setCustomers(response.data);
// // // // // //       } catch (error) {
// // // // // //         console.error('Error fetching overdue customers:', error);
// // // // // //       }
// // // // // //     };

// // // // // //     fetchOverdueCustomers();
// // // // // //   }, []);

// // // // // //   return (
// // // // // //     <div>
// // // // // //       <h2>Overdue Customers</h2>
// // // // // //       <table>
// // // // // //         <thead>
// // // // // //           <tr>
// // // // // //             <th>Customer ID</th>
// // // // // //             <th>Customer Name</th>
// // // // // //             <th>Phone Number</th>
// // // // // //           </tr>
// // // // // //         </thead>
// // // // // //         <tbody>
// // // // // //           {customers.map((customer) => (
// // // // // //             <tr key={customer.CustomerID}>
// // // // // //               <td>{customer.CustomerID}</td>
// // // // // //               <td>{customer.CustomerName}</td>
// // // // // //               <td>{customer.PhoneNumber}</td>
// // // // // //             </tr>
// // // // // //           ))}
// // // // // //         </tbody>
// // // // // //       </table>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default OverdueCustomers;

// // // // // import React, { useState, useEffect } from 'react';
// // // // // import axios from 'axios';

// // // // // const Overduepayment = () => {
// // // // //   const [customers, setCustomers] = useState([]);
// // // // //   const [error, setError] = useState('');

// // // // //   useEffect(() => {
// // // // //     const fetchOverdueCustomers = async () => {
// // // // //       try {
// // // // //         const response = await axios.get('http://localhost:3001/api/overdue');
// // // // //         console.log('Response data:', response.data); // Log the response data

// // // // //         if (Array.isArray(response.data)) {
// // // // //           setCustomers(response.data);
// // // // //         } else {
// // // // //           console.error('Unexpected response format', response.data);
// // // // //           setError('Unexpected response format');
// // // // //         }
// // // // //       } catch (error) {
// // // // //         console.error('Error fetching overdue customers:', error);
// // // // //         setError('Error fetching overdue customers');
// // // // //       }
// // // // //     };

// // // // //     fetchOverdueCustomers();
// // // // //   }, []);

// // // // //   return (
// // // // //     <div>
// // // // //       <h2>Overdue Customers</h2>
// // // // //       {error && <p>{error}</p>}
// // // // //       <table>
// // // // //         <thead>
// // // // //           <tr>
// // // // //             <th>Customer ID</th>
// // // // //             <th>Customer Name</th>
// // // // //             <th>Phone Number</th>
// // // // //           </tr>
// // // // //         </thead>
// // // // //         <tbody>
// // // // //           {customers.length > 0 ? (
// // // // //             customers.map((customer) => (
// // // // //               <tr key={customer.CustomerID}>
// // // // //                 <td>{customer.CustomerID}</td>
// // // // //                 <td>{customer.CustomerName}</td>
// // // // //                 <td>{customer.Phone}</td>
// // // // //               </tr>
// // // // //             ))
// // // // //           ) : (
// // // // //             <tr>
// // // // //               <td colSpan="3">No overdue customers found</td>
// // // // //             </tr>
// // // // //           )}
// // // // //         </tbody>
// // // // //       </table>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default Overduepayment;

// // // // import React, { useState, useEffect } from 'react';
// // // // import axios from 'axios';
// // // // import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

// // // // const Overduepayment = () => {
// // // //   const [customers, setCustomers] = useState([]);
// // // //   const [error, setError] = useState('');

// // // //   useEffect(() => {
// // // //     const fetchOverdueCustomers = async () => {
// // // //       try {
// // // //         const response = await axios.get('http://localhost:3001/api/overdue');
// // // //         console.log('Response data:', response.data); // Log the response data

// // // //         if (Array.isArray(response.data)) {
// // // //           setCustomers(response.data);
// // // //         } else {
// // // //           console.error('Unexpected response format', response.data);
// // // //           setError('Unexpected response format');
// // // //         }
// // // //       } catch (error) {
// // // //         console.error('Error fetching overdue customers:', error);
// // // //         setError('Error fetching overdue customers');
// // // //       }
// // // //     };

// // // //     fetchOverdueCustomers();
// // // //   }, []);

// // // //   return (
// // // //     <div className="container mt-5">
// // // //       <h2 className="text-center mb-4">Overdue Customers</h2>
// // // //       {error && <p className="text-danger text-center">{error}</p>}
// // // //       <div className="table-responsive">
// // // //         <table className="table table-bordered table-striped">
// // // //           <thead className="thead-dark">
// // // //             <tr>
// // // //               <th>Customer ID</th>
// // // //               <th>Customer Name</th>
// // // //               <th>Phone Number</th>
// // // //             </tr>
// // // //           </thead>
// // // //           <tbody>
// // // //             {customers.length > 0 ? (
// // // //               customers.map((customer) => (
// // // //                 <tr key={customer.CustomerID}>
// // // //                   <td>{customer.CustomerID}</td>
// // // //                   <td>{customer.CustomerName}</td>
// // // //                   <td>{customer.Phone}</td>
// // // //                 </tr>
// // // //               ))
// // // //             ) : (
// // // //               <tr>
// // // //                 <td colSpan="3" className="text-center">No overdue customers found</td>
// // // //               </tr>
// // // //             )}
// // // //           </tbody>
// // // //         </table>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Overduepayment;

// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';
// // // import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

// // // const Overduepayment = () => {
// // //   const [customers, setCustomers] = useState([]);
// // //   const [error, setError] = useState('');

// // //   useEffect(() => {
// // //     const fetchOverdueCustomers = async () => {
// // //       try {
// // //         const response = await axios.get('http://localhost:3001/api/overdue');
// // //         console.log('Response data:', response.data); // Log the response data

// // //         if (Array.isArray(response.data)) {
// // //           setCustomers(response.data);
// // //         } else {
// // //           console.error('Unexpected response format', response.data);
// // //           setError('Unexpected response format');
// // //         }
// // //       } catch (error) {
// // //         console.error('Error fetching overdue customers:', error);
// // //         setError('Error fetching overdue customers');
// // //       }
// // //     };

// // //     fetchOverdueCustomers();
// // //   }, []);

// // //   return (
// // //     <div className="container mt-5">
// // //       <h2 className="text-center mb-4">Overdue Customers</h2>
// // //       {error && <p className="text-danger text-center">{error}</p>}
// // //       <div className="table-responsive">
// // //         <table className="table table-bordered table-striped">
// // //           <thead className="thead-dark">
// // //             <tr>
// // //               <th>Customer ID</th>
// // //               <th>Customer Name</th>
// // //               <th>Phone Number</th>
// // //               <th>Payment Dates</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {customers.length > 0 ? (
// // //               customers.map((customer) => (
// // //                 <tr key={customer.CustomerID}>
// // //                   <td>{customer.CustomerID}</td>
// // //                   <td>{customer.CustomerName}</td>
// // //                   <td>{customer.Phone}</td>
// // //                   <td>
// // //                     {customer.CustomerPayments && customer.CustomerPayments.length > 0
// // //                       ? customer.CustomerPayments.map(payment => (
// // //                           <div key={payment.PaymentID}>{new Date(payment.PaymentDate).toLocaleDateString()}</div>
// // //                         ))
// // //                       : 'No payments made'}
// // //                   </td>
// // //                 </tr>
// // //               ))
// // //             ) : (
// // //               <tr>
// // //                 <td colSpan="4" className="text-center">No overdue customers found</td>
// // //               </tr>
// // //             )}
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Overduepayment;

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

// // const Overduepayment = () => {
// //   const [customers, setCustomers] = useState([]);
// //   const [error, setError] = useState('');

// //   useEffect(() => {
// //     const fetchOverdueCustomers = async () => {
// //       try {
// //         const response = await axios.get('http://localhost:3001/api/overdue');
// //         console.log('Response data:', response.data); // Log the response data

// //         if (Array.isArray(response.data)) {
// //           setCustomers(response.data);
// //         } else {
// //           console.error('Unexpected response format', response.data);
// //           setError('Unexpected response format');
// //         }
// //       } catch (error) {
// //         console.error('Error fetching overdue customers:', error);
// //         setError('Error fetching overdue customers');
// //       }
// //     };

// //     fetchOverdueCustomers();
// //   }, []);

// //   const getLastPaymentDate = (payments) => {
// //     if (payments && payments.length > 0) {
// //       const sortedPayments = payments.sort((a, b) => new Date(b.PaymentDate) - new Date(a.PaymentDate));
// //       console.log(sortedPayments);
// //       const lastdate=new Date(sortedPayments[0].PaymentDate).toLocaleDateString();
// //       console.log("LAsr",lastdate);
// //       return new Date(sortedPayments[0].PaymentDate).toLocaleDateString();
// //     }
// //     // return `No payments made`;
// //   };

// //   return (
// //     <div className="container mt-5">
// //       <h2 className="text-center mb-4">Overdue Customers</h2>
// //       {error && <p className="text-danger text-center">{error}</p>}
// //       <div className="table-responsive">
// //         <table className="table table-bordered table-striped">
// //           <thead className="thead-dark">
// //             <tr>
// //               <th>Customer ID</th>
// //               <th>Customer Name</th>
// //               <th>Phone Number</th>
// //               <th>Last Payment Date</th>
// // ]
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {customers.length > 0 ? (
// //               customers.map((customer) => (
// //                 <tr key={customer.CustomerID}>
// //                   <td>{customer.CustomerID}</td>
// //                   <td>{customer.CustomerName}</td>
// //                   <td>{customer.Phone}</td>

// //                   <td>{getLastPaymentDate(customer.CustomerPayments)}</td>
// //                 </tr>
// //               ))
// //             ) : (
// //               <tr>
// //                 <td colSpan="4" className="text-center">No overdue customers found</td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Overduepayment;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Overduepayment = () => {
//   const [customers, setCustomers] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchOverdueCustomers = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/overdue');
//         console.log('Response data:', response.data); // Log the response data

//         if (Array.isArray(response.data)) {
//           setCustomers(response.data);
//         } else {
//           console.error('Unexpected response format', response.data);
//           setError('Unexpected response format');
//         }
//       } catch (error) {
//         console.error('Error fetching overdue customers:', error);
//         setError('Error fetching overdue customers');
//       }
//     };

//     fetchOverdueCustomers();
//   }, []);

//   // Function to get the last payment date from an array of payments
// //   const getLastPaymentDate = (payments) => {
// //     if (Array.isArray(payments) && payments.length > 0) {
// //       try {
// //         // Ensure all PaymentDate values are valid
// //         payments.forEach(payment => {
// //           if (isNaN(new Date(payment.PaymentDate).getTime())) {
// //             console.error('Invalid PaymentDate found:', payment.PaymentDate);
// //           }
// //         });

// //         // Sort payments by PaymentDate in descending order
// //         const sortedPayments = payments.sort((a, b) => new Date(b.PaymentDate) - new Date(a.PaymentDate));
// //         console.log('Sorted Payments:', sortedPayments);

// //         // Get the last payment date
// //         const lastDate = new Date(sortedPayments[0].PaymentDate).toLocaleDateString();
// //         console.log('Last Payment Date:', lastDate);

// //         return lastDate;
// //       } catch (error) {
// //         console.error('Error getting last payment date:', error);
// //         return 'Error';
// //       }
// //     } else {
// //       console.log('No payments made');
// //       return 'No payments made';
// //     }
// //   };

// const getLastPaymentDate = (payments) => {
//     console.log('Payments received:', payments); // Log payments array

//     if (Array.isArray(payments) && payments.length > 0) {
//       try {
//         // Ensure all PaymentDate values are valid
//         payments.forEach(payment => {
//           console.log('PaymentDate:', payment.PaymentDate);
//           if (isNaN(new Date(payment.PaymentDate).getTime())) {
//             console.error('Invalid PaymentDate found:', payment.PaymentDate);
//           }
//         });

//         // Sort payments by PaymentDate in descending order
//         const sortedPayments = payments.sort((a, b) => new Date(b.PaymentDate) - new Date(a.PaymentDate));
//         console.log('Sorted Payments:', sortedPayments);

//         // Get the last payment date
//         const lastDate = new Date(sortedPayments[0].PaymentDate).toLocaleDateString();
//         console.log('Last Payment Date:', lastDate);

//         return lastDate;
//       } catch (error) {
//         console.error('Error getting last payment date:', error);
//         return 'Error';
//       }
//     } else {
//       console.log('No payments made');
//       return 'No payments made';
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4">Overdue Customers</h2>
//       {error && <p className="text-danger text-center">{error}</p>}
//       <div className="table-responsive">
//         <table className="table table-bordered table-striped">
//           <thead>
//             <tr>
//               <th>Customer ID</th>
//               <th>Customer Name</th>
//               <th>Phone Number</th>
//               <th>Last Payment Date</th>
//               <th>Payment Date</th>
//               <th>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.length > 0 ? (
//               customers.map((customer) => (
//                 <React.Fragment key={customer.CustomerID}>
//                   {customer.CustomerPayments && customer.CustomerPayments.length > 0 ? (
//                     customer.CustomerPayments.map((payment, index) => (
//                       <tr key={`${customer.CustomerID}-${index}`}>
//                         <td>{index === 0 ? customer.CustomerID : ''}</td>
//                         <td>{index === 0 ? customer.CustomerName : ''}</td>
//                         <td>{index === 0 ? customer.Phone : ''}</td>
//                         <td>{index === 0 ? getLastPaymentDate(customer.CustomerPayments) : ''}</td>
//                         <td>{new Date(payment.PaymentDate).toLocaleDateString()}</td>
//                         <td>{payment.Amount}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr key={customer.CustomerID}>
//                       <td>{customer.CustomerID}</td>
//                       <td>{customer.CustomerName}</td>
//                       <td>{customer.Phone}</td>
//                       <td>{getLastPaymentDate(customer.CustomerPayments)}</td>
//                       <td colSpan="2" className="text-center">No payments made</td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="text-center">No overdue customers found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Overduepayment;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Overduepayment = () => {
//   const [customers, setCustomers] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchOverdueCustomers = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/overdue');
//         console.log('Response data:', response.data); // Log the response data

//         if (Array.isArray(response.data)) {
//           setCustomers(response.data);
//         } else {
//           console.error('Unexpected response format', response.data);
//           setError('Unexpected response format');
//         }
//       } catch (error) {
//         console.error('Error fetching overdue customers:', error);
//         setError('Error fetching overdue customers');
//       }
//     };

//     fetchOverdueCustomers();
//   }, []);

//   const getLastPaymentDate = (payments) => {
//     console.log('Payments received:', payments); // Log payments array

//     if (Array.isArray(payments) && payments.length > 0) {
//       try {
//         // Ensure all PaymentDate values are valid
//         payments.forEach(payment => {
//           console.log('PaymentDate:', payment.PaymentDate);
//           if (isNaN(new Date(payment.PaymentDate).getTime())) {
//             console.error('Invalid PaymentDate found:', payment.PaymentDate);
//           }
//         });

//         // Sort payments by PaymentDate in descending order
//         const sortedPayments = payments.sort((a, b) => new Date(b.PaymentDate) - new Date(a.PaymentDate));
//         console.log('Sorted Payments:', sortedPayments);

//         // Get the last payment date
//         const lastDate = new Date(sortedPayments[0].PaymentDate).toLocaleDateString();
//         console.log('Last Payment Date:', lastDate);

//         return lastDate;
//       } catch (error) {
//         console.error('Error getting last payment date:', error);
//         return 'Error';
//       }
//     } else {
//       console.log('No payments made');
//       return 'No payments made';
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2 className="text-center">Overdue Customers</h2>
//       {error && <p className="text-danger">{error}</p>}
//       <table className="table table-bordered table-striped table-responsive">
//         <thead>
//           <tr>
//             <th>Customer ID</th>
//             <th>Customer Name</th>
//             <th>Phone Number</th>
//             <th>Last Payment Date</th>
//             <th>Payment Date</th>
//             <th>Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           {customers.length > 0 ? (
//             customers.map((customer) => (
//               <React.Fragment key={customer.CustomerID}>
//                 {customer.CustomerPayments && Array.isArray(customer.CustomerPayments) && customer.CustomerPayments.length > 0 ? (
//                   customer.CustomerPayments.map((payment, index) => (
//                     <tr key={`${customer.CustomerID}-${index}`}>
//                       <td>{index === 0 ? customer.CustomerID : ''}</td>
//                       <td>{index === 0 ? customer.CustomerName : ''}</td>
//                       <td>{index === 0 ? customer.Phone : ''}</td>
//                       <td>{index === 0 ? getLastPaymentDate(customer.CustomerPayments) : ''}</td>
//                       <td>{new Date(payment.PaymentDate).toLocaleDateString()}</td>
//                       <td>{payment.Amount}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr key={customer.CustomerID}>
//                     <td>{customer.CustomerID}</td>
//                     <td>{customer.CustomerName}</td>
//                     <td>{customer.Phone}</td>
//                     <td>{getLastPaymentDate(customer.CustomerPayments)}</td>
//                     <td colSpan="2" className="text-center">No payments made</td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" className="text-center">No overdue customers found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Overduepayment;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Overduepayment = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverdueCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/overdue");
        console.log("Response data:", response.data);

        if (Array.isArray(response.data)) {
          setCustomers(response.data);
        } else {
          console.error("Unexpected response format", response.data);
          setError("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching overdue customers:", error);
        setError("Error fetching overdue customers");
      }
    };

    fetchOverdueCustomers();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Late Payment Customers</h2>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-bordered table-striped table-responsive">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Phone Number</th>

            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.CustomerID}>
                <td>{customer.CustomerID}</td>
                <td>{customer.CustomerName}</td>
                <td>{customer.Phone}</td>
                <td>
                  <Link
                    to={`/customerpayment/${customer.CustomerID}`}
                    className="btn btn-sm btn-info"
                  >
                    Payments Made
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No overdue customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Overduepayment;
