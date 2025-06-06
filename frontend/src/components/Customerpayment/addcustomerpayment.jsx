// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { validatePayment } from "../../controllers/cpaymentvalidator";

// function AddHomeCustomerPayment() {
//   const todayDate = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
//   const navigate = useNavigate();

//   const [values, setValues] = useState({
//     CustomerID: "",
//     PaymentDate: todayDate, // Set default date
//     PaymentAmount: "",
//     PaymentMethod: "",
//     PaymentStatus: "",
//   });

//   const [customers, setCustomers] = useState([]); // Store all customers
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     // Fetch all customers
//     axios
//       .get("http://localhost:3001/api/customers")
//       .then((res) => {
//         setCustomers(res.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching customers:", err);
//       });

//     // Fetch Sales Order details
//     // axios
//     //   .get(`http://localhost:3001/api/sales-orders/${id}`)
//     //   .then((res) => {
//     //     const customerID = res.data.CustomerID;
//     //     setValues((prev) => ({ ...prev, CustomerID: customerID }));
//     //   })
//     //   .catch((err) => {
//     //     console.error("Error fetching sales order:", err);
//     //   });
//   });

//   const handleInput = (event) => {
//     const { name, value } = event.target;
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };

//   //   const handleSubmit = (event) => {
//   //     event.preventDefault();
//   //     const validationErrors = validatePayment(values);
//   //     setErrors(validationErrors);

//   //     if (Object.keys(validationErrors).length === 0) {
//   //       setIsSubmitting(true);
//   //       console.log("values", values);
//   //       axios
//   //         .post("http://localhost:3001/api/customerpayments", values)
//   //         .then((res) => {
//   //           navigate(`/customerpayment/list`);
//   //         })
//   //         .catch((err) => {
//   //           console.error("Error adding payment:", err);
//   //         })
//   //         .finally(() => {
//   //           setIsSubmitting(false);
//   //         });
//   //     }
//   //   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const validationErrors = validatePayment(values);
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       setIsSubmitting(true);

//       axios
//         .post("http://localhost:3001/api/customerpayments", values)
//         .then((res) => {
//           const paymentData = res.data;

//           // Calculate the balance (assuming this logic needs to be done on the client-side)
//           // const newBalance = /* logic to calculate new balance */;

//           // Create leisure entry
//           const leisureEntry = {
//             CustomerID: paymentData.CustomerID,
//             TransactionType: "Payment",
//             TransactionID: paymentData.CustomerPaymentID,
//             TransactionDate: paymentData.PaymentDate,
//             Debit: parseFloat(paymentData.PaymentAmount), // Debit for payment
//             // Balance: newBalance,
//             Description: "Payment received via " + paymentData.PaymentMethod,
//           };

//           return axios.post(
//             "http://localhost:3001/api/customerleisure/create",
//             leisureEntry
//           );
//         })
//         .then((res) => {
//           console.log("Leisure entry added:", res.data);
//           navigate(`/customerpayment/list`); // Navigate to update sales order page after successful submission
//         })
//         .catch((err) => {
//           console.error("Error adding payment or leisure entry:", err);
//         })
//         .finally(() => {
//           setIsSubmitting(false);
//         });
//     }
//   };

//   return (
//     <div
//       className="d-flex vh-100 justify-content-center align-items-center"
//       style={{ backgroundColor: "#263043" }}
//     >
//       <div className="w-50 bg-white rounded p-3">
//         <form onSubmit={handleSubmit}>
//           {/* Customer Dropdown */}
//           <div className="mb-3">
//             <label htmlFor="CustomerID">
//               <strong>Customer</strong>
//             </label>
//             <select
//               className="form-control rounded-0"
//               name="CustomerID"
//               value={values.CustomerID}
//               onChange={handleInput}
//             >
//               <option value="">Select Customer</option>
//               {customers.map((customer) => (
//                 <option key={customer.CustomerID} value={customer.CustomerID}>
//                   {customer.CustomerName}
//                 </option>
//               ))}
//             </select>
//             {errors.CustomerID && (
//               <span className="text-danger">{errors.CustomerID}</span>
//             )}
//           </div>

//           {/* Sales Order ID (Read-Only) */}
//           {/* <div className="mb-3">
//             <label htmlFor="SalesOrderID">
//               <strong>Sales Order ID</strong>
//             </label>
//             <input
//               type="text"
//               className="form-control rounded-0"
//               name="SalesOrderID"
//               value={values.SalesOrderID}
//               readOnly
//             />
//           </div> */}

//           {/* Payment Date */}
//           <div className="mb-3">
//             <label htmlFor="PaymentDate">
//               <strong>Payment Date</strong>
//             </label>
//             <input
//               type="date"
//               className="form-control rounded-0"
//               name="PaymentDate"
//               value={values.PaymentDate}
//               onChange={handleInput}
//             />
//             {errors.PaymentDate && (
//               <span className="text-danger">{errors.PaymentDate}</span>
//             )}
//           </div>

//           {/* Payment Amount */}
//           <div className="mb-3">
//             <label htmlFor="PaymentAmount">
//               <strong>Payment Amount</strong>
//             </label>
//             <input
//               type="number"
//               placeholder="Enter payment amount"
//               className="form-control rounded-0"
//               name="PaymentAmount"
//               value={values.PaymentAmount}
//               onChange={handleInput}
//             />
//             {errors.PaymentAmount && (
//               <span className="text-danger">{errors.PaymentAmount}</span>
//             )}
//           </div>

//           {/* Payment Method */}
//           <div className="mb-3">
//             <label htmlFor="PaymentMethod">
//               <strong>Payment Method</strong>
//             </label>
//             <input
//               type="text"
//               placeholder="Enter payment method"
//               className="form-control rounded-0"
//               name="PaymentMethod"
//               value={values.PaymentMethod}
//               onChange={handleInput}
//             />
//             {errors.PaymentMethod && (
//               <span className="text-danger">{errors.PaymentMethod}</span>
//             )}
//           </div>

//           {/* Payment Status */}
//           <div className="mb-3">
//             <label htmlFor="PaymentStatus">
//               <strong>Payment Status</strong>
//             </label>
//             <input
//               type="text"
//               placeholder="Enter payment status"
//               className="form-control rounded-0"
//               name="PaymentStatus"
//               value={values.PaymentStatus}
//               onChange={handleInput}
//             />
//             {errors.PaymentStatus && (
//               <span className="text-danger">{errors.PaymentStatus}</span>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="btn btn-success w-100 rounded-0"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Adding..." : "Add Payment"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddHomeCustomerPayment;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validatePayment } from "../../controllers/cpaymentvalidator";
// function AddHomeCustomerPayment() {
//   const todayDate = new Date().toISOString().split("T")[0];
//   const navigate = useNavigate();

//   const [values, setValues] = useState({
//     CustomerID: "",
//     PaymentDate: todayDate,
//     PaymentAmount: "",
//     PaymentMethod: "",
//     PaymentStatus: "",
//   });

//   const [customers, setCustomers] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [fetchError, setFetchError] = useState("");

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const res = await axios.get("http://localhost:3001/api/customers");
//         setCustomers(res.data);
//       } catch (err) {
//         console.error("Error fetching customers:", err);
//         setFetchError("Failed to load customers.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchCustomers();
//   }, []);

//   const handleInput = (event) => {
//     const { name, value } = event.target;
//     setValues((prev) => ({ ...prev, [name]: value }));
//   };

//   // const handleSubmit = async (event) => {
//   //   event.preventDefault();
//   //   const validationErrors = validatePayment(values);
//   //   setErrors(validationErrors);

//   //   if (Object.keys(validationErrors).length === 0) {
//   //     setIsSubmitting(true);
//   //     try {
//   //       const { data: paymentData } = await axios.post(
//   //         "http://localhost:3001/api/customerpayments",
//   //         values
//   //       );

//   //       const leisureEntry = {
//   //         CustomerID: paymentData.CustomerID,
//   //         TransactionType: "Payment",
//   //         TransactionID: paymentData.CustomerPaymentID,
//   //         TransactionDate: paymentData.PaymentDate,
//   //         Debit: parseFloat(paymentData.PaymentAmount),
//   //         Description: `Payment received via ${paymentData.PaymentMethod}`,
//   //       };

//   //       await axios.post(
//   //         "http://localhost:3001/api/customerleisure/create",
//   //         leisureEntry
//   //       );
//   //       navigate("/customerpayment/list");
//   //     } catch (err) {
//   //       console.error("Error adding payment:", err);
//   //       setErrors({ apiError: "Failed to process payment. Please try again." });
//   //     } finally {
//   //       setIsSubmitting(false);
//   //     }
//   //   }
//   // };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log("Form submitted, validating data...");

//     const validationErrors = validatePayment(values);
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length === 0) {
//       console.log("Validation passed, sending payment request...");
//       setIsSubmitting(true);

//       axios
//         .post("http://localhost:3001/api/customerpayments", values)
//         .then((res) => {
//           console.log("Payment added successfully:", res.data);
//           const paymentData = res.data;

//           const leisureEntry = {
//             CustomerID: paymentData.CustomerID,
//             TransactionType: "Payment",
//             TransactionID: paymentData.CustomerPaymentID,
//             TransactionDate: paymentData.PaymentDate,
//             Debit: parseFloat(paymentData.PaymentAmount),
//             Description: "Payment received via " + paymentData.PaymentMethod,
//           };

//           console.log("Adding leisure entry:", leisureEntry);

//           return axios.post(
//             "http://localhost:3001/api/customerleisure/create",
//             leisureEntry
//           );
//         })
//         .then(() => {
//           console.log("Leisure entry added, navigating to payment list...");
//           navigate(`/customerpayment/list`);
//         })
//         .catch((err) => {
//           console.error("Error processing payment:", err);
//           setErrors({
//             apiError: "Failed to process payment. Please try again.",
//           });
//         })
//         .finally(() => {
//           setIsSubmitting(false);
//         });
//     } else {
//       console.log("Validation errors:", validationErrors);
//     }
//   };

//   return (
//     <div
//       className="d-flex vh-100 justify-content-center align-items-center"
//       style={{ backgroundColor: "#263043" }}
//     >
//       <div className="w-50 bg-white rounded p-3">
//         <form onSubmit={handleSubmit}>
//           {/* Customer Dropdown */}
//           <div className="mb-3">
//             <label htmlFor="CustomerID">
//               <strong>Customer</strong>
//             </label>
//             <select
//               className="form-control rounded-0"
//               name="CustomerID"
//               value={values.CustomerID}
//               onChange={handleInput}
//               disabled={isLoading}
//             >
//               <option value="">
//                 {isLoading ? "Loading customers..." : "Select Customer"}
//               </option>
//               {customers.map((customer) => (
//                 <option key={customer.CustomerID} value={customer.CustomerID}>
//                   {customer.CustomerName}
//                 </option>
//               ))}
//             </select>
//             {errors.CustomerID && (
//               <span className="text-danger">{errors.CustomerID}</span>
//             )}
//             {fetchError && <span className="text-danger">{fetchError}</span>}
//           </div>

//           {/* Payment Date */}
//           <div className="mb-3">
//             <label htmlFor="PaymentDate">
//               <strong>Payment Date</strong>
//             </label>
//             <input
//               type="date"
//               className="form-control rounded-0"
//               name="PaymentDate"
//               value={values.PaymentDate}
//               onChange={handleInput}
//             />
//             {errors.PaymentDate && (
//               <span className="text-danger">{errors.PaymentDate}</span>
//             )}
//           </div>

//           {/* Payment Amount */}
//           <div className="mb-3">
//             <label htmlFor="PaymentAmount">
//               <strong>Payment Amount</strong>
//             </label>
//             <input
//               type="number"
//               className="form-control rounded-0"
//               name="PaymentAmount"
//               value={values.PaymentAmount}
//               onChange={handleInput}
//               placeholder="Enter payment amount"
//             />
//             {errors.PaymentAmount && (
//               <span className="text-danger">{errors.PaymentAmount}</span>
//             )}
//           </div>

//           {/* Payment Method Dropdown */}
//           <div className="mb-3">
//             <label htmlFor="PaymentMethod">
//               <strong>Payment Method</strong>
//             </label>
//             <select
//               className="form-control rounded-0"
//               name="PaymentMethod"
//               value={values.PaymentMethod}
//               onChange={handleInput}
//             >
//               <option value="Cash">Cash</option>
//               <option value="Bank Transfer">Bank Transfer</option>
//               <option value="Cheque">Cheque</option>
//               <option value="Other">Other</option>
//             </select>
//             {errors.PaymentMethod && (
//               <span className="text-danger">{errors.PaymentMethod}</span>
//             )}
//           </div>

//           {/* Payment Status Dropdown */}
//           <div className="mb-3">
//             <label htmlFor="PaymentStatus">
//               <strong>Payment Status</strong>
//             </label>
//             <select
//               className="form-control rounded-0"
//               name="PaymentStatus"
//               value={values.PaymentStatus}
//               onChange={handleInput}
//             >
//               <option value="Completed">Completed</option>
//               <option value="Pending">Pending</option>
//               <option value="Failed">Failed</option>
//             </select>
//             {errors.PaymentStatus && (
//               <span className="text-danger">{errors.PaymentStatus}</span>
//             )}
//           </div>

//           {/* API Error Message */}
//           {errors.apiError && (
//             <div className="alert alert-danger">{errors.apiError}</div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="btn btn-success w-100 rounded-0"
//             disabled={isSubmitting || isLoading}
//           >
//             {isSubmitting ? "Processing..." : "Add Payment"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddHomeCustomerPayment;

function AddHomeCustomerPayment() {
  const todayDate = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  const [values, setValues] = useState({
    CustomerID: "",
    PaymentDate: todayDate,
    PaymentAmount: "",
    PaymentMethod: "",
    PaymentStatus: "",
    CustomPaymentMethod: "", // New field for user input
  });

  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setFetchError("Failed to load customers.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted, validating data...");

    const validationErrors = validatePayment(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Validation passed, sending payment request...");
      setIsSubmitting(true);

      const paymentMethod =
        values.PaymentMethod === "Other"
          ? values.CustomPaymentMethod
          : values.PaymentMethod;

      axios
        .post("http://localhost:3001/api/customerpayments", {
          ...values,
          PaymentMethod: paymentMethod,
        })
        .then((res) => {
          console.log("Payment added successfully:", res.data);
          const paymentData = res.data;

          const leisureEntry = {
            CustomerID: paymentData.CustomerID,
            TransactionType: "Payment",
            TransactionID: paymentData.CustomerPaymentID,
            TransactionDate: paymentData.PaymentDate,
            Debit: parseFloat(paymentData.PaymentAmount),
            Description: `Payment received via ${paymentData.PaymentMethod}`,
          };

          console.log("Adding leisure entry:", leisureEntry);

          return axios.post(
            "http://localhost:3001/api/customerleisure/create",
            leisureEntry
          );
        })
        .then(() => {
          console.log("Leisure entry added, navigating to payment list...");
          navigate(`/customerpayment/list`);
        })
        .catch((err) => {
          console.error("Error processing payment:", err);
          setErrors({
            apiError: "Failed to process payment. Please try again.",
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      console.log("Validation errors:", validationErrors);
    }
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ backgroundColor: "#263043" }}
    >
      <div className="w-50 bg-white rounded p-3">
        <form onSubmit={handleSubmit}>
          {/* Customer Dropdown */}
          <div className="mb-3">
            <label htmlFor="CustomerID">
              <strong>Customer</strong>
            </label>
            <select
              className="form-control rounded-0"
              name="CustomerID"
              value={values.CustomerID}
              onChange={handleInput}
              disabled={isLoading}
            >
              <option value="">
                {isLoading ? "Loading customers..." : "Select Customer"}
              </option>
              {customers.map((customer) => (
                <option key={customer.CustomerID} value={customer.CustomerID}>
                  {customer.CustomerName}
                </option>
              ))}
            </select>
            {errors.CustomerID && (
              <span className="text-danger">{errors.CustomerID}</span>
            )}
            {fetchError && <span className="text-danger">{fetchError}</span>}
          </div>

          {/* Payment Date */}
          <div className="mb-3">
            <label htmlFor="PaymentDate">
              <strong>Payment Date</strong>
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              name="PaymentDate"
              value={values.PaymentDate}
              onChange={handleInput}
            />
            {errors.PaymentDate && (
              <span className="text-danger">{errors.PaymentDate}</span>
            )}
          </div>

          {/* Payment Amount */}
          <div className="mb-3">
            <label htmlFor="PaymentAmount">
              <strong>Payment Amount</strong>
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              name="PaymentAmount"
              value={values.PaymentAmount}
              onChange={handleInput}
              placeholder="Enter payment amount"
            />
            {errors.PaymentAmount && (
              <span className="text-danger">{errors.PaymentAmount}</span>
            )}
          </div>

          {/* Payment Method Dropdown + Custom Input */}
          <div className="mb-3">
            <label htmlFor="PaymentMethod">
              <strong>Payment Method</strong>
            </label>
            <select
              className="form-control rounded-0"
              name="PaymentMethod"
              value={values.PaymentMethod}
              onChange={handleInput}
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="Other">Other (Enter Below)</option>
            </select>
            {values.PaymentMethod === "Other" && (
              <input
                type="text"
                className="form-control mt-2 rounded-0"
                name="CustomPaymentMethod"
                value={values.CustomPaymentMethod}
                onChange={handleInput}
                placeholder="Enter custom payment method"
              />
            )}
            {errors.PaymentMethod && (
              <span className="text-danger">{errors.PaymentMethod}</span>
            )}
          </div>

          {/* Payment Status Dropdown */}
          {/* <div className="mb-3">
            <label htmlFor="PaymentStatus">
              <strong>Payment Status</strong>
            </label>
            <select
              className="form-control rounded-0"
              name="PaymentStatus"
              value={values.PaymentStatus}
              onChange={handleInput}
            >
              <option value="">Select Payment Status</option>
              <option value="Partial">Partial</option>
              <option value="Full">Full</option>
            </select>
            {errors.PaymentStatus && (
              <span className="text-danger">{errors.PaymentStatus}</span>
            )}
          </div> */}

          {/* API Error Message */}
          {errors.apiError && (
            <div className="alert alert-danger">{errors.apiError}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-success w-100 rounded-0"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Processing..." : "Add Payment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddHomeCustomerPayment;
