import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserEdit } from "react-icons/fa";

function UpdateCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    CustomerName: "",
    Address: "",
    Phone: "",
    Email: "",
    AvailableBalance: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/customers/${id}`)
      .then((res) => setCustomer(res.data))
      .catch((err) => {
        console.error(err);
        setApiError("Failed to load customer");
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError("");
    
    try {
      await axios.put(`http://localhost:3001/api/customers/${id}`, customer);
      navigate("/customers");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
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
          <FaUserEdit size={40} color="#263043" />
          <h3 className="fw-bold mt-2" style={{ color: "#263043" }}>
            Update Customer
          </h3>
          <p className="text-muted" style={{ fontSize: 15 }}>
            Modify customer information and details.
          </p>
        </div>

        {apiError && (
          <div className="alert alert-danger text-center">{apiError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="CustomerName" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Customer Name
            </label>
            <input
              type="text"
              className="form-control rounded-3"
              id="CustomerName"
              name="CustomerName"
              value={customer.CustomerName}
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
            {errors.CustomerName && (
              <span className="text-danger small">{errors.CustomerName}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="Address" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-3"
              id="Address"
              name="Address"
              value={customer.Address}
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
            {errors.Address && (
              <span className="text-danger small">{errors.Address}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="Phone" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Phone
            </label>
            <input
              type="text"
              className="form-control rounded-3"
              id="Phone"
              name="Phone"
              value={customer.Phone}
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
            {errors.Phone && (
              <span className="text-danger small">{errors.Phone}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="Email" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-3"
              id="Email"
              name="Email"
              value={customer.Email}
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
            {errors.Email && (
              <span className="text-danger small">{errors.Email}</span>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="AvailableBalance" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Available Balance
            </label>
            <input
              type="number"
              step="0.01"
              className="form-control rounded-3"
              id="AvailableBalance"
              name="AvailableBalance"
              value={customer.AvailableBalance}
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
            <FaUserEdit className="me-2 mb-1" />
            {isSubmitting ? "Updating..." : "Update Customer"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCustomer;
