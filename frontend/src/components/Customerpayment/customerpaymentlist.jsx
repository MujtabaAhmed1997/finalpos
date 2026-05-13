import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { get, delete_ } from "../../service/apiClient";

function CustomerPaymentsList() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [limit] = useState(5);

  // Fetch customer payments (either all or filtered)
  const fetchCustomerPayments = async (page, search = "") => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: limit.toString()
      });
      
      if (search && search.trim()) {
        params.append('search', search.trim());
      }

      const url = `/customerpayments?${params}`;
      console.log("Making request to:", url);
      
      const res = await get(url);
      console.log("Customer payments response:", res.data);
      
      const payments = res.data.customerPayments || [];
      const pages = res.data.totalPages || 1;

      setData(payments);
      setTotalPages(pages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customer payments:", error);
      console.error("Error details:", error.response?.data);
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value, page) => {
      fetchCustomerPayments(page, value);
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm, currentPage);
    } else {
      fetchCustomerPayments(currentPage);
    }
  }, [searchTerm, currentPage]);

  const handleDelete = async (paymentId) => {
    try {
      await delete_(`/customerpayments/${paymentId}`);
      fetchCustomerPayments(currentPage, searchTerm);
    } catch (err) {
      console.error("Error deleting customer payment:", err);
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
            <h2 className="mb-0">Customer Payments List</h2>
            {searchTerm && (
              <small className="text-muted">
                Showing results for "{searchTerm}"
              </small>
            )}
          </div>
          <input
            type="text"
            className="form-control w-100 w-md-50"
            placeholder="Search by customer name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to page 1 on search
            }}
          />
          <Link to="/customerpayment/add" className="btn btn-success">
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
                    <th>Customer Name</th>
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
                      <tr key={payment.CustomerPaymentID}>
                        <td>{payment.CustomerPaymentID}</td>
                        <td>
                          {payment.Customer ? payment.Customer.CustomerName : "N/A"}
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
                            to={`/customerpayment/${payment.CustomerID}`}
                            className="btn btn-sm btn-info me-2"
                          >
                            View
                          </Link>
                          <Link
                            to={`/customerpayments/update/${payment.CustomerPaymentID}`}
                            className="btn btn-sm btn-primary me-2"
                          >
                            Edit
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(payment.CustomerPaymentID)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No customer payments found.
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

export default CustomerPaymentsList;
