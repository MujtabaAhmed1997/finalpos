import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { validateSalesOrder } from '../../controllers/salesvalidator';
import { FaEdit, FaCreditCard, FaTimes } from 'react-icons/fa';
import { useToast } from "../../ui/toast/ToastProvider";
import { get, post, put } from "../../service/apiClient";

function UpdateSalesOrderForm() {
  const { id } = useParams();
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    PaymentAmount: 0,
    PaymentMethod: 'Cash',
    PaymentDate: new Date().toISOString().split('T')[0],
    Notes: ''
  });
  const [paymentErrors, setPaymentErrors] = useState({});

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    get(`/sales-orders/${id}`)
      .then(res => {
        setValues(prev => ({
          ...prev,
          ...res.data
        }));
        fetchSalesOrderDetails(res.data.SalesOrderID);
        setPaymentData(prev => ({
          ...prev,
          PaymentAmount: res.data.RemainingAmount || 0
        }));
      })
      .catch(err => {
        console.error('Error fetching sales order:', err);
      });
  }, [id]);

  useEffect(() => {
    get('/customers')
      .then(res => {
        setCustomers(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error('Error fetching customers:', err);
        setCustomers([]);
      });
  }, []);

  const fetchSalesOrderDetails = (salesOrderId) => {
    get(`/salesordersdetails/salesOrder/${salesOrderId}/total`)
      .then(res => {
        const totalAmount = res.data.total;
        setValues(prev => ({
          ...prev,
          TotalAmount: totalAmount,
          RemainingAmount: totalAmount - prev.AmountPaid
        }));
        setPaymentData(prev => ({
          ...prev,
          PaymentAmount: totalAmount - prev.AmountPaid
        }));
      })
      .catch(err => {
        console.error('Error fetching sales order details:', err);
      });
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentInput = (event) => {
    const { name, value } = event.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (isSubmitting) {
      setErrors(validateSalesOrder(values));
    }
  }, [values, isSubmitting]);

  const validatePayment = (data) => {
    const errors = {};
    if (!data.PaymentAmount || data.PaymentAmount <= 0) {
      errors.PaymentAmount = 'Payment amount must be greater than 0';
    }
    if (data.PaymentAmount > values.RemainingAmount) {
      errors.PaymentAmount = 'Payment amount cannot exceed remaining amount';
    }
    if (!data.PaymentMethod) {
      errors.PaymentMethod = 'Payment method is required';
    }
    if (!data.PaymentDate) {
      errors.PaymentDate = 'Payment date is required';
    }
    return errors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateSalesOrder(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);

      put(`/sales-orders/${id}`, values)
        .then(res => {
          console.log('Sales order updated:', res.data);

          const leisureEntry = {
            CustomerID: values.CustomerID,
            TransactionType: 'SalesOrder',
            TransactionDate: values.OrderDate,
            TransactionID: id,
          };

          return post('/customerleisure/create', leisureEntry);
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

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validatePayment(paymentData);
    setPaymentErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const paymentPayload = {
          CustomerID: values.CustomerID,
          SalesOrderID: id,
          PaymentAmount: parseFloat(paymentData.PaymentAmount),
          PaymentMethod: paymentData.PaymentMethod,
          PaymentDate: paymentData.PaymentDate,
          Notes: paymentData.Notes
        };

        await post('/customerpayments', paymentPayload);

        const newAmountPaid = values.AmountPaid + parseFloat(paymentData.PaymentAmount);
        const updatedValues = {
          ...values,
          AmountPaid: newAmountPaid,
          RemainingAmount: values.TotalAmount - newAmountPaid,
          PaymentStatus: newAmountPaid >= values.TotalAmount ? 'Paid' : 'Partial'
        };

        await put(`/sales-orders/${id}`, updatedValues);

        toast.success("Payment processed successfully!");
        setShowPaymentModal(false);
        window.location.reload();
      } catch (error) {
        console.error('Error processing payment:', error);
        toast.error("Error processing payment. Please try again.");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <>
      <div
        className="d-flex vh-100 justify-content-center align-items-center"
        style={{
          backgroundColor: "#263043",
        }}
      >
        <div
          className="rounded-4 shadow-lg p-5"
          style={{
            minWidth: 500,
            maxWidth: 600,
            width: "100%",
            border: "1px solid #404040",
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
          }}
        >
          <div className="text-center mb-4">
            <FaEdit size={40} color="#263043" />
            <h3 className="fw-bold mt-2" style={{ color: "#263043" }}>
              Update Sales Order
            </h3>
            <p className="text-muted" style={{ fontSize: 15 }}>
              Modify sales order details and process payments.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {errors.apiError && (
              <div className="alert alert-danger" role="alert">
                {errors.apiError}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="CustomerID" className="form-label fw-semibold" style={{ color: "#263043" }}>
                Customer
              </label>
              <select
                onChange={handleInput}
                className="form-control rounded-3"
                name="CustomerID"
                value={values.CustomerID}
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  color: "#000000",
                }}
                onFocus={e => {
                  e.target.style.borderColor = "#263043";
                  e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "#dee2e6";
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                }}
              >
                <option value="">Select a Customer</option>
                {Array.isArray(customers) && customers.map(customer => (
                  <option key={customer.CustomerID} value={customer.CustomerID}>
                    {customer.CustomerName}
                  </option>
                ))}
              </select>
              {errors.CustomerID && <span className="text-danger small">{errors.CustomerID}</span>}
            </div>

            <div className="mb-3">
              <label htmlFor="OrderDate" className="form-label fw-semibold" style={{ color: "#263043" }}>
                Order Date
              </label>
              <input
                onChange={handleInput}
                type="date"
                className="form-control rounded-3"
                name="OrderDate"
                value={values.OrderDate}
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  color: "#000000",
                }}
                onFocus={e => {
                  e.target.style.borderColor = "#263043";
                  e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "#dee2e6";
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                }}
              />
              {errors.OrderDate && <span className="text-danger small">{errors.OrderDate}</span>}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="TotalAmount" className="form-label fw-semibold" style={{ color: "#263043" }}>
                  Total Amount
                </label>
                <input
                  onChange={handleInput}
                  type="number"
                  className="form-control rounded-3"
                  name="TotalAmount"
                  value={values.TotalAmount}
                  readOnly
                  style={{
                    background: "#e9ecef",
                    border: "1px solid #dee2e6",
                    color: "#6c757d",
                  }}
                />
                {errors.TotalAmount && <span className="text-danger small">{errors.TotalAmount}</span>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="AmountPaid" className="form-label fw-semibold" style={{ color: "#263043" }}>
                  Amount Paid
                </label>
                <input
                  onChange={handleInput}
                  type="number"
                  className="form-control rounded-3"
                  name="AmountPaid"
                  value={values.AmountPaid}
                  readOnly
                  style={{
                    background: "#e9ecef",
                    border: "1px solid #dee2e6",
                    color: "#6c757d",
                  }}
                />
                {errors.AmountPaid && <span className="text-danger small">{errors.AmountPaid}</span>}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="RemainingAmount" className="form-label fw-semibold" style={{ color: "#263043" }}>
                Remaining Amount
              </label>
              <input
                onChange={handleInput}
                type="number"
                className="form-control rounded-3"
                name="RemainingAmount"
                value={values.RemainingAmount}
                readOnly
                style={{
                  background: values.RemainingAmount > 0 ? "#fff3cd" : "#d1e7dd",
                  border: "1px solid #dee2e6",
                  color: values.RemainingAmount > 0 ? "#856404" : "#0f5132",
                  fontWeight: "bold",
                }}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="PaymentStatus" className="form-label fw-semibold" style={{ color: "#263043" }}>
                Payment Status
              </label>
              <select
                onChange={handleInput}
                className="form-control rounded-3"
                name="PaymentStatus"
                value={values.PaymentStatus}
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  color: "#000000",
                }}
                onFocus={e => {
                  e.target.style.borderColor = "#263043";
                  e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "#dee2e6";
                  e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                }}
              >
                <option value="">Select Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Advance">Advance</option>
              </select>
              {errors.PaymentStatus && <span className="text-danger small">{errors.PaymentStatus}</span>}
            </div>

            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn rounded-3 fw-bold"
                disabled={isSubmitting}
                style={{
                  background: "#263043",
                  border: "none",
                  fontSize: 16,
                  letterSpacing: 1,
                  boxShadow: "0 4px 12px rgba(38, 48, 67, 0.3)",
                  transition: "all 0.3s",
                  color: "white",
                  padding: "12px 24px",
                }}
                onMouseOver={e => {
                  if (!isSubmitting) {
                    e.target.style.background = "#1a2332";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(38, 48, 67, 0.4)";
                  }
                }}
                onMouseOut={e => {
                  if (!isSubmitting) {
                    e.target.style.background = "#263043";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 12px rgba(38, 48, 67, 0.3)";
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaEdit className="me-2 mb-1" />
                    Update Sales Order
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn rounded-3 fw-bold"
                onClick={() => setShowPaymentModal(true)}
                disabled={values.RemainingAmount <= 0}
                style={{
                  background: values.RemainingAmount <= 0 ? "#6c757d" : "#28a745",
                  border: "none",
                  fontSize: 16,
                  letterSpacing: 1,
                  boxShadow: "0 4px 12px rgba(40, 167, 69, 0.3)",
                  transition: "all 0.3s",
                  color: "white",
                  padding: "12px 24px",
                }}
                onMouseOver={e => {
                  if (values.RemainingAmount > 0) {
                    e.target.style.background = "#218838";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(40, 167, 69, 0.4)";
                  }
                }}
                onMouseOut={e => {
                  if (values.RemainingAmount > 0) {
                    e.target.style.background = "#28a745";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 12px rgba(40, 167, 69, 0.3)";
                  }
                }}
              >
                <FaCreditCard className="me-2 mb-1" />
                Process Payment
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Process Payment</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowPaymentModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="payment-summary">
                <div className="summary-item">
                  <span>Total Amount:</span>
                  <span className="amount">{formatCurrency(values.TotalAmount)}</span>
                </div>
                <div className="summary-item">
                  <span>Amount Paid:</span>
                  <span className="amount">{formatCurrency(values.AmountPaid)}</span>
                </div>
                <div className="summary-item remaining">
                  <span>Remaining Amount:</span>
                  <span className="amount">{formatCurrency(values.RemainingAmount)}</span>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                <div className="form-group">
                  <label htmlFor="PaymentAmount">Payment Amount</label>
                  <input
                    type="number"
                    id="PaymentAmount"
                    name="PaymentAmount"
                    value={paymentData.PaymentAmount}
                    onChange={handlePaymentInput}
                    className="form-control"
                    min="0"
                    max={values.RemainingAmount}
                    step="0.01"
                  />
                  {paymentErrors.PaymentAmount && (
                    <div className="error-message">{paymentErrors.PaymentAmount}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="PaymentMethod">Payment Method</label>
                  <select
                    id="PaymentMethod"
                    name="PaymentMethod"
                    value={paymentData.PaymentMethod}
                    onChange={handlePaymentInput}
                    className="form-control"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                  {paymentErrors.PaymentMethod && (
                    <div className="error-message">{paymentErrors.PaymentMethod}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="PaymentDate">Payment Date</label>
                  <input
                    type="date"
                    id="PaymentDate"
                    name="PaymentDate"
                    value={paymentData.PaymentDate}
                    onChange={handlePaymentInput}
                    className="form-control"
                  />
                  {paymentErrors.PaymentDate && (
                    <div className="error-message">{paymentErrors.PaymentDate}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="Notes">Notes (Optional)</label>
                  <textarea
                    id="Notes"
                    name="Notes"
                    value={paymentData.Notes}
                    onChange={handlePaymentInput}
                    className="form-control"
                    rows="3"
                    placeholder="Add any additional notes..."
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    <FaCreditCard className="me-2" />
                    Process Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UpdateSalesOrderForm;
