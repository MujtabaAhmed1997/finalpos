// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { validateSalesOrder } from '../../controllers/salesvalidator'; // Adjust the import path as needed
// import AddSalesOrderDetail from './Salesorderdetail';
// function UpdateSalesOrderForm() {
//   const { id } = useParams(); // Get SalesOrderID from URL
//   const [values, setValues] = useState({
//     CustomerID: '',
//     OrderDate: '',
//     TotalAmount: 0,
//     AmountPaid: 0,
//     RemainingAmount: 0,
//     PaymentStatus: 'Pending'
//   });
//   const [customers, setCustomers] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get(`http://localhost:3001/api/sales-orders/${id}`)
//       .then(res => {
//         setValues(res.data);
//         fetchSalesOrderDetails(res.data.SalesOrderID);
//       })
//       .catch(err => {
//         console.error('Error fetching sales order:', err);
//       });
//   }, [id]);

//   useEffect(() => {
//     axios.get('http://localhost:3001/api/customers')
//       .then(res => {
//         setCustomers(res.data);
//       })
//       .catch(err => {
//         console.error('Error fetching customers:', err);
//       });
//   }, []);

//   const fetchSalesOrderDetails = (salesOrderId) => {
//     axios.get(`http://localhost:3001/api/salesordersdetails/salesOrder/${salesOrderId}/total`)
//       .then(res => {
//         const total = res.data.total;
//         console.log('Sales order details:', total); // Log the details to see what is returned
//         // const details = detailsResponse.salesOrderDetails; // Access the salesOrderDetails array
//         // if (Array.isArray(details)) {
//           //  const totalAmount = details.reduce((sum, detail) => sum + (detail.Quantity * detail.UnitPrice-detail.Discount), 0);
//           // const totalAmount = details.reduce((sum, detail) => sum + (detail.Quantity *( detail.UnitPrice - detail.Discount)), 0);
//           //  console.log(totalAmount);
//           const totalAmount=total;
//           setValues(prev => ({
//             ...prev,
//             TotalAmount: totalAmount,
//             RemainingAmount: totalAmount - prev.AmountPaid
//           }));
//         // } else {
//         //   console.error('Expected an array but got:', details);
//         // }
//       })
//       .catch(err => {
//         console.error('Error fetching sales order details:', err);
//       });
//   };

//   const handleInput = (event) => {
//     const { name, value } = event.target;
//     setValues(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   useEffect(() => {
//     if (isSubmitting) {
//       setErrors(validateSalesOrder(values));
//     }
//   }, [values, isSubmitting]);

//   // Update RemainingAmount dynamically
//   useEffect(() => {
//     setValues(prev => ({
//       ...prev,
//       RemainingAmount: prev.TotalAmount - prev.AmountPaid
//     }));
//   }, [values.TotalAmount, values.AmountPaid]);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const validationErrors = validateSalesOrder(values);
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       setIsSubmitting(true);
//       axios.put(`http://localhost:3001/api/sales-orders/${id}`, values)
//         .then(res => {
//           navigate(`/salesorder/show`);
//           console.log(res);
//         })
//         .catch(err => {
//           console.error('Error updating sales order:', err);
//         })
//         .finally(() => {
//           setIsSubmitting(false);
//         });
//     }
//   };




//   return (

    

//     <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>

//       <div className='w-50 bg-white rounded p-3'>
//         <h2>Update Sales Order</h2>
//         <form onSubmit={handleSubmit}>
//           <div className='mb-3'>
//             <label htmlFor='CustomerID'><strong>Customer</strong></label>
//             <select
//               onChange={handleInput}
//               className='form-control rounded-0'
//               name='CustomerID'
//               value={values.CustomerID}
//             >
//               <option value="">Select a Customer</option>
//               {customers.map(customer => (
//                 <option key={customer.CustomerID} value={customer.CustomerID}>
//                   {customer.CustomerName}
//                 </option>
//               ))}
//             </select>
//             {errors.CustomerID && <span className='text-danger'>{errors.CustomerID}</span>}
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='OrderDate'><strong>Order Date</strong></label>
//             <input
//               onChange={handleInput}
//               type='date'
//               className='form-control rounded-0'
//               name='OrderDate'
//               value={values.OrderDate}
//             />
//             {errors.OrderDate && <span className='text-danger'>{errors.OrderDate}</span>}
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='TotalAmount'><strong>Total Amount</strong></label>
//             <input
//               onChange={handleInput}
//               type='number'
//               className='form-control rounded-0'
//               name='TotalAmount'
//               value={values.TotalAmount}
//               readOnly
//             />
//             {errors.TotalAmount && <span className='text-danger'>{errors.TotalAmount}</span>}
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='AmountPaid'><strong>Amount Paid</strong></label>
//             <input
//               onChange={handleInput}
//               type='number'
//               className='form-control rounded-0'
//               name='AmountPaid'
//               value={values.AmountPaid}
//             />
//             {errors.AmountPaid && <span className='text-danger'>{errors.AmountPaid}</span>}
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='RemainingAmount'><strong>Remaining Amount</strong></label>
//             <input
//               onChange={handleInput}
//               type='number'
//               className='form-control rounded-0'
//               name='RemainingAmount'
//               value={values.TotalAmount - values.AmountPaid}
//               readOnly
//             />
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='PaymentStatus'><strong>Payment Status</strong></label>
//             <select
//               onChange={handleInput}
//               className='form-control rounded-0'
//               name='PaymentStatus'
//               value={values.PaymentStatus}
//             >
//               <option value="">Select Status</option>
//               <option value="Paid">Paid</option>
//               <option value="Pending">Pending</option>
//               <option value="Partial">Partial</option>
//               <option value="Advance">Advance</option>
//             </select>
//             {errors.PaymentStatus && <span className='text-danger'>{errors.PaymentStatus}</span>}
//           </div>
//           <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
//             {isSubmitting ? 'Updating...' : 'Update Sales Order'}
//           </button>
//           <Link className='btn btn-secondary w-100 rounded-0' to={`/customerpayment/add/${id}`}>Proceed To Payment</Link>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default UpdateSalesOrderForm;




import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { validateSalesOrder } from '../../controllers/salesvalidator'; // Adjust the import path as needed

function UpdateSalesOrderForm() {
  const { id } = useParams(); // Get SalesOrderID from URL
  const [values, setValues] = useState({
    CustomerID: '',
    OrderDate: '',
    TotalAmount: 0,
    AmountPaid: 0,
    RemainingAmount: 0,
    PaymentStatus: 'Pending'
  });
  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/api/sales-orders/${id}`)
      .then(res => {
        setValues(prev => ({
          ...prev,
          ...res.data
        }));
        fetchSalesOrderDetails(res.data.SalesOrderID);
        // fetchTotalAmountPaid(res.data.SalesOrderID);
      })
      .catch(err => {
        console.error('Error fetching sales order:', err);
      });
  }, [id]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/customers')
      .then(res => {
        setCustomers(res.data);
      })
      .catch(err => {
        console.error('Error fetching customers:', err);
      });
  }, []);

  const fetchSalesOrderDetails = (salesOrderId) => {
    axios.get(`http://localhost:3001/api/salesordersdetails/salesOrder/${salesOrderId}/total`)
      .then(res => {
        const totalAmount = res.data.total;
        setValues(prev => ({
          ...prev,
          TotalAmount: totalAmount,
          RemainingAmount: totalAmount - prev.AmountPaid
        }));
      })
      .catch(err => {
        console.error('Error fetching sales order details:', err);
      });
  };

  // const fetchTotalAmountPaid = (salesOrderId) => {
  //   axios.get(`http://localhost:3001/api/customerpayments/total/${salesOrderId}`)
  //     .then(res => {
  //       const amountPaid = res.data.totalPayments;
  //       setValues(prev => ({
  //         ...prev,
  //         AmountPaid: amountPaid,
  //         RemainingAmount: prev.TotalAmount - amountPaid
  //       }));
  //     })
  //     .catch(err => {
  //       console.error('Error fetching total amount paid:', err);
  //     });
  // };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (isSubmitting) {
      setErrors(validateSalesOrder(values));
    }
  }, [values, isSubmitting]);

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const validationErrors = validateSalesOrder(values);
  //   setErrors(validationErrors);

  //   if (Object.keys(validationErrors).length === 0) {
  //     setIsSubmitting(true);
  //     axios.put(`http://localhost:3001/api/sales-orders/${id}`, values)
  //       .then(res => {
  //         navigate(`/salesorder/receipt/${id}`);
  //         console.log('Sales order updated:', res.data);
  //       })
  //       .catch(err => {
  //         console.error('Error updating sales order:', err);
  //       })
  //       .finally(() => {
  //         setIsSubmitting(false);
  //       });
  //   }
  // };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateSalesOrder(values);
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
  
      // First, update the sales order
      axios.put(`http://localhost:3001/api/sales-orders/${id}`, values)
        .then(res => {
          console.log('Sales order updated:', res.data);
  
          // After updating the sales order, create a CustomerLeisure entry
          const leisureEntry = {
            CustomerID: values.CustomerID,
            TransactionType: 'SalesOrder',
            TransactionDate: values.OrderDate,
          
            TransactionID: id,          

          };
  
          return axios.post('http://localhost:3001/api/customerleisure/create', leisureEntry);
        })
        .then(res => {
          console.log('CustomerLeisure entry created:', res.data);
          navigate(`/salesorder/receipt/${id}`);
        })
        .catch(err => {
          console.error('Error updating sales order or creating leisure entry:', err.response ? err.response.data : err.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };
  
  

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
      <div className='w-50 bg-white rounded p-3'>
        <h2>Update Sales Order</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='CustomerID'><strong>Customer</strong></label>
            <select
              onChange={handleInput}
              className='form-control rounded-0'
              name='CustomerID'
              value={values.CustomerID}
            >
              <option value="">Select a Customer</option>
              {customers.map(customer => (
                <option key={customer.CustomerID} value={customer.CustomerID}>
                  {customer.CustomerName}
                </option>
              ))}
            </select>
            {errors.CustomerID && <span className='text-danger'>{errors.CustomerID}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='OrderDate'><strong>Order Date</strong></label>
            <input
              onChange={handleInput}
              type='date'
              className='form-control rounded-0'
              name='OrderDate'
              value={values.OrderDate}
            />
            {errors.OrderDate && <span className='text-danger'>{errors.OrderDate}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='TotalAmount'><strong>Total Amount</strong></label>
            <input
              onChange={handleInput}
              type='number'
              className='form-control rounded-0'
              name='TotalAmount'
              value={values.TotalAmount}
              readOnly
            />
            {errors.TotalAmount && <span className='text-danger'>{errors.TotalAmount}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='AmountPaid'><strong>Amount Paid</strong></label>
            <input
              onChange={handleInput}
              type='number'
              className='form-control rounded-0'
              name='AmountPaid'
              value={values.AmountPaid}
            />
            {errors.AmountPaid && <span className='text-danger'>{errors.AmountPaid}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='RemainingAmount'><strong>Remaining Amount</strong></label>
            <input
              onChange={handleInput}
              type='number'
              className='form-control rounded-0'
              name='RemainingAmount'
              value={values.RemainingAmount}
              readOnly
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='PaymentStatus'><strong>Payment Status</strong></label>
            <select
              onChange={handleInput}
              className='form-control rounded-0'
              name='PaymentStatus'
              value={values.PaymentStatus}
            >
              <option value="">Select Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Advance">Advance</option>
            </select>
            {errors.PaymentStatus && <span className='text-danger'>{errors.PaymentStatus}</span>}
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Sales Order'}
          </button>
          <Link className='btn btn-secondary w-100 rounded-0' to={`/customerpayment/add/${id}`}>Proceed To Payment</Link>
        </form>
      </div>
    </div>
  );
}

export default UpdateSalesOrderForm;
