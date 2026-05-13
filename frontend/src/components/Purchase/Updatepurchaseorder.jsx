import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { validatePurchaseOrder } from '../../controllers/Purchaseordervalidator';
import { FaEdit, FaSave, FaArrowLeft, FaBuilding, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import './UpdatePurchaseOrderForm.css';
import { get, post, put } from "../../service/apiClient";

function UpdatePurchaseOrderForm() {
  const { id } = useParams();
  const [values, setValues] = useState({
    SupplierID: '',
    OrderDate: '',
    TotalAmount: 0,
    AmountPaid: 0,
    RemainingAmount: 0,
    PaymentStatus: 'Pending'
  });
  const [suppliers, setSuppliers] = useState([]);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [purchaseOrderRes, suppliersRes] = await Promise.all([
          get(`/purchase-orders/${id}`),
          get('/suppliers')
        ]);

        const purchaseOrder = purchaseOrderRes.data;
        setValues({
          SupplierID: purchaseOrder.SupplierID,
          OrderDate: purchaseOrder.OrderDate,
          TotalAmount: 0,
          AmountPaid: 0,
          RemainingAmount: 0,
          PaymentStatus: purchaseOrder.PaymentStatus || 'Pending'
        });

        setSuppliers(suppliersRes.data.suppliers || []);
        fetchPurchaseOrderDetails(id);
      } catch (err) {
        console.error('Error fetching data:', err);
        setErrors({ apiError: 'Failed to load purchase order data. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchPurchaseOrderDetails = (purchaseOrderId) => {
    get(`/purchaseordersdetails/purchaseOrder/${purchaseOrderId}/details`)
      .then(res => {
        const details = res.data;
        console.log("Fetched details object:", details);
        
        setValues(prevValues => ({
          ...prevValues,
          TotalAmount: details.total
        }));
        
        setData(details);
      })
      .catch(err => {
        console.error('Error fetching purchase order details:', err);
        setErrors(prev => ({ ...prev, apiError: 'Failed to load order details.' }));
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
      RemainingAmount: prev.TotalAmount - prev.AmountPaid
    }));
  }, [data.total, values.AmountPaid]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validatePurchaseOrder(values);
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      put(`/purchase-orders/${id}`, values)
        .then(res => {
          console.log('Purchase order updated:', res.data);
  
          const leisureEntry = {
            SupplierID: values.SupplierID,
            TransactionType: 'PurchaseOrder',
            TransactionDate: values.OrderDate,
            TransactionID: id,
          };
  
          return post('/supplierleisure/create', leisureEntry);
        })
        .then(res => {
          console.log('SupplierLeisure entry created:', res.data);
          navigate(`/purchaseorder/receipt/${id}`);
        })
        .catch(err => {
          console.error('Error updating purchase order or creating leisure entry:', err.response ? err.response.data : err.message);
          setErrors({ apiError: 'Failed to update purchase order. Please try again.' });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  const handleBackClick = () => {
    navigate('/purchaseorder');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="update-purchase-order-container">
        <div className="update-purchase-order-card">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading purchase order...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="update-purchase-order-container">
      <div className="update-purchase-order-card">
        <div className="form-header">
          <FaEdit className="header-icon" size={40} />
          <h3 className="form-title">Update Purchase Order</h3>
          <p className="form-subtitle">
            Modify purchase order details and proceed to payment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="update-purchase-order-form">
          {errors.apiError && (
            <div className="alert alert-danger" role="alert">
              {errors.apiError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="SupplierID" className="form-label">
              <FaBuilding className="button-icon" />
              Supplier
            </label>
            <select
              onChange={handleInput}
              className="form-select"
              name="SupplierID"
              value={values.SupplierID}
            >
              <option value="">Select a Supplier</option>
              {Array.isArray(suppliers) && suppliers.map(supplier => (
                <option key={supplier.SupplierID} value={supplier.SupplierID}>
                  {supplier.SupplierName}
                </option>
              ))}
            </select>
            {errors.SupplierID && <span className="error-message">{errors.SupplierID}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="OrderDate" className="form-label">
              <FaCalendarAlt className="button-icon" />
              Order Date
            </label>
            <input
              onChange={handleInput}
              type="date"
              className="form-control"
              name="OrderDate"
              value={values.OrderDate}
            />
            {errors.OrderDate && <span className="error-message">{errors.OrderDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="TotalAmount" className="form-label">
              <FaDollarSign className="button-icon" />
              Total Amount
            </label>
            <input
              type="text"
              className="form-control"
              name="TotalAmount"
              value={formatCurrency(data.total)}
              readOnly
              disabled
            />
            {errors.TotalAmount && <span className="error-message">{errors.TotalAmount}</span>}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting}
            >
              <FaSave className="button-icon" />
              {isSubmitting ? 'Updating...' : 'Update Purchase Order'}
            </button>
            
            <Link 
              className="payment-button" 
              to={`/supplierpayment/add`}
            >
              <FaDollarSign className="button-icon" />
              Proceed To Payment
            </Link>
            
            <button 
              type="button" 
              className="payment-button" 
              onClick={handleBackClick}
              style={{ marginTop: '0.5rem' }}
            >
              <FaArrowLeft className="button-icon" />
              Back to Purchase Orders
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePurchaseOrderForm;


