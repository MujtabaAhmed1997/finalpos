import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { FaPlusCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { get, post } from "../../service/apiClient";

const AddExpense = () => {
  const currentDate = new Date().toISOString().split("T")[0];

  const [expense, setExpense] = useState({
    ExpenseType: "",
    Amount: "",
    Date: currentDate,
  });
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchExpenseTypes();
  }, []);

  const fetchExpenseTypes = async () => {
    try {
      const res = await get("/expensetype/all");
      const options = res.data.map((type) => ({
        label: type.TypeName,
        value: type.TypeName,
      }));
      setExpenseTypes(options);
    } catch (err) {
      console.error("Failed to fetch expense types:", err);
    }
  };

  const handleTypeChange = async (selectedOption) => {
    if (!selectedOption) return;

    if (selectedOption.__isNew__) {
      // New option was typed
      try {
        const response = await post("/expensetype/addtype", {
          TypeName: selectedOption.value,
        });

        const newOption = {
          label: response.data.TypeName,
          value: response.data.TypeName,
        };

        setExpense((prev) => ({ ...prev, ExpenseType: newOption.value }));
        setExpenseTypes((prev) => [...prev, newOption]);
      } catch (err) {
        setError("Failed to create new expense type.");
      }
    } else {
      setExpense((prev) => ({
        ...prev,
        ExpenseType: selectedOption.value,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expense.ExpenseType || !expense.Amount || !expense.Date) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await post("/expense/addExpense", {
        ExpenseType: expense.ExpenseType,
        Amount: expense.Amount,
        Date: expense.Date,
      });
      setSuccess("Expense added successfully!");
      setExpense({ ExpenseType: "", Amount: "", Date: currentDate });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add expense. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{
        backgroundColor: "#263043",
      }}
    >
      <div
        className="rounded-4 shadow-lg p-5"
        style={{
          minWidth: 400,
          maxWidth: 450,
          width: "100%",
          border: "1px solid #404040",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="text-center mb-4">
          <FaPlusCircle size={40} color="#263043" />
          <h3 className="fw-bold mt-2" style={{ color: "#263043" }}>
            Add New Expense
          </h3>
          <p className="text-muted" style={{ fontSize: 15 }}>
            Record a new expense for your business.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: "#263043" }}>
              Expense Type
            </label>
            <CreatableSelect
              isClearable
              onChange={handleTypeChange}
              options={expenseTypes}
              value={
                expense.ExpenseType
                  ? { label: expense.ExpenseType, value: expense.ExpenseType }
                  : null
              }
              placeholder="Select or create an expense type"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  background: "#f8f9fa",
                  border: state.isFocused ? "1px solid #263043" : "1px solid #dee2e6",
                  borderRadius: "12px",
                  boxShadow: state.isFocused 
                    ? "0 0 0 0.2rem rgba(38, 48, 67, 0.25)" 
                    : "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "all 0.2s",
                  minHeight: "45px",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? "#263043" : state.isFocused ? "#f8f9fa" : "white",
                  color: state.isSelected ? "white" : "#263043",
                  cursor: "pointer",
                }),
                menu: (provided) => ({
                  ...provided,
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }),
              }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Amount" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Amount
            </label>
            <input
              type="number"
              id="Amount"
              name="Amount"
              value={expense.Amount}
              onChange={handleChange}
              className="form-control rounded-3"
              placeholder="Enter amount"
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                minHeight: "45px",
              }}
              onFocus={e => {
                e.target.style.borderColor = "#263043";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#dee2e6";
                e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="Date" className="form-label fw-semibold" style={{ color: "#263043" }}>
              Date
            </label>
            <input
              type="date"
              id="Date"
              name="Date"
              value={expense.Date}
              onChange={handleChange}
              className="form-control rounded-3"
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                minHeight: "45px",
              }}
              onFocus={e => {
                e.target.style.borderColor = "#263043";
                e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#dee2e6";
                e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
              }}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 rounded-3 fw-bold"
            disabled={loading}
            style={{
              background: "#263043",
              border: "none",
              fontSize: 18,
              letterSpacing: 1,
              boxShadow: "0 4px 12px rgba(38, 48, 67, 0.3)",
              transition: "all 0.3s",
              color: "white",
              minHeight: "50px",
            }}
            onMouseOver={e => {
              if (!loading) {
                e.target.style.background = "#1a2332";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(38, 48, 67, 0.4)";
              }
            }}
            onMouseOut={e => {
              if (!loading) {
                e.target.style.background = "#263043";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(38, 48, 67, 0.3)";
              }
            }}
          >
            <FaPlusCircle className="me-2 mb-1" />
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
