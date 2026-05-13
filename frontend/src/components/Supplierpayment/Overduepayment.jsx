import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";
import { get } from "../../service/apiClient";

function Overduepayment() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [error, setError] = useState("");

  // Fetch overdue customers (either all or filtered)
  const fetchOverdueCustomers = async (page, name = "") => {
    try {
      const endpoint = name
        ? `/overdue?search=${encodeURIComponent(name)}&page=${page}&pageSize=${limit}`
        : `/overdue?page=${page}&pageSize=${limit}`;

      const response = await get(endpoint);
      console.log("Response data:", response.data);

      if (Array.isArray(response.data)) {
        setData(response.data);
        setTotalPages(1); // Since the current API doesn't return pagination info
      } else if (response.data.overduePayments) {
        setData(response.data.overduePayments);
        setTotalPages(response.data.totalPages || 1);
      } else {
        console.error("Unexpected response format", response.data);
        setError("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching overdue customers:", error);
      setError("Error fetching overdue customers");
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value, page) => {
      fetchOverdueCustomers(page, value);
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm, currentPage);
    } else {
      fetchOverdueCustomers(currentPage);
    }
  }, [searchTerm, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getLastPaymentDate = (payments) => {
    if (payments && payments.length > 0) {
      const sortedPayments = payments.sort((a, b) => new Date(b.PaymentDate) - new Date(a.PaymentDate));
      return new Date(sortedPayments[0].PaymentDate).toLocaleDateString();
    }
    return "No payments made";
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-start py-4"
      style={{ backgroundColor: "#1d2634" }}
    >
      <div className="col-12 col-md-10 col-lg-8 bg-white rounded p-4 shadow-sm">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-3">
          <h2 className="mb-0">Overdue Customers List</h2>
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
            Add Payment +
          </Link>
        </div>

        {error && <p className="text-danger text-center mb-3">{error}</p>}

        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Last Payment Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((customer) => (
                  <tr key={customer.CustomerID}>
                    <td>{customer.CustomerID}</td>
                    <td>{customer.CustomerName}</td>
                    <td>{customer.Phone}</td>
                    <td>{getLastPaymentDate(customer.CustomerPayments)}</td>
                    <td>
                      <Link
                        to={`/customerpayment/${customer.CustomerID}`}
                        className="btn btn-sm btn-info me-2"
                      >
                        View Payments
                      </Link>
                      <Link
                        to={`/customerpayment/add/${customer.CustomerID}`}
                        className="btn btn-sm btn-success"
                      >
                        Add Payment
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No overdue customers found.
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

export default Overduepayment;
