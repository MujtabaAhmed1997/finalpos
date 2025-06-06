import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Pagination } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewAllExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch all expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          "http://localhost:3001/api/expense/allexpenses"
        );
        setExpenses(response.data.expenses || []);
      } catch (err) {
        setError("Failed to fetch expenses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Handle delete
  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;

    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:3001/api/expense/deleteExpense/${id}`
      );
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      setSuccess("Expense deleted successfully!");
    } catch (err) {
      setError("Failed to delete expense. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000); // Clear success message after 3 seconds
    }
  };

  // Handle update
  const handleUpdate = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedExpense(null);
    setShowModal(false);
  };

  const handleModalSave = async () => {
    if (
      !selectedExpense.ExpenseType ||
      !selectedExpense.Amount ||
      !selectedExpense.Date
    ) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3001/api/expense/updateExpense/${selectedExpense.id}`,
        selectedExpense
      );
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === selectedExpense.id ? selectedExpense : exp
        )
      );
      setSuccess("Expense updated successfully!");
      handleModalClose();
    } catch (err) {
      setError("Failed to update expense. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setError(""), 3000); // Clear error message after 3 seconds
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedExpense((prev) => ({ ...prev, [name]: value }));
  };

  // Pagination logic
  const totalItems = expenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedExpenses = expenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">View All Expenses</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <Table responsive className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Expense Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center">
                Loading...
              </td>
            </tr>
          ) : paginatedExpenses.length > 0 ? (
            paginatedExpenses.map((expense, index) => (
              <tr key={expense.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{expense.ExpenseType}</td>
                <td>{expense.Amount}</td>
                <td>{new Date(expense.Date).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleUpdate(expense)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteExpense(expense.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* Modal for Update */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="ExpenseType">
              <Form.Label>Expense Type</Form.Label>
              <Form.Control
                type="text"
                name="ExpenseType"
                value={selectedExpense?.ExpenseType || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="Amount" className="mt-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="Amount"
                value={selectedExpense?.Amount || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="Date" className="mt-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="Date"
                value={
                  selectedExpense?.Date
                    ? new Date(selectedExpense.Date).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleModalSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewAllExpenses;
