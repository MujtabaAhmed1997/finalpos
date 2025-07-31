import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaUser, FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSpinner } from "react-icons/fa";

function UpdateSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState({
    SupplierName: '',
    ContactName: '',
    Address: '',
    Phone: '',
    Email: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/suppliers/${id}`);
        setSupplier(response.data);
      } catch (err) {
        console.error('Error fetching supplier:', err);
        setFetchError("Failed to load supplier data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSupplier();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplier(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    setIsSubmitting(true);

    try {
      const response = await axios.put(`http://localhost:3001/api/suppliers/${id}`, supplier);
      console.log("Supplier updated:", response.data);
      navigate('/suppliers');
    } catch (err) {
      console.error('Error updating supplier:', err);
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
  };

  if (isLoading) {
    return (
      <div
        className="d-flex vh-100 justify-content-center align-items-center"
        style={{ backgroundColor: "#263043" }}
      >
        <div className="text-center text-white">
          <FaSpinner className="fa-spin" size={40} />
          <p className="mt-3">Loading supplier data...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div
        className="d-flex vh-100 justify-content-center align-items-center"
        style={{ backgroundColor: "#263043" }}
      >
        <div className="text-center text-white">
          <div className="alert alert-danger" role="alert">
            {fetchError}
          </div>
          <button
            className="btn btn-light mt-3"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
          <FaEdit size={40} color="#263043" />
          <h3 className="fw-bold mt-2" style={{ color: "#263043" }}>
            Update Supplier
          </h3>
          <p className="text-muted" style={{ fontSize: 15 }}>
            Modify supplier information for your business.
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
              id="SupplierName"
              name="SupplierName"
              placeholder="Enter supplier name"
              value={supplier.SupplierName}
              onChange={handleInputChange}
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
          </div>

          <div className="mb-3">
            <label htmlFor="ContactName" className="form-label fw-semibold" style={{ color: "#263043" }}>
              <FaUser className="me-2" />
              Contact Name
            </label>
            <input
              type="text"
              className="form-control rounded-3"
              id="ContactName"
              name="ContactName"
              placeholder="Enter contact name"
              value={supplier.ContactName}
              onChange={handleInputChange}
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
          </div>

          <div className="mb-3">
            <label htmlFor="Address" className="form-label fw-semibold" style={{ color: "#263043" }}>
              <FaMapMarkerAlt className="me-2" />
              Address
            </label>
            <textarea
              className="form-control rounded-3"
              id="Address"
              name="Address"
              placeholder="Enter address"
              value={supplier.Address}
              onChange={handleInputChange}
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
          </div>

          <div className="mb-3">
            <label htmlFor="Phone" className="form-label fw-semibold" style={{ color: "#263043" }}>
              <FaPhone className="me-2" />
              Phone
            </label>
            <input
              type="text"
              className="form-control rounded-3"
              id="Phone"
              name="Phone"
              placeholder="Enter phone number"
              value={supplier.Phone}
              onChange={handleInputChange}
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
          </div>

          <div className="mb-4">
            <label htmlFor="Email" className="form-label fw-semibold" style={{ color: "#263043" }}>
              <FaEnvelope className="me-2" />
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-3"
              id="Email"
              name="Email"
              placeholder="Enter email address"
              value={supplier.Email}
              onChange={handleInputChange}
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
          </div>

          <div className="d-flex gap-3">
            <button
              type="button"
              className="btn flex-fill rounded-3 fw-bold"
              onClick={() => navigate('/suppliers')}
              style={{
                background: "#6c757d",
                border: "none",
                fontSize: 16,
                letterSpacing: 1,
                boxShadow: "0 4px 12px rgba(108, 117, 125, 0.3)",
                transition: "all 0.3s",
                color: "white",
              }}
              onMouseOver={e => {
                e.target.style.background = "#5a6268";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(108, 117, 125, 0.4)";
              }}
              onMouseOut={e => {
                e.target.style.background = "#6c757d";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(108, 117, 125, 0.3)";
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn flex-fill rounded-3 fw-bold"
              disabled={isSubmitting}
              style={{
                background: "#263043",
                border: "none",
                fontSize: 16,
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
                  Updating...
                </>
              ) : (
                <>
                  <FaEdit className="me-2 mb-1" />
                  Update Supplier
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateSupplier;




