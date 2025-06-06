// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { validatePayment } from '../../controllers/cpaymentvalidator';

// function AddCustomerPayment() {
//   const { id } = useParams(); // Get PurchaseOrderID from URL
//   // const currentDate = new Date().toISOString().split('T')[0];

//   const [values, setValues] = useState({
//     CustomerID: "",
//     SalesOrderID: id,
//     PaymentDate: "",
//     PaymentAmount: "",
//     PaymentMethod: "",
//     PaymentStatus: ""
//   });

//   const [customer, setCustomer] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch salesOrder and Customer details
//     axios.get(`http://localhost:3001/api/sales-orders/${id}`)
//       .then(res => {
//         const customerID = res.data.CustomerID;
//         fetchCustomerByID(customerID);
//         setValues(prev => ({
//           ...prev,
//           CustomerID: customerID
//         }));
//       })
//       .catch(err => {
//         console.error('Error fetching purchase order:', err);
//       });
//   }, [id]);

//   const fetchCustomerByID = (customerID) => {
//     axios.get(`http://localhost:3001/api/customers/${customerID}`)
//       .then(res => {
//         setCustomer(res.data);
//       })
//       .catch(err => {
//         console.error('Error fetching customer:', err);
//       });
//   };

//   const handleInput = (event) => {
//     const { name, value } = event.target;
//     setValues(prev => ({ ...prev, [name]: value }));
//   };

//   useEffect(() => {
//     if (isSubmitting) {
//       setErrors(validatePayment(values));
//     }
//   }, [values, isSubmitting]);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const validationErrors = validatePayment(values);
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       setIsSubmitting(true);
//       axios.post('http://localhost:3001/api/customerpayments', values)
//         .then(res => {
//           navigate(`/sales-orders/update/${id}`); // Navigate to update sales order page after successful submission
//           console.log(res);
//         })
//         .catch(err => {
//           console.error('Error adding payment:', err);
//         })
//         .finally(() => {
//           setIsSubmitting(false);
//         });
//     }
//   };

//   // const handleSubmit = (event) => {
//   //   event.preventDefault();
//   //   const validationErrors = validatePayment(values);
//   //   setErrors(validationErrors);
  
//   //   if (Object.keys(validationErrors).length === 0) {
//   //     setIsSubmitting(true);
      
//   //     // Convert PaymentAmount to number
//   //     const submissionData = {
//   //       ...values,
//   //       PaymentAmount: parseFloat(values.PaymentAmount) // Ensure it's a number
//   //     };
      
//   //     console.log('Submitting values:', submissionData); // Log values
      
//   //     axios.post('http://localhost:3001/api/customerpayments', submissionData)
//   //       .then(res => {
//   //         navigate(`/sales-orders/update/${id}`);
//   //         console.log('Payment added:', res.data);
//   //       })
//   //       .catch(err => {
//   //         console.error('Error adding payment:', err.response ? err.response.data : err.message); // Log detailed error
//   //       })
//   //       .finally(() => {
//   //         setIsSubmitting(false);
//   //       });
//   //   }
//   // };
  
//   return (
//     <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
//       <div className='w-50 bg-white rounded p-3'>
//         <form onSubmit={handleSubmit}>
//           <div className='mb-3'>
//             <label htmlFor='CustomerName'><strong>Customer Name</strong></label>
//             <input
//               type='text'
//               className='form-control rounded-0'
//               name='CustomerName'
//               value={customer ? customer.CustomerName : ''}
//               readOnly
//             />
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='SalesOrderID'><strong>Sales Order ID</strong></label>
//             <input
//               type='text'
//               className='form-control rounded-0'
//               name='SalesOrderID'
//               value={values.SalesOrderID}
//               readOnly
//             />
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='PaymentDate'><strong>Payment Date</strong></label>
//             <input
//               onChange={handleInput}
//               type='date'
//               className='form-control rounded-0'
//               name='PaymentDate'
//               value={values.PaymentDate}
//             />
//             {errors.PaymentDate && <span className='text-danger'>{errors.PaymentDate}</span>}
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='PaymentAmount'><strong>Payment Amount</strong></label>
//             <input
//               onChange={handleInput}
//               type='number'
//               placeholder='Enter payment amount'
//               className='form-control rounded-0'
//               name='PaymentAmount'
//               value={values.PaymentAmount}
//             />
//             {errors.PaymentAmount && <span className='text-danger'>{errors.PaymentAmount}</span>}
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='PaymentMethod'><strong>Payment Method</strong></label>
//             <input
//               onChange={handleInput}
//               type='text'
//               placeholder='Enter payment method'
//               className='form-control rounded-0'
//               name='PaymentMethod'
//               value={values.PaymentMethod}
//             />
//             {errors.PaymentMethod && <span className='text-danger'>{errors.PaymentMethod}</span>}
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='PaymentStatus'><strong>Payment Status</strong></label>
//             <input
//               onChange={handleInput}
//               type='text'
//               placeholder='Enter payment status'
//               className='form-control rounded-0'
//               name='PaymentStatus'
//               value={values.PaymentStatus}
//             />
//             {errors.PaymentStatus && <span className='text-danger'>{errors.PaymentStatus}</span>}
//           </div>
//           <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
//             {isSubmitting ? 'Adding...' : 'Add Payment'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddCustomerPayment;




import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { validatePayment } from '../../controllers/cpaymentvalidator';

function AddCustomerPayment() {
  const { id } = useParams(); // Get SalesOrderID from URL

  // Initialize state with today's date
  const todayDate = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  const [values, setValues] = useState({
    CustomerID: "",
    SalesOrderID: id,
    PaymentDate: todayDate, // Set default date here
    PaymentAmount: "",
    PaymentMethod: "",
    PaymentStatus: ""
  });

  const [customer, setCustomer] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch salesOrder and Customer details
    axios.get(`http://localhost:3001/api/sales-orders/${id}`)
      .then(res => {
        const customerID = res.data.CustomerID;
        fetchCustomerByID(customerID);
        setValues(prev => ({
          ...prev,
          CustomerID: customerID
        }));
      })
      .catch(err => {
        console.error('Error fetching purchase order:', err);
      });
  }, [id]);

  const fetchCustomerByID = (customerID) => {
    axios.get(`http://localhost:3001/api/customers/${customerID}`)
      .then(res => {
        setCustomer(res.data);
      })
      .catch(err => {
        console.error('Error fetching customer:', err);
      });
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    if (isSubmitting) {
      const validationErrors = validatePayment(values);
      setErrors(validationErrors);
      console.log('Validation Errors:', validationErrors);
    }
  }, [values, isSubmitting]);
  

  useEffect(() => {
    if (isSubmitting) {
      setErrors(validatePayment(values));
    }
  }, [values, isSubmitting]);

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const validationErrors = validatePayment(values);
  //   setErrors(validationErrors);

  //   if (Object.keys(validationErrors).length === 0) {
  //     setIsSubmitting(true);
  //     axios.post('http://localhost:3001/api/customerpayments', values)
  //       .then(res => {
  //         navigate(`/salesorder/update/${id}`); // Navigate to update sales order page after successful submission
  //         console.log(res);
  //       })
  //       .catch(err => {
  //         console.error('Error adding payment:', err);
  //       })
  //       .finally(() => {
  //         setIsSubmitting(false);
  //       });
  //   }
  // };
  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validatePayment(values);
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
  
      axios.post('http://localhost:3001/api/customerpayments', values)
        .then(res => {
          const paymentData = res.data;
  
          // Calculate the balance (assuming this logic needs to be done on the client-side)
          // const newBalance = /* logic to calculate new balance */;
  
          // Create leisure entry
          const leisureEntry = {
            CustomerID: paymentData.CustomerID,
            TransactionType: 'Payment',
            TransactionID: paymentData.CustomerPaymentID,
            TransactionDate: paymentData.PaymentDate,
            Debit: parseFloat(paymentData.PaymentAmount), // Debit for payment
            // Balance: newBalance,
            Description: 'Payment received via ' + paymentData.PaymentMethod
          };
  
          return axios.post('http://localhost:3001/api/customerleisure/create', leisureEntry);
        })
        .then(res => {
          console.log('Leisure entry added:', res.data);
          navigate(`/salesorder/update/${id}`); // Navigate to update sales order page after successful submission
        })
        .catch(err => {
          console.error('Error adding payment or leisure entry:', err);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };
  
  
  return (
    <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
      <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='CustomerName'><strong>Customer Name</strong></label>
            <input
              type='text'
              className='form-control rounded-0'
              name='CustomerName'
              value={customer ? customer.CustomerName : ''}
              readOnly
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='SalesOrderID'><strong>Sales Order ID</strong></label>
            <input
              type='text'
              className='form-control rounded-0'
              name='SalesOrderID'
              value={values.SalesOrderID}
              readOnly
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='PaymentDate'><strong>Payment Date</strong></label>
            <input
              onChange={handleInput}
              type='date'
              className='form-control rounded-0'
              name='PaymentDate'
              value={values.PaymentDate}
            />
            {errors.PaymentDate && <span className='text-danger'>{errors.PaymentDate}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='PaymentAmount'><strong>Payment Amount</strong></label>
            <input
              onChange={handleInput}
              type='number'
              placeholder='Enter payment amount'
              className='form-control rounded-0'
              name='PaymentAmount'
              value={values.PaymentAmount}
            />
            {errors.PaymentAmount && <span className='text-danger'>{errors.PaymentAmount}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='PaymentMethod'><strong>Payment Method</strong></label>
            <input
              onChange={handleInput}
              type='text'
              placeholder='Enter payment method'
              className='form-control rounded-0'
              name='PaymentMethod'
              value={values.PaymentMethod}
            />
            {errors.PaymentMethod && <span className='text-danger'>{errors.PaymentMethod}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='PaymentStatus'><strong>Payment Status</strong></label>
            <input
              onChange={handleInput}
              type='text'
              placeholder='Enter payment status'
              className='form-control rounded-0'
              name='PaymentStatus'
              value={values.PaymentStatus}
            />
            {errors.PaymentStatus && <span className='text-danger'>{errors.PaymentStatus}</span>}
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCustomerPayment;
