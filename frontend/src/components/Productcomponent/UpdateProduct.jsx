// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';

// function UpdateProduct() {
//   const { id } = useParams(); // Get the product ID from URL params
//   const [values, setValues] = useState({
//     productName: '',
//     description: '',
//     company: '',
//     unit: '',
//     reorderLevel: '',
//     categoryID: ''
//   });
//   const [categories, setCategories] = useState([]);
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProduct(); // Fetch the product data on component mount
//     fetchCategories(); // Fetch the categories data on component mount
//   }, []);

//   // Function to fetch the product data
//   const fetchProduct = async () => {
//     try {
//       const response = await axios.get(`http://localhost:3001/api/products/${id}`);
//       const { ProductName, Description, Company, Unit, ReorderLevel, CategoryID } = response.data;
//       setValues({
//         productName: ProductName,
//         description: Description,
//         company: Company,
//         unit: Unit,
//         reorderLevel: ReorderLevel,
//         categoryID: CategoryID
//       });
//     } catch (error) {
//       console.error('Error fetching product:', error);
//     }
//   };

//   // Function to fetch the categories data
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/product-categories');
//       setCategories(response.data);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const handleInput = (event) => {
//     const { name, value } = event.target;
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };

// //   const handleSubmit = (event) => {
// //     event.preventDefault();
// //     console.log('Submitting values:', values); // Debug: log form values

// //     axios
// //       .put(`http://localhost:3001/api/products/${id}`, values)
// //       .then((res) => {
// //         console.log('Update response:', res.data); // Debug: log response data
// //         navigate('/products'); // Navigate to products page after successful update
// //       })
// //       .catch((err) => {
// //         console.error('Error updating product:', err);
// //         // You can handle the error state here if needed
// //       });
// //   };
// const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log('Submitting values:', values); // Debug: log form values

//     axios
//       .put(`http://localhost:3001/api/products/${id}`, values)
//       .then((res) => {
//         console.log('Update response:', res.data); // Debug: log response data
//         navigate('/products'); // Navigate to products page after successful update
//       })
//       .catch((err) => {
//         console.error('Error updating product:', err);
//         // You can handle the error state here if needed
//       });
// };

//   return (
//     <div className='d-flex vh-100 justify-content-center align-items-center' style={{ backgroundColor: '#263043' }}>
//       <div className='w-50 bg-white rounded p-3'>
//         <form onSubmit={handleSubmit}>
//           <div className='mb-3'>
//             <label htmlFor='productName'>
//               <strong>Product Name</strong>
//             </label>
//             <input
//               onChange={handleInput}
//               type='text'
//               placeholder='Enter product name'
//               className='form-control rounded-0'
//               name='productName'
//               value={values.productName}
//             />
//             {errors.productName && <span className='text-danger'>{errors.productName}</span>}
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='description'>
//               <strong>Description</strong>
//             </label>
//             <textarea
//               onChange={handleInput}
//               placeholder='Enter product description'
//               className='form-control rounded-0'
//               name='description'
//               value={values.description}
//             />
//             {errors.description && <span className='text-danger'>{errors.description}</span>}
//           </div>

//           <div className='mb-3'>
//             <label htmlFor='unit'>
//               <strong>Unit</strong>
//             </label>
//             <input
//               onChange={handleInput}
//               type='text'
//               placeholder='Enter unit'
//               className='form-control rounded-0'
//               name='unit'
//               value={values.unit}
//             />
//             {errors.unit && <span className='text-danger'>{errors.unit}</span>}
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='reorderLevel'>
//               <strong>Reorder Level</strong>
//             </label>
//             <input
//               onChange={handleInput}
//               type='number'
//               placeholder='Enter reorder level'
//               className='form-control rounded-0'
//               name='reorderLevel'
//               value={values.reorderLevel}
//             />
//             {errors.reorderLevel && <span className='text-danger'>{errors.reorderLevel}</span>}
//           </div>
//           <div className='mb-3'>
//             <label htmlFor='categoryID'>
//               <strong>Category</strong>
//             </label>
//             <select
//               onChange={handleInput}
//               className='form-control rounded-0'
//               name='categoryID'
//               value={values.categoryID}
//             >
//               <option value=''>Select a category</option>
//               {categories.map(category => (
//                 <option key={category.CategoryID} value={category.CategoryID}>
//                   {category.CategoryName}
//                 </option>
//               ))}
//             </select>
//             {errors.categoryID && <span className='text-danger'>{errors.categoryID}</span>}
//           </div>
//           <button type='submit' className='btn btn-success w-100 rounded-0'>
//             Update Product
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default UpdateProduct;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function UpdateProduct() {
  const { id } = useParams(); // Get product ID from URL
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

  useEffect(() => {
    // Fetch product details
    axios
      .get(`http://localhost:3001/api/products/${id}`)
      .then((res) => setValues(res.data))
      .catch((err) => console.error("Error fetching product:", err));

    // Fetch categories
    axios
      .get("http://localhost:3001/api/product-categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, [id]);

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .put(`http://localhost:3001/api/products/${id}`, values)
      .then((res) => {
        navigate("/products");
      })
      .catch((err) => {
        console.error("Error updating product:", err);
      });
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ backgroundColor: "#263043" }}
    >
      <div className="w-50 bg-white rounded p-3">
        <h2 className="text-center mb-4">Update Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="ProductName">
              <strong>Product Name</strong>
            </label>
            <input
              onChange={handleInput}
              type="text"
              value={values.ProductName}
              className="form-control rounded-0"
              name="ProductName"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Description">
              <strong>Description</strong>
            </label>
            <textarea
              onChange={handleInput}
              className="form-control rounded-0"
              name="Description"
              value={values.Description}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Unit">
              <strong>Unit</strong>
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
              className="form-control rounded-0"
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
                className="form-control mt-2 rounded-0"
                value={values.Unit}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, Unit: e.target.value }))
                }
              />
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="ReorderLevel">
              <strong>Reorder Level</strong>
            </label>
            <input
              onChange={handleInput}
              type="number"
              className="form-control rounded-0"
              name="ReorderLevel"
              value={values.ReorderLevel}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="CategoryID">
              <strong>Category</strong>
            </label>
            <select
              onChange={handleInput}
              className="form-control rounded-0"
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
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-0">
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProduct;
