import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validatePayment } from '../../controllers/spaymentvalidator';
import { FaPlusCircle, FaUser, FaCalendarAlt, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { get, post } from "../../service/apiClient";
import { fetchAllSuppliers } from "../../utils/apiHelpers";
import { formatCurrency } from "../../utils/formatCurrency";

function AddPayment() {
  const todayDate = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const [values, setValues] = useState({
    SupplierID: "",
    PaymentDate: todayDate,
    PaymentAmount: "",
    PaymentMethod: "",
    PaymentStatus: "Completed",
    CustomPaymentMethod: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [outstandingBalance, setOutstandingBalance] = useState(0);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const list = await fetchAllSuppliers(get);
        setSuppliers(list);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
        setFetchError("Failed to load suppliers.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (!values.SupplierID) {
      setOutstandingBalance(0);
      return;
    }
    get(`/supplierleisure/supplier/${values.SupplierID}`)
      .then((res) => {
        const records = Array.isArray(res.data) ? res.data : [];
        const sorted = [...records].sort((a, b) => new Date(b.TransactionDate) - new Date(a.TransactionDate));
        setOutstandingBalance(parseFloat(sorted[0]?.Balance) || 0);
      })
      .catch(() => setOutstandingBalance(0));
  }, [values.SupplierID]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({}); // Clear previous errors

    const validationErrors = validatePayment(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);

      try {
        const paymentMethod =
          values.PaymentMethod === "Other"
            ? values.CustomPaymentMethod
            : values.PaymentMethod;

        const response = await post('/supplierpayment', {
          ...values,
          PaymentMethod: paymentMethod,
        });

        console.log("Payment added successfully:", response.data);
        const paymentData = response.data;

        const leisureEntry = {
          SupplierID: paymentData.SupplierID,
          TransactionType: 'Payment',
          TransactionID: paymentData.SupplierPaymentID,
          TransactionDate: paymentData.PaymentDate,
          Debit: parseFloat(paymentData.PaymentAmount),
          Description: `Payment made via ${paymentData.PaymentMethod}`,
        };

        await post('/supplierleisure/create', leisureEntry);

        console.log("Leisure entry added, navigating to payment list...");
        navigate("/supplierpayment/list");
      } catch (err) {
        console.error("Error processing payment:", err);
        if (err.response && err.response.data && err.response.data.message) {
          setErrors({ apiError: err.response.data.message });
        } else {
          setErrors({
            apiError: "Failed to process payment. Please try again.",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{
        backgroundColor: "#263043",
      }}
    >
      <div
        className="rounded-4 shadow-lg p-5"
        style={{
          minWidth: 450,
          maxWidth: 500,
          width: "100%",
          border: "1px solid #404040",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="text-center mb-4">
          <FaMoneyBillWave size={40} color="#263043" />
          <h3 className="fw-bold mt-2" style={{ color: "#263043" }}>
            Add Supplier Payment
          </h3>
          <p className="text-muted" style={{ fontSize: 15 }}>
            Record a new payment to your supplier.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {errors.apiError && (
            <div className="alert alert-danger" role="alert">
              {errors.apiError}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="SupplierID" className="form-label fw-semibold" style={{ color: "#263043" }}>
              <FaUser className="me-2" />
              Supplier
            </label>
            <select
              className="form-control rounded-3"
              name="SupplierID"
              value={values.SupplierID}
              onChange={handleInput}
              disabled={isLoading}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
              <option value="">
                {isLoading ? "Loading suppliers..." : "Select Supplier"}
              </option>
              {suppliers.length > 0 && suppliers.map((supplier) => (
                <option key={supplier.SupplierID} value={supplier.SupplierID}>
                  {supplier.SupplierName}
                </option>
              ))}
            </select>
            {values.SupplierID && (
              <div className="mt-2 p-2 rounded-3" style={{ background: '#fff3cd', fontSize: '0.9rem' }}>
                <strong>Outstanding (Debit):</strong> {formatCurrency(outstandingBalance)}
                {values.PaymentAmount && (
                  <span className="ms-2">
                    | <strong>After payment:</strong> {formatCurrency(Math.max(0, outstandingBalance - (parseFloat(values.PaymentAmount) || 0)))}
                  </span>
                )}
              </div>
            )}
            {errors.SupplierID && (
              <span className="text-danger small">{errors.SupplierID}</span>
            )}
            {fetchError && <span className="text-danger small">{fetchError}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="PaymentDate" className="form-label fw-semibold" style={{ color: "#263043" }}>
              <FaCalendarAlt className="me-2" />
              Payment Date
            </label>
            <input
              type="date"
              className="form-control rounded-3"
              name="PaymentDate"
              value={values.PaymentDate}
              onChange={handleInput}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
            {errors.PaymentDate && (
              <span className="text-danger small">{errors.PaymentDate}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="PaymentAmount" className="form-label fw-semibold" style={{ color: "#263043" }}>
              <FaMoneyBillWave className="me-2" />
              Payment Amount
            </label>
            <input
              type="number"
              className="form-control rounded-3"
              name="PaymentAmount"
              value={values.PaymentAmount}
              onChange={handleInput}
              placeholder="Enter payment amount"
              step="0.01"
              min="0"
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
            {errors.PaymentAmount && (
              <span className="text-danger small">{errors.PaymentAmount}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="PaymentMethod" className="form-label fw-semibold" style={{ color: "#263043" }}>
              <FaCreditCard className="me-2" />
              Payment Method
            </label>
            <select
              className="form-control rounded-3"
              name="PaymentMethod"
              value={values.PaymentMethod}
              onChange={handleInput}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Other">Other (Specify Below)</option>
            </select>
            {values.PaymentMethod === "Other" && (
              <input
                type="text"
                className="form-control rounded-3 mt-2"
                name="CustomPaymentMethod"
                value={values.CustomPaymentMethod}
                onChange={handleInput}
                placeholder="Enter custom payment method"
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
            )}
            {errors.PaymentMethod && (
              <span className="text-danger small">{errors.PaymentMethod}</span>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="PaymentStatus" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Payment Status
            </label>
            <select
              className="form-control rounded-3"
              name="PaymentStatus"
              value={values.PaymentStatus}
              onChange={handleInput}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            {errors.PaymentStatus && (
              <span className="text-danger small">{errors.PaymentStatus}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-3 fw-bold"
            disabled={isSubmitting || isLoading}
            style={{
              background: "#263043",
              border: "none",
              fontSize: 18,
              letterSpacing: 1,
              boxShadow: "0 4px 12px rgba(38, 48, 67, 0.3)",
              transition: "all 0.3s",
              color: "white",
            }}
            onMouseOver={e => {
              if (!isSubmitting && !isLoading) {
                e.target.style.background = "#1a2332";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(38, 48, 67, 0.4)";
              }
            }}
            onMouseOut={e => {
              if (!isSubmitting && !isLoading) {
                e.target.style.background = "#263043";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(38, 48, 67, 0.3)";
              }
            }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              <>
                <FaPlusCircle className="me-2 mb-1" />
                Add Payment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPayment;
