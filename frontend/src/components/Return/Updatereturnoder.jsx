import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { validateReturnOrder } from '../../controllers/rorder'; // Adjust the import path as needed
import { get, post, put } from "../../service/apiClient";

function UpdateReturnOrderForm() {
  const { id } = useParams(); 
  // Get ReturnOrderID from URL
  const [values, setValues] = useState({
    
    OrderType: 'Customer',
    OrderID: '',
    ReturnDate: '',
    TotalAmount: 0,
    Reason: ''
  });
  const [orders, setOrders] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    get(`/return-orders/${id}`)
      .then(res => {
        setValues(res.data);
        console.log(res.data.ReturnOrderID);
        fetchReturnOrderDetails(res.data.ReturnOrderID);
      })
      .catch(err => {
        console.error('Error fetching return order:', err);
      });
  }, [id]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await get(`/${values.OrderType.toLowerCase()}s`);
        // Ensure we're setting an array
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrders([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [values.OrderType]);

  const fetchReturnOrderDetails = (orderId) => {
    get(`/returnordersdetails/returnorder/${orderId}/total`)
      .then(res => {
        setValues(prev => ({
          ...prev,
          TotalAmount: res.data.total
        }));
      })
      .catch(err => {
        console.error('Error fetching return order details:', err);
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
      setErrors(validateReturnOrder(values));
    }
  }, [values, isSubmitting]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateReturnOrder(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      console.log(values);
      put(`/return-orders/${id}`, values)
        .then(res => {
            console.log('Return Order  updated:', res.data);
  
          // After updating the sales order, create a CustomerLeisure entry
          const leisureEntry = {
            CustomerID: values.OrderID,
            TransactionType: 'ReturnOrder',
            TransactionDate: values.ReturnDate,
          
            TransactionID: id,          

          };
  
          return post('/customerleisure/create', leisureEntry);
        })
        .then(res => {
          console.log('CustomerLeisure entry created:', res.data);
         
          navigate(`/homepage`);
        })
        .catch(err => {
          console.error('Error updating return order:', err);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  if (isLoading) {
    return (
      <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
        <div className='text-white'>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
      <div className='w-50 bg-white rounded p-3'>
        <h2>Update Return Order</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='OrderType'><strong>Order Type</strong></label>
            <select
              onChange={handleInput}
              className='form-control rounded-0'
              name='OrderType'
              value={values.OrderType}
            >
              <option value="Customer">Customer</option>
              <option value="Supplier">Supplier</option>
            </select>
            {errors.OrderType && <span className='text-danger'>{errors.OrderType}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='OrderID'><strong>Order ID</strong></label>
            <select
              onChange={handleInput}
              className='form-control rounded-0'
              name='OrderID'
              value={values.OrderID}
            >
              <option value="">Select an Order</option>
              {Array.isArray(orders) && orders.map(order => (
                <option key={order.OrderID} value={order.OrderID}>
                  {values.OrderType === 'Customer' ? order.CustomerName : order.SupplierName} {/* Show based on OrderType */}
                </option>
              ))}
            </select>
            {errors.OrderID && <span className='text-danger'>{errors.OrderID}</span>}
          </div>

          <div className='mb-3'>
            <label htmlFor='ReturnDate'><strong>Return Date</strong></label>
            <input
              onChange={handleInput}
              type='date'
              className='form-control rounded-0'
              name='ReturnDate'
              value={values.ReturnDate}
            />
            {errors.ReturnDate && <span className='text-danger'>{errors.ReturnDate}</span>}
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
            <label htmlFor='Reason'><strong>Reason</strong></label>
            <input
              onChange={handleInput}
              type='text'
              className='form-control rounded-0'
              name='Reason'
              value={values.Reason}
            />
            {errors.Reason && <span className='text-danger'>{errors.Reason}</span>}
          </div>
          <button type='submit' className='btn btn-success w-100 rounded-0' disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Return Order'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateReturnOrderForm;
