import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

function UpdateVariations() {
  const { id } = useParams();
  const [values, setValues] = useState({
    SKU: "",
    Size: "",
    Color: "",
    SellingPrice: "",
    UnitsPerPackage: "",
    ProductID: "",
    Barcode: "",
  });

  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchVariationDetails();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchVariationDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/productVariations/${id}`
      );
      setValues(response.data);
    } catch (error) {
      console.error("Error fetching variation details:", error);
      setServerError("Failed to load variation data.");
    }
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    const numericFields = ["UnitsPerPackage", "SellingPrice"];

    const newValue = numericFields.includes(name) ? Number(value) : value;

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!values.SKU.trim()) {
      newErrors.SKU = "SKU is required";
    }

    if (!values.Size.trim()) {
      newErrors.Size = "Size is required";
    }

    if (!values.Color.trim()) {
      newErrors.Color = "Color is required";
    }

    if (!values.SellingPrice || values.SellingPrice <= 0) {
      newErrors.SellingPrice = "Selling price must be greater than 0";
    }

    if (!values.UnitsPerPackage || values.UnitsPerPackage <= 0) {
      newErrors.UnitsPerPackage = "Units per package must be greater than 0";
    }

    if (!values.ProductID) {
      newErrors.ProductID = "Please select a product";
    }

    if (!values.Barcode) {
      newErrors.Barcode = "Barcode is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    setServerError("");

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/api/productVariations/${id}`,
        values
      );
      console.log("Variation updated:", response.data);
      navigate("/variations/all");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
      console.error("Error updating variation:", err);
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
          <FaEdit size={40} color="#263043" />
          <h3 className="fw-bold mt-2" style={{ color: "#263043" }}>
            Update Variation
          </h3>
          <p className="text-muted" style={{ fontSize: 15 }}>
            Modify the variation information below.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {serverError && (
            <div className="alert alert-danger" role="alert">
              {serverError}
            </div>
          )}

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="SKU" className="form-label fw-semibold" style={{ color: "#263043" }}>
                SKU
              </label>
              <input
                type="text"
                className="form-control rounded-3"
                name="SKU"
                placeholder="Enter SKU"
                value={values.SKU}
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
              {errors.SKU && (
                <span className="text-danger small">{errors.SKU}</span>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="Size" className="form-label fw-semibold" style={{ color: "#263043" }}>
                Size
              </label>
              <input
                type="text"
                className="form-control rounded-3"
                name="Size"
                placeholder="Enter size"
                value={values.Size}
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
              {errors.Size && (
                <span className="text-danger small">{errors.Size}</span>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="Color" className="form-label fw-semibold" style={{ color: "#263043" }}>
                Color
              </label>
              <input
                type="text"
                className="form-control rounded-3"
                name="Color"
                placeholder="Enter color"
                value={values.Color}
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
              {errors.Color && (
                <span className="text-danger small">{errors.Color}</span>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="SellingPrice" className="form-label fw-semibold" style={{ color: "#263043" }}>
                Selling Price
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control rounded-3"
                name="SellingPrice"
                placeholder="Enter selling price"
                value={values.SellingPrice}
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
              {errors.SellingPrice && (
                <span className="text-danger small">{errors.SellingPrice}</span>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="UnitsPerPackage" className="form-label fw-semibold" style={{ color: "#263043" }}>
                Units Per Package
              </label>
              <input
                type="number"
                className="form-control rounded-3"
                name="UnitsPerPackage"
                placeholder="Enter units per package"
                value={values.UnitsPerPackage}
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
              {errors.UnitsPerPackage && (
                <span className="text-danger small">{errors.UnitsPerPackage}</span>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="Barcode" className="form-label fw-semibold" style={{ color: "#263043" }}>
                Barcode
              </label>
              <input
                type="text"
                className="form-control rounded-3"
                name="Barcode"
                placeholder="Enter barcode"
                value={values.Barcode}
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
              {errors.Barcode && (
                <span className="text-danger small">{errors.Barcode}</span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="ProductID" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Product
            </label>
            <select
              className="form-control rounded-3"
              name="ProductID"
              value={values.ProductID}
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
              <option value="">Select a product...</option>
              {products.map((product) => (
                <option key={product.ProductID} value={product.ProductID}>
                  {product.ProductName}
                </option>
              ))}
            </select>
            {errors.ProductID && (
              <span className="text-danger small">{errors.ProductID}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-3 fw-bold"
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
              e.target.style.background = "#1a2332";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(38, 48, 67, 0.4)";
            }}
            onMouseOut={e => {
              e.target.style.background = "#263043";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(38, 48, 67, 0.3)";
            }}
          >
            <FaEdit className="me-2 mb-1" />
            Update Variation
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateVariations;
