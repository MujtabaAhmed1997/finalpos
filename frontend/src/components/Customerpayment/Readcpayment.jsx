import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { get, delete_ } from "../../service/apiClient";

function EachCustomerPaymentsList() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { customerId } = useParams();
  const pageSize = 10; // Define the number of records per page

  useEffect(() => {
    if (customerId) { // Ensure customerId is defined before fetching data
      fetchCustomerPayments(currentPage);
    }
  }, [currentPage, customerId]);

  const fetchCustomerPayments = (page) => {
    setLoading(true);
    get(`/customerpayments/customer/${customerId}?page=${page}&pageSize=${pageSize}`)
      .then(res => {
        const payments = res.data.customerPayments;
        console.log('Fetched payments:', payments); // Log the fetched data
        if (Array.isArray(payments)) { // Check if payments is an array
          setData(payments);
        } else {
          setData([payments]); // Handle the case where a single payment object is returned
        }
        setTotalPages(res.data.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleDelete = (paymentId) => {
    delete_(`/customerpayments/${paymentId}`)
      .then(res => {
        console.log('Customer payment deleted successfully');
        fetchCustomerPayments(currentPage);
      })
      .catch(err => console.log(err));
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
          <h2 className="mb-0">Customer Payments List</h2>
          <Link to={`/customerpayment/add/${customerId}`} className="btn btn-success">
            Add Payment +
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
                    <th>Sale Order</th>
                    <th>Payment Amount</th>
                    <th>Payment Method</th>
                    <th>Payment Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((payment, index) => (
                      payment && (
                        <tr key={index}>
                          <td>{payment.CustomerPaymentID || 'N/A'}</td>
                          <td>{payment.Customer ? payment.Customer.CustomerName : 'N/A'}</td>
                          <td>{new Date(payment.PaymentDate).toLocaleDateString()}</td>
                          <td>{payment.SalesOrderID || 'N/A'}</td>
                          <td>{payment.PaymentAmount || 'N/A'}</td>
                          <td>{payment.PaymentMethod || 'N/A'}</td>
                          <td>{payment.PaymentStatus || 'N/A'}</td>
                          <td>
                            <Link 
                              to={`/customerpayments/detail/${payment.CustomerPaymentID}`} 
                              className="btn btn-sm btn-info me-2"
                            >
                              Read
                            </Link>
                            <Link 
                              to={`/customerpayments/update/${payment.CustomerPaymentID}`} 
                              className="btn btn-sm btn-primary me-2"
                            >
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleDelete(payment.CustomerPaymentID)} 
                              className="btn btn-sm btn-danger"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No payments found.
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

export default EachCustomerPaymentsList;
