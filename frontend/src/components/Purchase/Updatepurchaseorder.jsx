// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { validatePurchaseOrder } from '../../controllers/Purchaseordervalidator'; // Adjust the import path as needed

// function UpdatePurchaseOrderForm() {
//   const { id } = useParams(); // Get PurchaseOrderID from URL
//   const [values, setValues] = useState({
//     SupplierID: '',
//     OrderDate: '',
//     TotalAmount: 0,
//     AmountPaid: 0,
//     RemainingAmount: 0,
//     PaymentStatus: 'Pending'
//   });
//   const [suppliers, setSuppliers] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get(`http://localhost:3001/api/purchase-orders/${id}`)
//       .then(res => {
//         setValues(res.data);
//         fetchPurchaseOrderDetails(res.data.PurchaseOrderID);
//       })
//       .catch(err => {
//         console.error('Error fetching purchase order:', err);
//       });
//   }, [id]);

//   useEffect(() => {
//     axios.get('http://localhost:3001/api/suppliers')
//       .then(res => {
//         setSuppliers(res.data);
//       })
//       .catch(err => {
//         console.error('Error fetching suppliers:', err);
//       });
//   }, []);

//   const fetchPurchaseOrderDetails = (purchaseOrderId) => {
//     axios.get(`http://localhost:3001/api/purchaseordersdetails/purchaseOrder/${purchaseOrderId}/details`)
//       .then(res => {
//         const details = res.data;
//         const totalAmount = details.reduce((sum, detail) => sum + (detail.Quantity * detail.UnitPrice), 0);
//         fetchLatestPaymentAmount(purchaseOrderId, totalAmount);
//       })
//       .catch(err => {
//         console.error('Error fetching purchase order details:', err);
//       });
//   };


//   const fetchLatestPaymentAmount = (purchaseOrderId, totalAmount) => {
//     axios.get(`http://localhost:3001/api/supplierpayment/fk/${purchaseOrderId}`)
//       .then(res => {
//         const payments = res.data;
//         const amountPaid = payments.reduce((sum, payment) => sum + payment.PaymentAmount, 0);
//         setValues(prev => ({
//           ...prev,
//           TotalAmount: totalAmount,
//           AmountPaid: amountPaid,
//           RemainingAmount: totalAmount - amountPaid
//         }));
//       })
//       .catch(err => {
//         console.error('Error fetching latest payment amount:', err);
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
//       setErrors(validatePurchaseOrder(values));
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
//     const validationErrors = validatePurchaseOrder(values);
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       setIsSubmitting(true);
//       axios.put(`http://localhost:3001/api/purchase-orders/${id}`, values)
//         .then(res => {
//           navigate(`/purchaseorder`);
//           console.log(res);
//         })
//         .catch(err => {
//           console.error('Error updating purchase order:', err);
//         })
//         .finally(() => {
//           setIsSubmitting(false);
//         });
//     }
//   };

//   return (
//     <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
//       <div className='w-50 bg-white rounded p-3'>
//         <h2>Update Purchase Order</h2>
//         <form onSubmit={handleSubmit}>
//           <div className='mb-3'>
//             <label htmlFor='SupplierID'><strong>Supplier</strong></label>
//             <select
//               onChange={handleInput}
//               className='form-control rounded-0'
//               name='SupplierID'
//               value={values.SupplierID}
//             >
//               <option value="">Select a Supplier</option>
//               {suppliers.map(supplier => (
//                 <option key={supplier.SupplierID} value={supplier.SupplierID}>
//                   {supplier.SupplierName}
//                 </option>
//               ))}
//             </select>
//             {errors.SupplierID && <span className='text-danger'>{errors.SupplierID}</span>}
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
//             {isSubmitting ? 'Updating...' : 'Update Purchase Order'}
//           </button>
//           <Link className='btn btn-secondary w-100 rounded-0' to={`/supplierpayment/add/${id}`}>
//             Proceed To Payment
//           </Link>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default UpdatePurchaseOrderForm;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { validatePurchaseOrder } from '../../controllers/Purchaseordervalidator'; // Adjust the import path as needed

function UpdatePurchaseOrderForm() {
  const { id } = useParams(); // Get PurchaseOrderID from URL
  const [values, setValues] = useState({
    SupplierID: '',
    OrderDate: '',
    TotalAmount: 0,
    AmountPaid: 0,
    RemainingAmount: 0,
    PaymentStatus: 'Pending'
  });
  const [suppliers, setSuppliers] = useState([]);
  const [data ,setData]=useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/api/purchase-orders/${id}`)
      .then(res => {
        const purchaseOrder = res.data;
      
        setValues({
          SupplierID: purchaseOrder.SupplierID,
          OrderDate: purchaseOrder.OrderDate,
          TotalAmount: 0, // Initialize to 0, will be calculated later
          AmountPaid: 0, // Initialize to 0, will be calculated later
          RemainingAmount: 0, // Initialize to 0, will be calculated later
          PaymentStatus: purchaseOrder.PaymentStatus || 'Pending'
        });
        fetchPurchaseOrderDetails(id);
      })
      .catch(err => {
        console.error('Error fetching purchase order:', err);
      });
  }, [id]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/suppliers')
      .then(res => {
        setSuppliers(res.data);
      })
      .catch(err => {
        console.error('Error fetching suppliers:', err);
      });
  }, []);

  // const fetchPurchaseOrderDetails = (purchaseOrderId) => {
  //   axios.get(`http://localhost:3001/api/purchaseordersdetails/purchaseOrder/${purchaseOrderId}/details`)
  //     .then(res => {
  //       const details = res.data;
  //       setData(details);
  //       console.log("details",details);
  //       // const totalAmount = details.reduce((sum, detail) => sum + (detail.Quantity * detail.UnitPrice), 0);
  //       const totalAmount = details.reduce((sum, detail) => sum + (detail.Quantity * detail.UnitPrice), 0);

  //     })
  //     .catch(err => {
  //       console.error('Error fetching purchase order details:', err);
  //     });
  // };

  const fetchPurchaseOrderDetails = (purchaseOrderId) => {
    axios.get(`http://localhost:3001/api/purchaseordersdetails/purchaseOrder/${purchaseOrderId}/details`)
      .then(res => {
        const details = res.data;
        console.log("Fetched details object:", details); // Log to confirm structure
  
        // Update TotalAmount in values state using details.total
        setValues(prevValues => ({
          ...prevValues,
          TotalAmount: details.total
        }));
        
        setData(details); // Set only the OrderDetails array to data if needed
      })
      .catch(err => {
        console.error('Error fetching purchase order details:', err);
      });
  };
  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (isSubmitting) {
      setErrors(validatePurchaseOrder(values));
    }
  }, [values, isSubmitting]);

  useEffect(() => {
    setValues(prev => ({
      ...prev,
      // TotalAmount:totalAmount,
      RemainingAmount: prev.TotalAmount - prev.AmountPaid
    }));
  }, [data.total, values.AmountPaid]);

  console.log("Values total",data.total);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validatePurchaseOrder(values);
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      // First, update the sales order
      axios.put(`http://localhost:3001/api/purchase-orders/${id}`, values)
        .then(res => {
          console.log('Sales order updated:', res.data);
  
          // After updating the sales order, create a CustomerLeisure entry
          const leisureEntry = {
            SupplierID: values.SupplierID,
            TransactionType: 'PurchaseOrder',
            TransactionDate: values.OrderDate,
          
            TransactionID: id,          

          };
  
          return axios.post('http://localhost:3001/api/supplierleisure/create', leisureEntry);
        })
        .then(res => {
          console.log('supplierLeisure entry created:', res.data);
          navigate(`/purchaseorder/receipt/${id}`);
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
        <h2>Update Purchase Order</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='SupplierID'><strong>Supplier</strong></label>
            <select
              onChange={handleInput}
              className='form-control rounded-0'
              name='SupplierID'
              value={values.SupplierID}
            >
              <option value="">Select a Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.SupplierID} value={supplier.SupplierID}>
                  {supplier.SupplierName}
                </option>
              ))}
            </select>
            {errors.SupplierID && <span className='text-danger'>{errors.SupplierID}</span>}
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
              value={data.total}
              readOnly
            />
            {errors.TotalAmount && <span className='text-danger'>{errors.TotalAmount}</span>}
          </div>
          {/* <div className='mb-3'>
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
          </div> */}
          <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Purchase Order'}
          </button>
          <Link className='btn btn-secondary w-100 rounded-0' to={`/supplierpayment/add`}>
            Proceed To Payment
          </Link>
        </form>
      </div>
    </div>
  );
}

export default UpdatePurchaseOrderForm;


