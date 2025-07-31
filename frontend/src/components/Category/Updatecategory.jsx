// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";

// function UpdateCategory() {
//   const { id } = useParams(); // Get the category ID from URL params
//   const [values, setValues] = useState({
//     categoryName: "",
//     description: "",
//   });
//   const [errors, setErrors] = useState({});
//   const navigation = useNavigate();

//   useEffect(() => {
//     fetchCategory(); // Fetch the category data on component mount
//   }, []);

//   // Function to fetch the category data
//   const fetchCategory = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:3001/api/product-categories/${id}`
//       );
//       const { CategoryName, Description } = response.data;
//       setValues({ categoryName: CategoryName, description: Description });
//     } catch (error) {
//       console.error("Error fetching category:", error);
//     }
//   };

//   const handleInput = (event) => {
//     setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log("values", values);
//     axios
//       .put(`http://localhost:3001/api/product-categories/${id}`, values)
//       .then((res) => {
//         navigation("/categories"); // Navigate to categories page after successful update
//         console.log(res);
//       })
//       .catch((err) => {
//         console.error("Error updating category:", err);
//         // You can handle the error state here if needed
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
//             <label htmlFor="categoryName">
//               <strong>Category Name</strong>
//             </label>
//             <input
//               onChange={handleInput}
//               type="text"
//               placeholder="Enter category name"
//               className="form-control rounded-0"
//               name="categoryName"
//               value={values.categoryName}
//             />
//             {errors.categoryName && (
//               <span className="text-danger">{errors.categoryName}</span>
//             )}
//           </div>
//           <div className="mb-3">
//             <label htmlFor="description">
//               <strong>Description</strong>
//             </label>
//             <textarea
//               onChange={handleInput}
//               placeholder="Enter category description"
//               className="form-control rounded-0"
//               name="description"
//               value={values.description}
//             />
//             {errors.description && (
//               <span className="text-danger">{errors.description}</span>
//             )}
//           </div>
//           <button type="submit" className="btn btn-success w-100 rounded-0">
//             Update Category
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default UpdateCategory;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

function UpdateCategory() {
  const { id } = useParams();
  const [values, setValues] = useState({
    categoryName: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(""); // New state for backend error
  const navigation = useNavigate();

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/product-categories/${id}`
      );
      const { CategoryName, Description } = response.data;
      setValues({ categoryName: CategoryName, description: Description });
    } catch (error) {
      console.error("Error fetching category:", error);
      setServerError("Failed to load category data.");
    }
  };

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setServerError(""); // Reset before new request

    axios
      .put(`http://localhost:3001/api/product-categories/${id}`, values)
      .then((res) => {
        navigation("/categories");
      })
      .catch((err) => {
        console.error("Error updating category:", err);

        // If error has a response from server with a message, show it
        if (err.response && err.response.data && err.response.data.message) {
          setServerError(err.response.data.message);
        } else {
          setServerError("An unexpected error occurred.");
        }
      });
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
          <FaEdit size={40} color="#263043" />
          <h3 className="fw-bold mt-2" style={{ color: "#263043" }}>
            Update Category
          </h3>
          <p className="text-muted" style={{ fontSize: 15 }}>
            Modify the category information below.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {serverError && (
            <div className="alert alert-danger" role="alert">
              {serverError}
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
            <FaEdit className="me-2 mb-1" />
            Update Category
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCategory;
