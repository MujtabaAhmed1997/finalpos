

import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { Link } from "react-router-dom";
import { get, delete_ } from "../../service/apiClient";

function CustomerComponent() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  // Fetch customers (either all or filtered)
  const fetchCustomers = async (page, name = "") => {
    const endpoint = name
      ? `/customers/searching?name=${encodeURIComponent(name)}&page=${page}&limit=${limit}`
      : `/customers?page=${page}&limit=${limit}`;

    try {
      const res = await get(endpoint);
      console.log("name", name);
      const customers = res.data.data;
      const pages = res.data.totalPages;

      const customerDataWithBalances = await Promise.all(
        customers.map(async (customer) => {
          const lastBalance = await fetchLastBalance(customer.CustomerID);
          return { ...customer, AvailableBalance: lastBalance };
        })
      );

      setData(customerDataWithBalances);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value, page) => {
      fetchCustomers(page, value);
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm, currentPage);
    } else {
      fetchCustomers(currentPage);
    }
  }, [searchTerm, currentPage]);

  const fetchLastBalance = async (customerId) => {
    try {
      const res = await get(`/customers/customerleisure/lastbalance/${customerId}`);
      return res.data.lastBalance;
    } catch (err) {
      console.error("Error fetching last balance:", err);
      return 0;
    }
  };

  const handleDelete = async (customerId) => {
    try {
      await delete_(`/customers/${customerId}`);
      fetchCustomers(currentPage, searchTerm);
    } catch (err) {
      console.error("Error deleting customer:", err);
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
          <h2 className="mb-0">Customers List</h2>
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
          <Link to="/customers/add" className="btn btn-success">
            Add +
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Available Balance</th>
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
                    <td>{customer.AvailableBalance}</td>
                    <td>
                      <Link
                        to={`/customers/update/${customer.CustomerID}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(customer.CustomerID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No customers found.
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

export default CustomerComponent;
