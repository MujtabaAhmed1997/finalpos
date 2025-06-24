// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./allvariation.css";

// function AllVariation() {
//   const [variations, setVariations] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const pageSize = 10;

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchVariations();
//   }, [currentPage, searchTerm]);

//   const fetchVariations = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         "http://localhost:3001/api/productVariations/all",
//         {
//           params: {
//             page: currentPage,
//             limit: pageSize,
//             search: searchTerm,
//           },
//         }
//       );
//       setVariations(response.data.variations || []);
//       setTotalPages(response.data.totalPages || 1);
//       setError(null);
//     } catch (err) {
//       console.error("Error fetching variations:", err);
//       setError("Failed to load variations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this variation?")) {
//       try {
//         await axios.delete(`/api/product-variations/${id}`);
//         fetchVariations();
//       } catch (err) {
//         alert("Failed to delete variation.");
//       }
//     }
//   };

//   const handleUpdate = (id) => {
//     navigate(`/update-product-variation/${id}`);
//   };

//   const handlePriceHistory = (id) => {
//     navigate(`/price-history/${id}`);
//   };

//   const handlePageChange = (direction) => {
//     const newPage = currentPage + direction;
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   return (
//     <div className="container my-4">
//       <div className="bg-white shadow-sm rounded p-3 p-md-4">
//         <h2 className="mb-4 text-center text-primary">
//           All Product Variations
//         </h2>

//         <input
//           type="text"
//           className="form-control mb-3"
//           placeholder="Search by SKU or Size..."
//           value={searchTerm}
//           onChange={handleSearch}
//         />

//         {loading ? (
//           <div className="text-center py-4">Loading...</div>
//         ) : error ? (
//           <div className="alert alert-danger text-center">{error}</div>
//         ) : (
//           <div className="table-container">
//             <table className="table table-bordered table-striped text-center align-middle">
//               <thead className="table-dark">
//                 <tr>
//                   <th>ID</th>
//                   <th>SKU</th>
//                   <th>Size</th>
//                   <th>Color</th>
//                   <th>Price</th>
//                   <th>Units</th>
//                   <th>Barcode</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {variations.length > 0 ? (
//                   variations.map((variation) => (
//                     <tr key={variation.VariationID}>
//                       <td>{variation.VariationID}</td>
//                       <td>{variation.SKU}</td>
//                       <td>{variation.Size}</td>
//                       <td>{variation.Color || "-"}</td>
//                       <td>Rs. {variation.SellingPrice}</td>
//                       <td>{variation.UnitsPerPackage}</td>
//                       <td>{variation.Barcode || "-"}</td>
//                       <td>
//                         <div className="action-buttons">
//                           <button
//                             className="btn btn-sm btn-danger"
//                             onClick={() => handleDelete(variation.VariationID)}
//                           >
//                             Delete
//                           </button>
//                           <button
//                             className="btn btn-sm btn-warning"
//                             onClick={() => handleUpdate(variation.VariationID)}
//                           >
//                             Update
//                           </button>
//                           <button
//                             className="btn btn-sm btn-info text-white"
//                             onClick={() =>
//                               handlePriceHistory(variation.VariationID)
//                             }
//                           >
//                             Price History
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="text-center py-3">
//                       No variations found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
//           <button
//             className="btn btn-outline-primary"
//             disabled={currentPage === 1}
//             onClick={() => handlePageChange(-1)}
//           >
//             Previous
//           </button>
//           <span className="fw-bold">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             className="btn btn-outline-primary"
//             disabled={currentPage === totalPages}
//             onClick={() => handlePageChange(1)}
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AllVariation;

import React, { useState, useEffect } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./variation.css";

function AllVariation() {
  const { id } = useParams();
  const [variations, setVariations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVariations();
  }, []);

  const fetchVariations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/productVariations/all`
      );
      const fetchedVariations = response.data;

      if (!Array.isArray(fetchedVariations)) {
        throw new Error("Expected array, received non-array data");
      }

      const availableIcons = shuffleIcons();

      const variationsWithIcons = fetchedVariations.map((variation, index) => ({
        ...variation,
        icon: availableIcons[index % availableIcons.length],
      }));

      setVariations(variationsWithIcons);
    } catch (error) {
      console.error("Error fetching variations:", error);
    }
  };

  const shuffleIcons = () => {
    const icons = [
      <BsFillArchiveFill className="card_icon" />,
      <BsFillGrid3X3GapFill className="card_icon" />,
      <BsPeopleFill className="card_icon" />,
      <BsFillBellFill className="card_icon" />,
    ];

    for (let i = icons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [icons[i], icons[j]] = [icons[j], icons[i]];
    }

    return icons;
  };

  const handleDeleteVariation = async (variationId) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/productVariations/${variationId}`
      );
      fetchVariations();
    } catch (error) {
      console.error("Error deleting variation:", error);
    }
  };

  const handleUpdateVariation = (variationId) => {
    navigate(`/variations/update/${variationId}`);
  };

  const handleAddVariation = () => {
    navigate("/variations/add");
  };

  const handleViewPriceHistory = (variationId) => {
    navigate(`/priceHistory/${variationId}`);
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>VARIATIONS</h3>
      </div>

      <div className="main-cards">
        {variations.map((variation, index) => (
          <div className={`card card-${index}`} key={variation.VariationID}>
            <div className="card-inner">
              <h3>{variation.SKU}</h3>
              {variation.UnitsPerPackage}
            </div>
            <h1>{variation.Size}</h1>
            <div className="card-buttons">
              <button
                className="delete-button"
                onClick={() => handleDeleteVariation(variation.VariationID)}
              >
                Delete
              </button>
              <button
                className="update-button"
                onClick={() => handleUpdateVariation(variation.VariationID)}
              >
                Update
              </button>
              <button
                className="price-history-button"
                onClick={() => handleViewPriceHistory(variation.VariationID)}
              >
                Price History
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="add-variation-button">
        <button onClick={handleAddVariation}>Add Variation</button>
      </div>
    </main>
  );
}

export default AllVariation;
