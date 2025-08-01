import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";

function PriceRuleList() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch price rules (either all or filtered)
  const fetchPriceRules = async (page, search = "") => {
    try {
      setLoading(true);
      const endpoint = search
        ? `http://localhost:3001/api/pricerule/search?sku=${search}&page=${page}&limit=${limit}`
        : `http://localhost:3001/api/pricerule?page=${page}&limit=${limit}`;

      const response = await axios.get(endpoint);
      const priceRules = response.data.data || response.data;
      const pages = response.data.totalPages || 1;

      setData(priceRules);
      setTotalPages(pages);
      setError(null);
    } catch (error) {
      console.error("Error fetching price rules:", error);
      setError("Failed to fetch price rules");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value, page) => {
      fetchPriceRules(page, value);
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm, currentPage);
    } else {
      fetchPriceRules(currentPage);
    }
  }, [searchTerm, currentPage]);

  const handleDelete = async (priceRuleId) => {
    if (window.confirm("Are you sure you want to delete this price rule?")) {
      try {
        await axios.delete(`http://localhost:3001/api/pricerule/${priceRuleId}`);
        fetchPriceRules(currentPage, searchTerm);
      } catch (error) {
        console.error("Error deleting price rule:", error);
        setError("Failed to delete price rule");
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#1d2634' }}>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#1d2634' }}>
        <div className="text-white">{error}</div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-start py-4"
      style={{ backgroundColor: "#1d2634" }}
    >
      <div className="col-12 col-md-10 col-lg-8 bg-white rounded p-4 shadow-sm">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-3">
          <h2 className="mb-0">Price Rules List</h2>
          <input
            type="text"
            className="form-control w-100 w-md-50"
            placeholder="Search by SKU..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to page 1 on search
            }}
          />
          <Link to="/pricerule/add" className="btn btn-success">
            Add +
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Variation SKU</th>
                <th>Min Quantity (kg)</th>
                <th>Max Quantity (kg)</th>
                <th>Price per kg</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((rule) => (
                  <tr key={rule.id}>
                    <td>{rule.id}</td>
                    <td>{rule.ProductVariation?.SKU || 'N/A'}</td>
                    <td>{rule.min_quantity}</td>
                    <td>{rule.max_quantity}</td>
                    <td>${rule.price_per_kg}</td>
                    <td>
                      <Link
                        to={`/pricerule/edit/${rule.id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(rule.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No price rules found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      </div>
    </div>
  );
}

export default PriceRuleList;
