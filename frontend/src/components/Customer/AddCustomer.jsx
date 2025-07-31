import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateCustomer } from "../../controllers/Customervalidator";
import { FaUserPlus } from "react-icons/fa";

function AddCustomer() {
  const [values, setValues] = useState({
    CustomerName: "",
    Address: "",
    Phone: "",
    Email: "",
    AvailableBalance: 0.0,
  });

  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    if (isSubmitting) {
      setErrors(validateCustomer(values));
    }
  }, [values, isSubmitting]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateCustomer(values);
    setErrors(validationErrors);
    setBackendError("");

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      axios
        .post("http://localhost:3001/api/customers", values)
        .then((res) => {
          navigate("/customers");
        })
        .catch((err) => {
          console.error("Error adding customer:", err);
          if (err.response && err.response.data) {
            if (typeof err.response.data === "string") {
              setBackendError(err.response.data);
            } else if (err.response.data.message) {
              setBackendError(err.response.data.message);
            } else {
              setBackendError("Something went wrong. Please try again.");
            }
          } else {
            setBackendError("Server is not responding.");
          }
        })
        .finally(() => {
          setIsSubmitting(false);
        });
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
          minWidth: 400,
          maxWidth: 500,
          width: "100%",
          border: "1px solid #404040",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="text-center mb-4">
          <FaUserPlus size={40} color="#263043" />
          <h3 className="fw-bold mt-2" style={{ color: "#263043" }}>
            Add New Customer
          </h3>
          <p className="text-muted" style={{ fontSize: 15 }}>
            Create a new customer account for your business.
          </p>
        </div>

        {backendError && (
          <div className="alert alert-danger text-center">{backendError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="CustomerName" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Customer Name
            </label>
            <input
              onChange={handleInput}
              type="text"
              placeholder="Enter customer name"
              className="form-control rounded-3"
              name="CustomerName"
              value={values.CustomerName}
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
            {errors.CustomerName && (
              <span className="text-danger small">{errors.CustomerName}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="Address" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Address
            </label>
            <input
              onChange={handleInput}
              type="text"
              placeholder="Enter address"
              className="form-control rounded-3"
              name="Address"
              value={values.Address}
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
            {errors.Address && (
              <span className="text-danger small">{errors.Address}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="Phone" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Phone
            </label>
            <input
              onChange={handleInput}
              type="text"
              placeholder="Enter phone number"
              className="form-control rounded-3"
              name="Phone"
              value={values.Phone}
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
            {errors.Phone && (
              <span className="text-danger small">{errors.Phone}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="Email" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Email
            </label>
            <input
              onChange={handleInput}
              type="email"
              placeholder="Enter email"
              className="form-control rounded-3"
              name="Email"
              value={values.Email}
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
            {errors.Email && (
              <span className="text-danger small">{errors.Email}</span>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="AvailableBalance" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Available Balance
            </label>
            <input
              onChange={handleInput}
              type="number"
              step="0.01"
              placeholder="Enter available balance"
              className="form-control rounded-3"
              name="AvailableBalance"
              value={values.AvailableBalance}
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
            {errors.AvailableBalance && (
              <span className="text-danger small">{errors.AvailableBalance}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-3 fw-bold"
            disabled={isSubmitting}
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
            <FaUserPlus className="me-2 mb-1" />
            {isSubmitting ? "Adding..." : "Add Customer"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCustomer;
