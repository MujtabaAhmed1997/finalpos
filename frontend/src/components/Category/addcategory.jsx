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

//31-7-2025
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function AddCategory() {
//   const [values, setValues] = useState({
//     categoryName: "",
//     description: "",
//   });

//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const handleInput = (event) => {
//     const { name, value } = event.target;
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setErrors({}); // Clear previous errors

//     try {
//       const response = await axios.post(
//         "http://localhost:3001/api/product-categories",
//         values
//       );
//       console.log("Category added:", response.data);
//       navigate("/categories");
//     } catch (err) {
//       if (err.response && err.response.data && err.response.data.message) {
//         setErrors({ apiError: err.response.data.message });
//       } else {
//         setErrors({
//           apiError: "An unexpected error occurred. Please try again.",
//         });
//       }
//       console.error("Error adding category:", err);
//     }
//   };

//   return (
//     <div
//       className="d-flex vh-100 justify-content-center align-items-center"
//       style={{ backgroundColor: "#263043" }}
//     >
//       <div className="w-50 bg-white rounded p-4 shadow">
//         <h3 className="mb-4 text-center">Add New Category</h3>
//         <form onSubmit={handleSubmit}>
//           {errors.apiError && (
//             <div className="alert alert-danger" role="alert">
//               {errors.apiError}
//             </div>
//           )}

//           <div className="mb-3">
//             <label htmlFor="categoryName" className="form-label">
//               <strong>Category Name</strong>
//             </label>
//             <input
//               type="text"
//               className="form-control rounded-0"
//               name="categoryName"
//               placeholder="Enter category name"
//               value={values.categoryName}
//               onChange={handleInput}
//             />
//             {errors.categoryName && (
//               <span className="text-danger">{errors.categoryName}</span>
//             )}
//           </div>

//           <div className="mb-3">
//             <label htmlFor="description" className="form-label">
//               <strong>Description</strong>
//             </label>
//             <textarea
//               className="form-control rounded-0"
//               name="description"
//               placeholder="Enter category description"
//               value={values.description}
//               onChange={handleInput}
//             />
//             {errors.description && (
//               <span className="text-danger">{errors.description}</span>
//             )}
//           </div>

//           <button type="submit" className="btn btn-success w-100 rounded-0">
//             Add Category
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddCategory;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// // You can import an icon library like react-icons for a nice icon
// import { FaPlusCircle } from "react-icons/fa";

// function AddCategory() {
//   const [values, setValues] = useState({
//     categoryName: "",
//     description: "",
//   });

//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const handleInput = (event) => {
//     const { name, value } = event.target;
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setErrors({}); // Clear previous errors

//     try {
//       const response = await axios.post(
//         "http://localhost:3001/api/product-categories",
//         values
//       );
//       console.log("Category added:", response.data);
//       navigate("/categories");
//     } catch (err) {
//       if (err.response && err.response.data && err.response.data.message) {
//         setErrors({ apiError: err.response.data.message });
//       } else {
//         setErrors({
//           apiError: "An unexpected error occurred. Please try again.",
//         });
//       }
//       console.error("Error adding category:", err);
//     }
//   };

//   return (
//     <div
//       className="d-flex vh-100 justify-content-center align-items-center"
//       style={{
//         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//       }}
//     >
//       <div
//         className="bg-white rounded-4 shadow-lg p-5"
//         style={{
//           minWidth: 400,
//           maxWidth: 450,
//           width: "100%",
//           border: "1px solid #e3e3e3",
//         }}
//       >
//         <div className="text-center mb-4">
//           <FaPlusCircle size={40} color="#667eea" />
//           <h3 className="fw-bold mt-2" style={{ color: "#333" }}>
//             Add New Category
//           </h3>
//           <p className="text-muted" style={{ fontSize: 15 }}>
//             Create a new product category for your inventory.
//           </p>
//         </div>
//         <form onSubmit={handleSubmit}>
//           {errors.apiError && (
//             <div className="alert alert-danger" role="alert">
//               {errors.apiError}
//             </div>
//           )}

//           <div className="mb-3">
//             <label htmlFor="categoryName" className="form-label fw-semibold">
//               Category Name
//             </label>
//             <input
//               type="text"
//               className="form-control rounded-3 border-primary"
//               name="categoryName"
//               placeholder="Enter category name"
//               value={values.categoryName}
//               onChange={handleInput}
//               style={{ background: "#f7f8fa" }}
//             />
//             {errors.categoryName && (
//               <span className="text-danger small">{errors.categoryName}</span>
//             )}
//           </div>

//           <div className="mb-4">
//             <label htmlFor="description" className="form-label fw-semibold">
//               Description
//             </label>
//             <textarea
//               className="form-control rounded-3 border-primary"
//               name="description"
//               placeholder="Enter category description"
//               value={values.description}
//               onChange={handleInput}
//               style={{ background: "#f7f8fa", minHeight: 80 }}
//             />
//             {errors.description && (
//               <span className="text-danger small">{errors.description}</span>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary w-100 rounded-3 fw-bold"
//             style={{
//               background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
//               border: "none",
//               fontSize: 18,
//               letterSpacing: 1,
//               boxShadow: "0 4px 12px rgba(102,126,234,0.15)",
//               transition: "background 0.3s",
//             }}
//           >
//             <FaPlusCircle className="me-2 mb-1" />
//             Add Category
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddCategory;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlusCircle } from "react-icons/fa";

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
            Add New Category
          </h3>
          <p className="text-muted" style={{ fontSize: 15 }}>
            Create a new product category for your inventory.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {errors.apiError && (
            <div className="alert alert-danger" role="alert">
              {errors.apiError}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="categoryName" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Category Name
            </label>
            <input
              type="text"
              className="form-control rounded-3"
              name="categoryName"
              placeholder="Enter category name"
              value={values.categoryName}
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
            {errors.categoryName && (
              <span className="text-danger small">{errors.categoryName}</span>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Description
            </label>
            <textarea
              className="form-control rounded-3"
              name="description"
              placeholder="Enter category description"
              value={values.description}
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
            {errors.description && (
              <span className="text-danger small">{errors.description}</span>
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
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCategory;