import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function UpdateVariations() {
  const { id } = useParams(); // Get variation ID from route params
  const [values, setValues] = useState({
    SKU: "",
    Size: "",
    Color: "",
    Price: "",
    QuantityInStock: "",
    UnitsPerPackage: "",
    ProductID: "",
  });

  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
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
    }
  };

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    // Validate form inputs whenever values change
    // setErrors(variationValidation(values)); // Implement variation validation if needed
  }, [values]);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .put(`http://localhost:3001/api/productVariations/${id}`, values)
      .then((res) => {
        navigate(`/variations/${values.ProductID}`); // Navigate to variations page after successful update
        console.log(res);
      })
      .catch((err) => {
        console.error("Error updating variation:", err);
        // You can handle the error state here if needed
      });
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ backgroundColor: "#263043" }}
    >
      <div className="w-50 bg-white rounded p-3">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="SKU">
              <strong>SKU</strong>
            </label>
            <input
              onChange={handleInput}
              type="text"
              placeholder="Enter SKU"
              className="form-control rounded-0"
              name="SKU"
              value={values.SKU}
            />
            {errors.SKU && <span className="text-danger">{errors.SKU}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="Size">
              <strong>Size</strong>
            </label>
            <input
              onChange={handleInput}
              type="text"
              placeholder="Enter size"
              className="form-control rounded-0"
              name="Size"
              value={values.Size}
            />
            {errors.Size && <span className="text-danger">{errors.Size}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="Color">
              <strong>Color</strong>
            </label>
            <input
              onChange={handleInput}
              type="text"
              placeholder="Enter color"
              className="form-control rounded-0"
              name="Color"
              value={values.Color}
            />
            {errors.Color && (
              <span className="text-danger">{errors.Color}</span>
            )}
          </div>
          {/* <div className="mb-3">
            <label htmlFor="Price">
              <strong>Price</strong>
            </label>
            <input
              onChange={handleInput}
              type="number"
              step="0.01"
              placeholder="Enter price"
              className="form-control rounded-0"
              name="Price"
              value={values.Price}
            />
            {errors.Price && (
              <span className="text-danger">{errors.Price}</span>
            )}
          </div> */}
          <div className="mb-3">
            <label htmlFor="SellingPrice">
              <strong>Selling Price</strong>
            </label>
            <input
              onChange={handleInput}
              type="number"
              step="0.01"
              placeholder="Enter Selling price"
              className="form-control rounded-0"
              name="SellingPrice"
              value={values.SellingPrice}
            />
            {errors.Price && (
              <span className="text-danger">{errors.Price}</span>
            )}
          </div>
          {/* <div className="mb-3">
            <label htmlFor="QuantityInStock">
              <strong>Quantity In Stock</strong>
            </label>
            <input
              onChange={handleInput}
              type="number"
              placeholder="Enter quantity in stock"
              className="form-control rounded-0"
              name="QuantityInStock"
              value={values.QuantityInStock}
            />
            {errors.QuantityInStock && (
              <span className="text-danger">{errors.QuantityInStock}</span>
            )}
          </div> */}
          <div className="mb-3">
            <label htmlFor="UnitsPerPackage">
              <strong>Units Per Package</strong>
            </label>
            <input
              onChange={handleInput}
              type="number"
              placeholder="Enter units per package"
              className="form-control rounded-0"
              name="UnitsPerPackage"
              value={values.UnitsPerPackage}
            />
            {errors.UnitsPerPackage && (
              <span className="text-danger">{errors.UnitsPerPackage}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="ProductID">
              <strong>Product</strong>
            </label>
            <select
              onChange={handleInput}
              className="form-control rounded-0"
              name="ProductID"
              value={values.ProductID}
            >
              <option value="">Select a product...</option>
              {products.map((product) => (
                <option key={product.ProductID} value={product.ProductID}>
                  {product.ProductName}
                </option>
              ))}
            </select>
            {errors.ProductID && (
              <span className="text-danger">{errors.ProductID}</span>
            )}
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Update Variation
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateVariations;
