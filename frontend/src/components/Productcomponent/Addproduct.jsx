import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import { useToast } from "../../ui/toast/ToastProvider";
import { get, post } from "../../service/apiClient";
import { useInvalidate } from "../../context/DataRefreshContext";

function AddProduct() {
  const [values, setValues] = useState({
    ProductName: "",
    Description: "",
    Unit: "",
    CustomUnit: "",
    ReorderLevel: "",
    CategoryID: "",
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const toast = useToast();
  const invalidate = useInvalidate();

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const getUnitValue = () => {
    if (values.Unit === "Other") {
      return values.CustomUnit?.trim() || "";
    }
    return values.Unit;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await get("/product-categories");
      
      // Categories API returns data directly without success wrapper
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (response.data.success && response.data.categories) {
        setCategories(response.data.categories);
      } else {
        console.error('Invalid response format from categories API');
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    try {
      const response = await post("/products", {
        ...values,
        Unit: getUnitValue(),
      });
      
      if (response.data.success) {
        toast.success("Product created successfully!");
        invalidate('products');
        navigate("/products");
      } else {
        toast.error(response.data.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      
      if (error.response) {
        if (error.response.status === 400) {
          // Validation errors
          if (error.response.data.errors) {
            setErrors(error.response.data.errors);
          } else {
            setErrors({ general: error.response.data.message || 'Validation failed' });
          }
        } else if (error.response.status === 500) {
          setErrors({ general: 'Server error. Please try again later.' });
        } else {
          setErrors({ general: error.response.data.message || 'Failed to create product' });
        }
      } else if (error.request) {
        setErrors({ general: 'Network error. Please check your connection and try again.' });
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }

      toast.error(error.response?.data?.message || "Failed to create product");
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
          maxWidth: 450,
          width: "100%",
          border: "1px solid #404040",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="text-center mb-4">
          <FaPlusCircle size={40} color="#263043" />
          <h3 className="fw-bold mt-2" style={{ color: "#263043" }}>
            Add New Product
          </h3>
          <p className="text-muted" style={{ fontSize: 15 }}>
            Create a new product for your inventory.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="alert alert-danger" role="alert">
              {errors.general}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="ProductName" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Product Name
            </label>
            <input
              type="text"
              className="form-control rounded-3"
              name="ProductName"
              placeholder="Enter product name"
              value={values.ProductName}
              onChange={handleInput}
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
            {errors.ProductName && (
              <span className="text-danger small">{errors.ProductName}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="Description" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Description
            </label>
            <textarea
              className="form-control rounded-3"
              name="Description"
              placeholder="Enter product description"
              value={values.Description}
              onChange={handleInput}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                minHeight: 80,
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
            {errors.Description && (
              <span className="text-danger small">{errors.Description}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="Unit" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Unit
            </label>
            <select
              className="form-control rounded-3"
              name="Unit"
              value={values.Unit}
              onChange={handleInput}
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
              <option value="">Select Unit</option>
              <option value="Container">Container</option>
              <option value="Sack">Sack</option>
              <option value="Piece">Piece</option>
              <option value="KG">KG</option>
              <option value="Box">Box</option>
              <option value="Liter">Liter</option>
              <option value="Other">Other (custom)</option>
            </select>
            {values.Unit === "Other" && (
              <input
                type="text"
                className="form-control rounded-3 mt-2"
                name="CustomUnit"
                placeholder="Enter custom unit name"
                value={values.CustomUnit}
                onChange={handleInput}
              />
            )}
            {errors.Unit && <span className="text-danger small">{errors.Unit}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="ReorderLevel" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Reorder Level
            </label>
            <input
              type="number"
              className="form-control rounded-3"
              name="ReorderLevel"
              placeholder="Enter reorder level"
              value={values.ReorderLevel}
              onChange={handleInput}
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
            {errors.ReorderLevel && (
              <span className="text-danger small">{errors.ReorderLevel}</span>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="CategoryID" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Category
            </label>
            <select
              className="form-control rounded-3"
              name="CategoryID"
              value={values.CategoryID}
              onChange={handleInput}
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
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.CategoryID} value={category.CategoryID}>
                  {category.CategoryName}
                </option>
              ))}
            </select>
            {errors.CategoryID && (
              <span className="text-danger small">{errors.CategoryID}</span>
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
            <FaPlusCircle className="me-2 mb-1" />
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
