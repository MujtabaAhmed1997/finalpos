import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { Link, useParams } from "react-router-dom";
import { useConfirm } from "../../ui/confirm/ConfirmProvider";
import { useToast } from "../../ui/toast/ToastProvider";
import { get, delete_ } from "../../service/apiClient";
import { useInvalidate } from "../../context/DataRefreshContext";
import { useListRefresh } from "../../hooks/useListRefresh";

function Variations() {
  const { id: productId } = useParams();
  const [variations, setVariations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productName, setProductName] = useState("");
  const { confirm } = useConfirm();
  const toast = useToast();
  const invalidate = useInvalidate();

  const fetchVariations = async (page, search = "") => {
    try {
      setLoading(true);

      if (productId) {
        const [varRes, prodRes] = await Promise.all([
          get(`/products/${productId}/variations`),
          get(`/products/${productId}`),
        ]);
        const rows = Array.isArray(varRes.data) ? varRes.data : varRes.data?.variations || [];
        const filtered = search.trim()
          ? rows.filter(v =>
              v.SKU?.toLowerCase().includes(search.toLowerCase()) ||
              v.Size?.toLowerCase().includes(search.toLowerCase())
            )
          : rows;
        setVariations(filtered);
        setTotalPages(1);
        const prod = prodRes.data?.product || prodRes.data;
        setProductName(prod?.ProductName || "");
      } else {
        const endpoint = search
          ? `/productVariations/search?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`
          : `/productVariations/all?page=${page}&limit=${limit}`;
        const response = await get(endpoint);
        if (response.data.variations) {
          setVariations(response.data.variations);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setVariations(response.data || []);
          setTotalPages(1);
        }
        setProductName("");
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching variations:", err);
      setError("Failed to load variations");
      setVariations([]);
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

  useListRefresh('variations', () => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm, currentPage);
    } else {
      fetchVariations(currentPage);
    }
  });

  const handleDelete = async (variationId) => {
    const ok = await confirm({
      title: "Delete variation?",
      description: "This will permanently remove the variation.",
      confirmText: "Delete",
      cancelText: "Cancel",
      tone: "danger",
    });
    if (!ok) return;

    try {
      await delete_(`/productVariations/${variationId}`);
      toast.success("Variation deleted.");
      invalidate(['variations', 'products']);
      fetchVariations(currentPage, searchTerm);
    } catch (err) {
      console.error("Error deleting variation:", err);
      toast.error("Failed to delete variation.");
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
          <h2 className="mb-0">
            Product Variations{productName ? ` — ${productName}` : ""}
          </h2>
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
          <Link
            to={productId ? `/variations/add/${productId}` : "/variations/add"}
            className="btn btn-success"
          >
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
                  <th>Action</th>
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

export default Variations;
