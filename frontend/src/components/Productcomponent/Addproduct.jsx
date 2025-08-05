// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function AddProduct() {
//   const [values, setValues] = useState({
//     ProductName: "",
//     Description: "",
//     Unit: "",
//     ReorderLevel: "",
//     CategoryID: "",
//   });

//   const [categories, setCategories] = useState([]);
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const handleInput = (event) => {
//     setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
//   };

//   useEffect(() => {
//     axios
//       .get("http://localhost:3001/api/product-categories")
//       .then((res) => {
//         setCategories(res.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching categories:", err);
//       });
//   }, []);

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     axios
//       .post("http://localhost:3001/api/products", values)
//       .then((res) => {
//         navigate("/products");
//         console.log(res);
//       })
//       .catch((err) => {
//         console.error("Error adding product:", err);
//       });
//   };

//   return (
//     <div
//       className="d-flex vh-100 justify-content-center align-items-center"
//       style={{ backgroundColor: "#263043" }}
//     >
//       <div className="w-50 bg-white rounded p-3">
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="ProductName">
//               <strong>Product Name</strong>
//             </label>
//             <input
//               onChange={handleInput}
//               type="text"
//               placeholder="Enter product name"
//               className="form-control rounded-0"
//               name="ProductName"
//             />
//             {errors.ProductName && (
//               <span className="text-danger">{errors.ProductName}</span>
//             )}
//           </div>

//           <div className="mb-3">
//             <label htmlFor="Description">
//               <strong>Description</strong>
//             </label>
//             <textarea
//               onChange={handleInput}
//               placeholder="Enter product description"
//               className="form-control rounded-0"
//               name="Description"
//             />
//             {errors.Description && (
//               <span className="text-danger">{errors.Description}</span>
//             )}
//           </div>

//           <div className="mb-3">
//             <label htmlFor="Unit">
//               <strong>Unit</strong>
//             </label>
//             <select
//               onChange={(e) => {
//                 const value = e.target.value;
//                 if (value === "Other") {
//                   setValues((prev) => ({ ...prev, Unit: "" }));
//                 } else {
//                   setValues((prev) => ({ ...prev, Unit: value }));
//                 }
//               }}
//               className="form-control rounded-0"
//               value={
//                 ["kg", "liter"].includes(values.Unit) ? values.Unit : "Other"
//               }
//             >
//               <option value="">Select unit</option>
//               <option value="kg">kg</option>
//               <option value="liter">liter</option>
//               <option value="Other">Other</option>
//             </select>

//             {/* Show text input for custom unit if "Other" is selected */}
//             {!["kg", "liter"].includes(values.Unit) && (
//               <input
//                 type="text"
//                 placeholder="Enter custom unit"
//                 className="form-control mt-2 rounded-0"
//                 value={values.Unit}
//                 onChange={(e) =>
//                   setValues((prev) => ({ ...prev, Unit: e.target.value }))
//                 }
//               />
//             )}
//             {errors.Unit && <span className="text-danger">{errors.Unit}</span>}
//           </div>

//           <div className="mb-3">
//             <label htmlFor="ReorderLevel">
//               <strong>Reorder Level</strong>
//             </label>
//             <input
//               onChange={handleInput}
//               type="number"
//               placeholder="Enter reorder level"
//               className="form-control rounded-0"
//               name="ReorderLevel"
//             />
//             {errors.ReorderLevel && (
//               <span className="text-danger">{errors.ReorderLevel}</span>
//             )}
//           </div>

//           <div className="mb-3">
//             <label htmlFor="CategoryID">
//               <strong>Category</strong>
//             </label>
//             <select
//               onChange={handleInput}
//               className="form-control rounded-0"
//               name="CategoryID"
//             >
//               <option value="">Select a category</option>
//               {categories.map((category) => (
//                 <option key={category.CategoryID} value={category.CategoryID}>
//                   {category.CategoryName}
//                 </option>
//               ))}
//             </select>
//             {errors.CategoryID && (
//               <span className="text-danger">{errors.CategoryID}</span>
//             )}
//           </div>

//           <button type="submit" className="btn btn-success w-100 rounded-0">
//             Add Product
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddProduct;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function AddProduct() {
//   const [values, setValues] = useState({
//     ProductName: "",
//     Description: "",
//     Unit: "",
//     ReorderLevel: "",
//     CategoryID: "",
//   });

//   const [categories, setCategories] = useState([]);
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const handleInput = (event) => {
//     setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
//   };

//   useEffect(() => {
//     axios
//       .get("http://localhost:3001/api/product-categories")
//       .then((res) => {
//         setCategories(res.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching categories:", err);
//       });
//   }, []);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setErrors({}); // Clear old errors

//     axios
//       .post("http://localhost:3001/api/products", values)
//       .then((res) => {
//         navigate("/products");
//       })
//       .catch((err) => {
//         if (err.response?.data?.errors) {
//           setErrors(err.response.data.errors);
//         } else if (err.response?.data?.error) {
//           alert("Error: " + err.response.data.error);
//         } else {
//           alert("Something went wrong. Try again.");
//         }
//       });
//   };

//   return (
//     <div
//       className="d-flex vh-100 justify-content-center align-items-center"
//       style={{ backgroundColor: "#263043" }}
//     >
//       <div className="w-50 bg-white rounded p-4 shadow">
//         <h3 className="text-center mb-4 text-primary">Add New Product</h3>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="ProductName">
//               <strong>Product Name</strong>
//             </label>
//             <input
//               onChange={handleInput}
//               type="text"
//               placeholder="Enter product name"
//               className={`form-control rounded-0 ${
//                 errors.ProductName ? "is-invalid" : ""
//               }`}
//               name="ProductName"
//               value={values.ProductName}
//             />
//             {errors.ProductName && (
//               <div className="invalid-feedback">{errors.ProductName}</div>
//             )}
//           </div>

//           <div className="mb-3">
//             <label htmlFor="Description">
//               <strong>Description</strong>
//             </label>
//             <textarea
//               onChange={handleInput}
//               placeholder="Enter product description"
//               className="form-control rounded-0"
//               name="Description"
//               value={values.Description}
//             />
//             {errors.Description && (
//               <span className="text-danger">{errors.Description}</span>
//             )}
//           </div>

//           <div className="mb-3">
//             <label htmlFor="Unit">
//               <strong>Unit</strong>
//             </label>
//             <select
//               onChange={(e) => {
//                 const value = e.target.value;
//                 if (value === "Other") {
//                   setValues((prev) => ({ ...prev, Unit: "" }));
//                 } else {
//                   setValues((prev) => ({ ...prev, Unit: value }));
//                 }
//               }}
//               className={`form-control rounded-0 ${
//                 errors.Unit ? "is-invalid" : ""
//               }`}
//               value={
//                 ["kg", "liter"].includes(values.Unit) ? values.Unit : "Other"
//               }
//             >
//               <option value="">Select unit</option>
//               <option value="kg">kg</option>
//               <option value="liter">liter</option>
//               <option value="Other">Other</option>
//             </select>
//             {!["kg", "liter"].includes(values.Unit) && (
//               <input
//                 type="text"
//                 placeholder="Enter custom unit"
//                 className="form-control mt-2 rounded-0"
//                 value={values.Unit}
//                 onChange={(e) =>
//                   setValues((prev) => ({ ...prev, Unit: e.target.value }))
//                 }
//               />
//             )}
//             {errors.Unit && (
//               <div className="invalid-feedback d-block">{errors.Unit}</div>
//             )}
//           </div>

//           <div className="mb-3">
//             <label htmlFor="ReorderLevel">
//               <strong>Reorder Level</strong>
//             </label>
//             <input
//               onChange={handleInput}
//               type="number"
//               placeholder="Enter reorder level"
//               className={`form-control rounded-0 ${
//                 errors.ReorderLevel ? "is-invalid" : ""
//               }`}
//               name="ReorderLevel"
//               value={values.ReorderLevel}
//             />
//             {errors.ReorderLevel && (
//               <div className="invalid-feedback">{errors.ReorderLevel}</div>
//             )}
//           </div>

//           <div className="mb-3">
//             <label htmlFor="CategoryID">
//               <strong>Category</strong>
//             </label>
//             <select
//               onChange={handleInput}
//               className={`form-control rounded-0 ${
//                 errors.CategoryID ? "is-invalid" : ""
//               }`}
//               name="CategoryID"
//               value={values.CategoryID}
//             >
//               <option value="">Select a category</option>
//               {categories.map((category) => (
//                 <option key={category.CategoryID} value={category.CategoryID}>
//                   {category.CategoryName}
//                 </option>
//               ))}
//             </select>
//             {errors.CategoryID && (
//               <div className="invalid-feedback">{errors.CategoryID}</div>
//             )}
//           </div>

//           <button type="submit" className="btn btn-success w-100 rounded-0">
//             Add Product
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddProduct;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddProduct() {
  const [values, setValues] = useState({
    ProductName: "",
    Description: "",
    Unit: "",
    ReorderLevel: "",
    CategoryID: "",
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/product-categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({});

    axios
      .post("http://localhost:3001/api/products", values)
      .then((res) => {
        navigate("/products");
        console.log(res);
      })
      .catch((err) => {
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else {
          alert("An unexpected error occurred.");
        }
      });
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center px-2"
      style={{ backgroundColor: "#263043" }}
    >
      <div
        className="rounded-4 shadow-lg p-4 p-md-5 w-100"
        style={{
          maxWidth: 450,
          width: "100%",
          border: "1px solid #404040",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="text-center mb-4">
          {/* You can use a product icon here if you want */}
          {/* <FaBoxOpen size={40} color="#263043" /> */}
          <h3 className="fw-bold mt-2" style={{ color: "#263043", fontSize: "1.5rem" }}>
            Add New Product
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: 15 }}>
            Create a new product for your inventory.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Show API error if any */}
          {errors.apiError && (
            <div className="alert alert-danger" role="alert">
              {errors.apiError}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="ProductName" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Product Name
            </label>
            <input
              onChange={handleInput}
              type="text"
              placeholder="Enter product name"
              className="form-control rounded-3"
              name="ProductName"
              value={values.ProductName}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: "1rem",
                color: "#000000"
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
              onChange={handleInput}
              placeholder="Enter product description"
              className="form-control rounded-3"
              name="Description"
              value={values.Description}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: "1rem",
                minHeight: 80,
                color: "#000000"
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
              onChange={(e) => {
                const value = e.target.value;
                if (value === "Other") {
                  setValues((prev) => ({ ...prev, Unit: "" }));
                } else {
                  setValues((prev) => ({ ...prev, Unit: value }));
                }
              }}
              className="form-select rounded-3"
              value={
                ["kg", "liter"].includes(values.Unit) ? values.Unit : "Other"
              }
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: "1rem",
                color: "#000000"
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
              <option value="">Select unit</option>
              <option value="kg">kg</option>
              <option value="liter">liter</option>
              <option value="Other">Other</option>
            </select>
            {!["kg", "liter"].includes(values.Unit) && (
              <input
                type="text"
                placeholder="Enter custom unit"
                className="form-control rounded-3 mt-2"
                value={values.Unit}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, Unit: e.target.value }))
                }
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  fontSize: "1rem",
                  color: "#000000"
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
            )}
            {errors.Unit && (
              <span className="text-danger small">{errors.Unit}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="ReorderLevel" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Reorder Level
            </label>
            <input
              onChange={handleInput}
              type="number"
              placeholder="Enter reorder level"
              className="form-control rounded-3"
              name="ReorderLevel"
              value={values.ReorderLevel}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: "1rem",
                color: "#000000"
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

          <div className="mb-3">
            <label htmlFor="CategoryID" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Category
            </label>
            <select
              onChange={handleInput}
              className="form-select rounded-3"
              name="CategoryID"
              value={values.CategoryID}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: "1rem",
                color: "#000000"
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
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
