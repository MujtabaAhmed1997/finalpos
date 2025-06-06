// import React, { useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const AddExpense = () => {
//   const currentDate = new Date().toISOString().split("T")[0];

//   const [expense, setExpense] = useState({
//     ExpenseType: "",
//     Amount: "",
//     Date: currentDate,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setExpense((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("expense", expense);
//     if (!expense.ExpenseType || !expense.Amount || !expense.Date) {
//       setError("Please fill out all fields.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const response = await axios.post(
//         "http://localhost:3001/api/expense/addExpense",
//         {
//           ExpenseType: expense.ExpenseType,
//           Amount: expense.Amount,
//           Date: expense.Date,
//         }
//       );
//       console.log("response", response);
//       setSuccess("Expense added successfully!");
//       setExpense({ ExpenseType: "", Amount: "", Date: "" }); // Reset form
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to add expense. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <div className="card">
//         <div className="card-header bg-primary text-white">
//           <h4 className="text-center">Add Expense</h4>
//         </div>
//         <div className="card-body">
//           {error && <div className="alert alert-danger">{error}</div>}
//           {success && <div className="alert alert-success">{success}</div>}
//           <form onSubmit={handleSubmit}>
//             {/* Expense Type */}
//             <div className="mb-3">
//               <label htmlFor="ExpenseType" className="form-label">
//                 Expense Type
//               </label>
//               <select
//                 id="ExpenseType"
//                 name="ExpenseType"
//                 value={expense.ExpenseType}
//                 onChange={handleChange}
//                 className="form-select"
//               >
//                 <option value="">Select an expense type</option>
//                 <option value="Lunch">Lunch</option>
//                 <option value="Tea">Tea</option>
//                 <option value="Transport">Transport</option>
//                 <option value="Labour">Labour</option>
//                 <option value="Electricity Bill">Electricity Bill</option>
//               </select>
//             </div>

//             {/* Amount */}
//             <div className="mb-3">
//               <label htmlFor="Amount" className="form-label">
//                 Amount
//               </label>
//               <input
//                 type="float"
//                 id="Amount"
//                 name="Amount"
//                 value={expense.Amount}
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="Enter amount"
//               />
//             </div>

//             {/* Date */}
//             <div className="mb-3">
//               <label htmlFor="Date" className="form-label">
//                 Date
//               </label>
//               <input
//                 type="date"
//                 id="Date"
//                 name="Date"
//                 value={expense.Date}
//                 onChange={handleChange}
//                 className="form-control"
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="d-grid">
//               <button
//                 type="submit"
//                 className="btn btn-success"
//                 disabled={loading}
//               >
//                 {loading ? "Adding..." : "Add Expense"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddExpense;

import React, { useState, useEffect } from "react";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import "bootstrap/dist/css/bootstrap.min.css";

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
      const res = await axios.get("http://localhost:3001/api/expensetype/all");
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
        const response = await axios.post(
          "http://localhost:3001/api/expensetype/addtype",
          {
            TypeName: selectedOption.value,
          }
        );

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
      const response = await axios.post(
        "http://localhost:3001/api/expense/addExpense",
        {
          ExpenseType: expense.ExpenseType,
          Amount: expense.Amount,
          Date: expense.Date,
        }
      );
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
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h4 className="text-center">Add Expense</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            {/* Expense Type */}
            <div className="mb-3">
              <label className="form-label">Expense Type</label>
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
              />
            </div>

            {/* Amount */}
            <div className="mb-3">
              <label htmlFor="Amount" className="form-label">
                Amount
              </label>
              <input
                type="number"
                id="Amount"
                name="Amount"
                value={expense.Amount}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter amount"
              />
            </div>

            {/* Date */}
            <div className="mb-3">
              <label htmlFor="Date" className="form-label">
                Date
              </label>
              <input
                type="date"
                id="Date"
                name="Date"
                value={expense.Date}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Submit Button */}
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Expense"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
