import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateSupplier } from './validator';
import { FaPlusCircle, FaUser, FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { post } from "../../../service/apiClient";

function AddSupplier() {
  const [values, setValues] = useState({
    SupplierName: "",
    ContactName: "",
    Address: "",
    Phone: "",
    Email: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({}); // Clear previous errors

    const validationErrors = validateSupplier(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        const response = await post('/suppliers', values);
        console.log("Supplier added:", response.data);
        navigate('/suppliers');
      } catch (err) {
        console.error('Error adding supplier:', err);
        if (err.response && err.response.data && err.response.data.message) {
          setErrors({ apiError: err.response.data.message });
        } else {
          setErrors({
            apiError: "An unexpected error occurred. Please try again.",
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
          <FaBuilding size={40} color="#263043" />
          <h3 className="fw-bold mt-2" style={{ color: "#263043" }}>
            Add New Supplier
          </h3>
          <p className="text-muted" style={{ fontSize: 15 }}>
            Register a new supplier for your business.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {errors.apiError && (
            <div className="alert alert-danger" role="alert">
              {errors.apiError}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="SupplierName" className="form-label fw-semibold" style={{ color: "#263043" }}>
              <FaBuilding className="me-2" />
              Supplier Name
            </label>
            <input
              type="text"
              className="form-control rounded-3"
              name="SupplierName"
              placeholder="Enter supplier name"
              value={values.SupplierName}
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
            {errors.SupplierName && (
              <span className="text-danger small">{errors.SupplierName}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="ContactName" className="form-label fw-semibold" style={{ color: "#263043" }}>
              <FaUser className="me-2" />
              Contact Name
            </label>
            <input
              type="text"
              className="form-control rounded-3"
              name="ContactName"
              placeholder="Enter contact name"
              value={values.ContactName}
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
            {errors.ContactName && (
              <span className="text-danger small">{errors.ContactName}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="Address" className="form-label fw-semibold" style={{ color: "#263043" }}>
              <FaMapMarkerAlt className="me-2" />
              Address
            </label>
            <textarea
              className="form-control rounded-3"
              name="Address"
              placeholder="Enter address"
              value={values.Address}
              onChange={handleInput}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                minHeight: 60,
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
              <FaPhone className="me-2" />
              Phone
            </label>
            <input
              type="text"
              className="form-control rounded-3"
              name="Phone"
              placeholder="Enter phone number"
              value={values.Phone}
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
            {errors.Phone && (
              <span className="text-danger small">{errors.Phone}</span>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="Email" className="form-label fw-semibold" style={{ color: "#263043" }}>
              <FaEnvelope className="me-2" />
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-3"
              name="Email"
              placeholder="Enter email address"
              value={values.Email}
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
            {errors.Email && (
              <span className="text-danger small">{errors.Email}</span>
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
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding...
              </>
            ) : (
              <>
                <FaPlusCircle className="me-2 mb-1" />
                Add Supplier
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddSupplier;
