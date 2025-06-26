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
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ backgroundColor: "#263043" }}
    >
      <div
        className="bg-white p-5 rounded shadow-lg w-100"
        style={{ maxWidth: "600px" }}
      >
        <h3 className="text-center text-primary mb-4">Add New Product</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="ProductName" className="form-label fw-bold">
              Product Name
            </label>
            <input
              onChange={handleInput}
              type="text"
              placeholder="Enter product name"
              className={`form-control ${
                errors.ProductName ? "is-invalid" : ""
              }`}
              name="ProductName"
              value={values.ProductName}
            />
            {errors.ProductName && (
              <div className="invalid-feedback">{errors.ProductName}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="Description" className="form-label fw-bold">
              Description
            </label>
            <textarea
              onChange={handleInput}
              placeholder="Enter product description"
              className="form-control"
              name="Description"
              value={values.Description}
            />
            {errors.Description && (
              <div className="text-danger mt-1">{errors.Description}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="Unit" className="form-label fw-bold">
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
              className={`form-select ${errors.Unit ? "is-invalid" : ""}`}
              value={
                ["kg", "liter"].includes(values.Unit) ? values.Unit : "Other"
              }
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
                className="form-control mt-2"
                value={values.Unit}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, Unit: e.target.value }))
                }
              />
            )}
            {errors.Unit && (
              <div className="invalid-feedback d-block">{errors.Unit}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="ReorderLevel" className="form-label fw-bold">
              Reorder Level
            </label>
            <input
              onChange={handleInput}
              type="number"
              placeholder="Enter reorder level"
              className={`form-control ${
                errors.ReorderLevel ? "is-invalid" : ""
              }`}
              name="ReorderLevel"
              value={values.ReorderLevel}
            />
            {errors.ReorderLevel && (
              <div className="invalid-feedback">{errors.ReorderLevel}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="CategoryID" className="form-label fw-bold">
              Category
            </label>
            <select
              onChange={handleInput}
              className={`form-select ${errors.CategoryID ? "is-invalid" : ""}`}
              name="CategoryID"
              value={values.CategoryID}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.CategoryID} value={category.CategoryID}>
                  {category.CategoryName}
                </option>
              ))}
            </select>
            {errors.CategoryID && (
              <div className="invalid-feedback">{errors.CategoryID}</div>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100 py-2">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
