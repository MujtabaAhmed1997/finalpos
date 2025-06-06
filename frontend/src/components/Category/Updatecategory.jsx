import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function UpdateCategory() {
  const { id } = useParams(); // Get the category ID from URL params
  const [values, setValues] = useState({
    categoryName: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const navigation = useNavigate();

  useEffect(() => {
    fetchCategory(); // Fetch the category data on component mount
  }, []);

  // Function to fetch the category data
  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/product-categories/${id}`
      );
      const { CategoryName, Description } = response.data;
      setValues({ categoryName: CategoryName, description: Description });
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("values", values);
    axios
      .put(`http://localhost:3001/api/product-categories/${id}`, values)
      .then((res) => {
        navigation("/categories"); // Navigate to categories page after successful update
        console.log(res);
      })
      .catch((err) => {
        console.error("Error updating category:", err);
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
            <label htmlFor="categoryName">
              <strong>Category Name</strong>
            </label>
            <input
              onChange={handleInput}
              type="text"
              placeholder="Enter category name"
              className="form-control rounded-0"
              name="categoryName"
              value={values.categoryName}
            />
            {errors.categoryName && (
              <span className="text-danger">{errors.categoryName}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="description">
              <strong>Description</strong>
            </label>
            <textarea
              onChange={handleInput}
              placeholder="Enter category description"
              className="form-control rounded-0"
              name="description"
              value={values.description}
            />
            {errors.description && (
              <span className="text-danger">{errors.description}</span>
            )}
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Update Category
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCategory;
