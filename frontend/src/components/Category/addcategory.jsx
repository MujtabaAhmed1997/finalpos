// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// //import { categoryValidation } from '../../controllers/categoryValidation'; // Import your category validation function
// import axios from 'axios';

// function AddCategory() {
//   const [values, setValues] = useState({
//     categoryName: "",
//     description: "",
//   });

//   const [errors, setErrors] = useState({});
//   const navigation = useNavigate();

//   const handleInput = (event) => {
//     setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
//   };

//   useEffect(() => {
//     // Validate form inputs whenever values change
//   //  setErrors(categoryValidation(values));
//   }, [values]);

//   const handleSubmit = (event) => {
//     event.preventDefault();

//       axios.post('http://localhost:3001/api/product-categories', values)
//         .then(res => {
//           navigation('/categories'); // Navigate to categories page after successful submission
//           console.log(res);
//         })
//         .catch(err => {
//           console.error('Error adding category:', err);
//           // You can handle the error state here if needed
//         });

//   };

//   return (
//     <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
//       <div className='w-50 bg-white rounded p-3'>
//         <form onSubmit={handleSubmit}>
//           <div className='mb-3'>
//             <label htmlFor='categoryName'><strong>Category Name</strong></label>
//             <input onChange={handleInput} type='text' placeholder='Enter category name' className='form-control rounded-0' name='categoryName' />
//             {errors.categoryName && <span className='text-danger'>{errors.categoryName}</span>}
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='description'><strong>Description</strong></label>
//             <textarea onChange={handleInput} placeholder='Enter category description' className='form-control rounded-0' name='description' />
//             {errors.description && <span className='text-danger'>{errors.description}</span>}
//           </div>
//           <button type='submit' className='btn btn-success w-100 rounded-0'>Add Category</button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default AddCategory;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddCategory() {
  const [values, setValues] = useState({
    categoryName: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({}); // Clear previous errors

    try {
      const response = await axios.post(
        "http://localhost:3001/api/product-categories",
        values
      );
      console.log("Category added:", response.data);
      navigate("/categories");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrors({ apiError: err.response.data.message });
      } else {
        setErrors({
          apiError: "An unexpected error occurred. Please try again.",
        });
      }
      console.error("Error adding category:", err);
    }
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ backgroundColor: "#263043" }}
    >
      <div className="w-50 bg-white rounded p-4 shadow">
        <h3 className="mb-4 text-center">Add New Category</h3>
        <form onSubmit={handleSubmit}>
          {errors.apiError && (
            <div className="alert alert-danger" role="alert">
              {errors.apiError}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="categoryName" className="form-label">
              <strong>Category Name</strong>
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              name="categoryName"
              placeholder="Enter category name"
              value={values.categoryName}
              onChange={handleInput}
            />
            {errors.categoryName && (
              <span className="text-danger">{errors.categoryName}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              <strong>Description</strong>
            </label>
            <textarea
              className="form-control rounded-0"
              name="description"
              placeholder="Enter category description"
              value={values.description}
              onChange={handleInput}
            />
            {errors.description && (
              <span className="text-danger">{errors.description}</span>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100 rounded-0">
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCategory;
