import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";

function AllVariation() {
  const [variations, setVariations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch variations (either all or filtered)
  const fetchVariations = async (page, search = "") => {
    try {
      setLoading(true);
      // Use the correct endpoint that supports both search and pagination
      const endpoint = `http://localhost:3001/api/productVariations/all?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;

      const response = await axios.get(endpoint);
      
      if (response.data.variations) {
        setVariations(response.data.variations);
        setTotalPages(response.data.totalPages || 1);
      } else {
        // Fallback for different API response structure
        setVariations(response.data || []);
        setTotalPages(1);
      }
      
      setError(null);
    } catch (error) {
      console.error("Error fetching variations:", error);
      setError("Failed to load variations");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value, page) => {
      fetchVariations(page, value);
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm, currentPage);
    } else {
      fetchVariations(currentPage);
    }
  }, [searchTerm, currentPage]);

  const handleDelete = async (variationId) => {
    if (window.confirm("Are you sure you want to delete this variation?")) {
      try {
        await axios.delete(`http://localhost:3001/api/productVariations/${variationId}`);
        fetchVariations(currentPage, searchTerm);
      } catch (err) {
        console.error("Error deleting variation:", err);
        alert("Failed to delete variation.");
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-start py-4"
      style={{ backgroundColor: "#1d2634" }}
    >
      <div className="col-12 col-md-10 col-lg-8 bg-white rounded p-4 shadow-sm">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-3">
          <h2 className="mb-0">Product Variations</h2>
          <input
            type="text"
            className="form-control w-100 w-md-50"
            placeholder="Search by SKU, Size, or Color..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to page 1 on search
            }}
          />
          <Link to="/variations/add" className="btn btn-success">
            Add +
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>SKU</th>
                  <th>Size</th>
                  <th>Color</th>
                  <th>Price</th>
                  <th>Units</th>
                  <th>Barcode</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {variations.length > 0 ? (
                  variations.map((variation) => (
                    <tr key={variation.VariationID}>
                      <td>{variation.VariationID}</td>
                      <td>{variation.SKU}</td>
                      <td>{variation.Size}</td>
                      <td>{variation.Color || "-"}</td>
                      <td>Rs. {variation.SellingPrice}</td>
                      <td>{variation.UnitsPerPackage}</td>
                      <td>{variation.Barcode || "-"}</td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          <Link
                            to={`/variations/update/${variation.VariationID}`}
                            className="btn btn-sm btn-primary"
                          >
                            Edit
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(variation.VariationID)}
                          >
                            Delete
                          </button>
                          <Link
                            to={`/priceHistory/${variation.VariationID}`}
                            className="btn btn-sm btn-info text-white"
                          >
                            Price History
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No variations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="fw-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-secondary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllVariation;
