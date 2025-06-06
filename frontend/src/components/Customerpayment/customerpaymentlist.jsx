import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function CustomerPaymentsList() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const pageSize = 10; // Define the number of records per page

  useEffect(() => {
    fetchCustomerPayments(currentPage);
  }, [currentPage]);

  const fetchCustomerPayments = (page) => {
    setLoading(true);
    axios
      .get(
        `http://localhost:3001/api/customerpayments?page=${page}&pageSize=${pageSize}`
      )
      .then((res) => {
        setData(res.data.customerPayments || []); // Ensure data is set to an array
        setTotalPages(res.data.totalPages || 1); // Ensure totalPages has a default value
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleDelete = (paymentId) => {
    axios
      .delete(`http://localhost:3001/api/customerpayments/${paymentId}`)
      .then((res) => {
        console.log("Customer payment deleted successfully");
        fetchCustomerPayments(currentPage);
      })
      .catch((err) => console.log(err));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ backgroundColor: "#1d2634" }}
    >
      <div className="w-100 w-md-50 bg-white rounded p-3">
        <h2>Customer Payments List</h2>
        <div>
          <Link to={"/customerpayment/add"} className="btn btn-success">
            Add +
          </Link>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th>Payment Date</th>
                  <th>Sale Order</th>
                  <th>Payment Amount</th>
                  <th>Payment Method</th>
                  <th>Payment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.CustomerPaymentID}</td>
                    <td>
                      {payment.Customer ? payment.Customer.CustomerName : "N/A"}
                    </td>
                    <td>
                      {new Date(payment.PaymentDate).toLocaleDateString()}
                    </td>
                    <td>{payment.SalesOrderID}</td>
                    <td>{payment.PaymentAmount}</td>
                    <td>{payment.PaymentMethod}</td>
                    <td>{payment.PaymentStatus}</td>
                    <td>
                      <Link
                        to={`/customerpayment/${payment.CustomerID}`}
                        className="btn btn-sm btn-info"
                      >
                        Read
                      </Link>

                      <Link
                        to={`/customerpayments/update/${payment.CustomerPaymentID}`}
                        className="btn btn-sm btn-primary mx-2"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(payment.PaymentID)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`page-link ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CustomerPaymentsList;
