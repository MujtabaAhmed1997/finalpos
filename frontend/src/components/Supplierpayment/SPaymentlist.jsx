import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

function SupplierPaymentsList() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [limit] = useState(5);

  // Fetch supplier payments (either all or filtered)
  const fetchSupplierPayments = async (page, search = "") => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: limit.toString()
      });
      
      if (search && search.trim()) {
        params.append('search', search.trim());
      }

      const url = `http://localhost:3001/api/supplierpayment?${params}`;
      console.log("Making request to:", url);
      
      const res = await axios.get(url);
      console.log("Supplier payments response:", res.data);
      
      const payments = res.data.supplierPayments || [];
      const pages = res.data.totalPages || 1;

      setData(payments);
      setTotalPages(pages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching supplier payments:", error);
      console.error("Error details:", error.response?.data);
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value, page) => {
      fetchSupplierPayments(page, value);
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm, currentPage);
    } else {
      fetchSupplierPayments(currentPage);
    }
  }, [searchTerm, currentPage]);

  const handleDelete = async (paymentId) => {
    try {
      await axios.delete(`http://localhost:3001/api/supplierpayment/${paymentId}`);
      fetchSupplierPayments(currentPage, searchTerm);
    } catch (err) {
      console.error("Error deleting supplier payment:", err);
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
          <div>
            <h2 className="mb-0">Supplier Payments List</h2>
            {searchTerm && (
              <small className="text-muted">
                Showing results for "{searchTerm}"
              </small>
            )}
          </div>
          <input
            type="text"
            className="form-control w-100 w-md-50"
            placeholder="Search by supplier name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to page 1 on search
            }}
          />
          <Link to="/supplierpayments/add" className="btn btn-success">
            Add +
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Supplier Name</th>
                    <th>Payment Date</th>
                    <th>Payment Amount</th>
                    <th>Payment Method</th>
                    <th>Payment Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((payment) => (
                      <tr key={payment.SupplierPaymentID}>
                        <td>{payment.SupplierPaymentID}</td>
                        <td>
                          {payment.Supplier ? payment.Supplier.SupplierName : "N/A"}
                        </td>
                        <td>
                          {new Date(payment.PaymentDate).toLocaleDateString()}
                        </td>
                        <td>${payment.PaymentAmount}</td>
                        <td>{payment.PaymentMethod}</td>
                        <td>
                          <span
                            className={`badge ${
                              payment.PaymentStatus === "Completed"
                                ? "bg-success"
                                : payment.PaymentStatus === "Pending"
                                ? "bg-warning"
                                : "bg-danger"
                            }`}
                          >
                            {payment.PaymentStatus}
                          </span>
                        </td>
                        <td>
                          <Link
                            to={`/supplierpayment/${payment.SupplierID}`}
                            className="btn btn-sm btn-info me-2"
                          >
                            View
                          </Link>
                          <Link
                            to={`/supplierpayments/update/${payment.SupplierPaymentID}`}
                            className="btn btn-sm btn-primary me-2"
                          >
                            Edit
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(payment.SupplierPaymentID)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No supplier payments found.
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
          </>
        )}
      </div>
    </div>
  );
}

export default SupplierPaymentsList;
