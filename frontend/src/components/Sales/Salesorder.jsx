import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { validateSalesOrder } from "../../controllers/salesvalidator";
import { FaShoppingCart, FaUser, FaCalendar, FaPlusCircle } from "react-icons/fa";
import "./Salesorder.css";
import { get, post } from "../../service/apiClient";

function SalesOrderForm() {
  const currentDate = new Date().toISOString().split("T")[0];

  const [values, setValues] = useState({
    CustomerID: "",
    OrderDate: currentDate,
    TotalAmount: 0,
    AmountPaid: 0,
    RemainingAmount: 0,
    PaymentStatus: "Pending",
  });

  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState({});
  const [customerErrors, setCustomerErrors] = useState({});
  const [customerSuccess, setCustomerSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    CustomerName: "",
    Address: "",
    Phone: "",
    Email: "",
    AvailableBalance: 0.0,
  });

  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log("Fetching customers...");
    get("/customers")
      .then((res) => {
        console.log("Customers fetched:", res.data);
        // Handle paginated response structure
        const customersData = res.data.data || res.data;
        const formattedCustomers = customersData.map((customer) => ({
          value: customer.CustomerID,
          label: customer.CustomerName,
        }));
        setCustomers(formattedCustomers);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
      });
  }, []);

  const handleInput = (event) => {
    const { name, value } = event.target;

    if (name === "OrderDate") {
      const dateObject = new Date(value);
      const formattedDate = dateObject.toISOString().split("T")[0];
      setValues((prev) => ({
        ...prev,
        [name]: formattedDate,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCustomerChange = (selectedOption) => {
    if (selectedOption.__isNew__) {
      setIsNewCustomer(true);
      setNewCustomer((prev) => ({
        ...prev,
        CustomerName: selectedOption.label,
      }));
    } else {
      setIsNewCustomer(false);
      setValues((prev) => ({
        ...prev,
        CustomerID: selectedOption ? selectedOption.value : "",
      }));
    }
  };

  const handleNewCustomerInput = (event) => {
    const { name, value } = event.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (customerErrors[name]) {
      setCustomerErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  useEffect(() => {
    if (isSubmitting) {
      setErrors(validateSalesOrder(values));
    }
  }, [values, isSubmitting]);

  const handleCreateCustomer = () => {
    console.log('Creating customer with data:', newCustomer);
    
    // Client-side validation
    const validationErrors = {};
    if (!newCustomer.CustomerName || newCustomer.CustomerName.trim() === '') {
      validationErrors.CustomerName = 'Customer name is required';
    }
    if (!newCustomer.Phone || newCustomer.Phone.trim() === '') {
      validationErrors.Phone = 'Phone number is required';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setCustomerErrors(validationErrors);
      return;
    }
    
    setIsCreatingCustomer(true);
    setCustomerErrors({}); // Clear previous errors
    setCustomerSuccess(""); // Clear previous success message
    
    post("/customers", newCustomer)
      .then((res) => {
        const newCustomerData = res.data;
        setCustomers((prev) => [
          ...prev,
          {
            value: newCustomerData.CustomerID,
            label: newCustomerData.CustomerName,
          },
        ]);
        setValues((prev) => ({
          ...prev,
          CustomerID: newCustomerData.CustomerID,
        }));
        setIsNewCustomer(false);
        setIsCreatingCustomer(false);
        setCustomerErrors({}); // Clear errors on success
        setCustomerSuccess(`Customer "${newCustomerData.CustomerName}" created successfully!`);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setCustomerSuccess("");
        }, 3000);
      })
      .catch((err) => {
        console.error("Error creating new customer:", err);
        if (err.response && err.response.data) {
          console.error("Error response:", err.response.data);
          if (err.response.data.errors) {
            // Set validation errors
            setCustomerErrors(err.response.data.errors);
          } else {
            // Set general error message
            setCustomerErrors({ general: err.response.data.message || 'Unknown error occurred' });
          }
        } else {
          setCustomerErrors({ general: 'Network error. Please check your connection.' });
        }
        setIsCreatingCustomer(false);
      });
  };

  const handleCancelCreateCustomer = () => {
    setIsNewCustomer(false);
    setCustomerErrors({}); // Clear errors when canceling
    setCustomerSuccess(""); // Clear success message when canceling
    setNewCustomer({
      CustomerName: "",
      Address: "",
      Phone: "",
      Email: "",
      AvailableBalance: 0.0,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted with values:", values);
    const validationErrors = validateSalesOrder(values);
    console.log("Validation errors:", validationErrors);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      console.log("No validation errors, proceeding with API call...");
      createSalesOrder(values.CustomerID);
    }
  };

  const createSalesOrder = (customerId) => {
    const salesOrderData = { ...values, CustomerID: customerId };
    post("/sales-orders", salesOrderData)
      .then((res) => {
        console.log("Response from API:", res);
        const salesOrderId = res.data.SalesOrderID;
        navigate(`/salesorderdetail/${salesOrderId}`);
        console.log("Navigation to sales order detail with ID:", salesOrderId);
      })
      .catch((err) => {
        console.error("Error creating sales order:", err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (customers.length > 0 && !values.CustomerID) {
      const walkInOption = customers.find(
        (option) => option.label === "Walk IN"
      );

      if (walkInOption) {
        setValues((prev) => ({
          ...prev,
          CustomerID: walkInOption.value,
        }));
      }
    }
  }, [customers]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "#263043",
        minHeight: "100vh",
        padding: windowWidth < 768 ? "10px" : "20px",
      }}
    >
             <div
         className="rounded-4 shadow-lg p-4 p-md-5"
         style={{
           width: "100%",
           maxWidth: "600px",
           minWidth: windowWidth < 480 ? "280px" : "320px",
           border: "1px solid #404040",
           background: "rgba(255,255,255,0.95)",
           boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
         }}
       >
                 <div className="text-center mb-3 mb-md-4">
           <FaShoppingCart size={windowWidth < 768 ? 32 : 40} color="#263043" />
           <h3 className="fw-bold mt-2" style={{ color: "#263043", fontSize: windowWidth < 768 ? "1.5rem" : "1.75rem" }}>
             Create Sales Order
           </h3>
           <p className="text-muted" style={{ fontSize: windowWidth < 768 ? 14 : 15 }}>
             Create a new sales order for your customer.
           </p>
         </div>

        <form onSubmit={handleSubmit}>
          {errors.apiError && (
            <div className="alert alert-danger" role="alert">
              {errors.apiError}
            </div>
          )}

                     <div className="mb-3">
             <label htmlFor="CustomerID" className="form-label fw-semibold" style={{ color: "#263043", fontSize: windowWidth < 768 ? "0.875rem" : "1rem" }}>
               <FaUser className="me-2" />
               Customer
             </label>
             <CreatableSelect
               options={customers}
               onChange={handleCustomerChange}
               className="basic-single"
               classNamePrefix="select"
               isClearable
               isSearchable
               name="CustomerID"
               placeholder="Select or create a customer..."
               value={customers.find(
                 (option) => option.value === values.CustomerID
               )}
               styles={{
                 control: (provided) => ({
                   ...provided,
                   background: "#f8f9fa",
                   border: "1px solid #dee2e6",
                   borderRadius: windowWidth < 768 ? "6px" : "8px",
                   minHeight: windowWidth < 768 ? "40px" : "45px",
                   boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                   transition: "all 0.2s",
                   fontSize: windowWidth < 768 ? "14px" : "16px",
                   "&:hover": {
                     borderColor: "#263043",
                   },
                   "&:focus-within": {
                     borderColor: "#263043",
                     boxShadow: "0 0 0 0.2rem rgba(38, 48, 67, 0.25)",
                   }
                 }),
                 option: (provided, state) => ({
                   ...provided,
                   backgroundColor: state.isSelected ? "#263043" : state.isFocused ? "#f8f9fa" : "white",
                   color: state.isSelected ? "white" : "#333",
                   padding: windowWidth < 768 ? "8px 12px" : "12px 16px",
                   fontSize: windowWidth < 768 ? "14px" : "16px",
                 }),
                 menu: (provided) => ({
                   ...provided,
                   borderRadius: windowWidth < 768 ? "6px" : "8px",
                   boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                 }),
                 placeholder: (provided) => ({
                   ...provided,
                   color: "#999",
                   fontSize: windowWidth < 768 ? "14px" : "16px",
                 })
               }}
             />
             {errors.CustomerID && (
               <span className="text-danger small">{errors.CustomerID}</span>
             )}
           </div>

                                           {isNewCustomer && (
              <div 
                className="mb-4 p-3 rounded-3"
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #e9ecef",
                }}
              >
                {/* General Error Display */}
                {customerErrors.general && (
                  <div className="alert alert-danger mb-3" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {customerErrors.general}
                  </div>
                )}
                
                {/* Success Message Display */}
                {customerSuccess && (
                  <div className="alert alert-success mb-3" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    {customerSuccess}
                  </div>
                )}
                               <div className="d-flex align-items-center mb-3">
                  <FaPlusCircle size={windowWidth < 768 ? 16 : 20} color="#263043" className="me-2" />
                  <h6 className="mb-0 fw-semibold" style={{ color: "#263043", fontSize: windowWidth < 768 ? "0.875rem" : "1rem" }}>
                    New Customer Details
                  </h6>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Fields marked with <span className="text-danger">*</span> are required
                  </small>
                </div>

               <div className="row">
                 <div className="col-12 col-md-6 mb-3">
                                       <label htmlFor="CustomerName" className="form-label fw-semibold" style={{ color: "#263043", fontSize: windowWidth < 768 ? "0.875rem" : "1rem" }}>
                      Customer Name <span className="text-danger">*</span>
                    </label>
                                       <input
                      type="text"
                      name="CustomerName"
                      className={`form-control rounded-3 ${customerErrors.CustomerName ? 'is-invalid' : ''}`}
                      value={newCustomer.CustomerName}
                      onChange={handleNewCustomerInput}
                      placeholder="Enter customer name (required)"
                      required
                      style={{
                        background: "#f8f9fa",
                        border: customerErrors.CustomerName ? "1px solid #dc3545" : "1px solid #dee2e6",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        fontSize: windowWidth < 768 ? "14px" : "16px",
                        padding: windowWidth < 768 ? "8px 12px" : "12px 16px",
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = customerErrors.CustomerName ? "#dc3545" : "#263043";
                        e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = customerErrors.CustomerName ? "#dc3545" : "#dee2e6";
                        e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                      }}
                    />
                    {customerErrors.CustomerName && (
                      <div className="invalid-feedback d-block">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {customerErrors.CustomerName}
                      </div>
                    )}
                 </div>

                 <div className="col-12 col-md-6 mb-3">
                                       <label htmlFor="Phone" className="form-label fw-semibold" style={{ color: "#263043", fontSize: windowWidth < 768 ? "0.875rem" : "1rem" }}>
                      Phone <span className="text-danger">*</span>
                    </label>
                                       <input
                      type="text"
                      name="Phone"
                      className={`form-control rounded-3 ${customerErrors.Phone ? 'is-invalid' : ''}`}
                      value={newCustomer.Phone}
                      onChange={handleNewCustomerInput}
                      placeholder="Enter phone number (required)"
                      required
                      style={{
                        background: "#f8f9fa",
                        border: customerErrors.Phone ? "1px solid #dc3545" : "1px solid #dee2e6",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        fontSize: windowWidth < 768 ? "14px" : "16px",
                        padding: windowWidth < 768 ? "8px 12px" : "12px 16px",
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = customerErrors.Phone ? "#dc3545" : "#263043";
                        e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = customerErrors.Phone ? "#dc3545" : "#dee2e6";
                        e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                      }}
                    />
                    {customerErrors.Phone && (
                      <div className="invalid-feedback d-block">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {customerErrors.Phone}
                      </div>
                    )}
                 </div>
               </div>

               <div className="mb-3">
                 <label htmlFor="Address" className="form-label fw-semibold" style={{ color: "#263043", fontSize: windowWidth < 768 ? "0.875rem" : "1rem" }}>
                   Address
                 </label>
                                   <input
                    type="text"
                    name="Address"
                    className={`form-control rounded-3 ${customerErrors.Address ? 'is-invalid' : ''}`}
                    value={newCustomer.Address}
                    onChange={handleNewCustomerInput}
                    placeholder="Enter address"
                    style={{
                      background: "#f8f9fa",
                      border: customerErrors.Address ? "1px solid #dc3545" : "1px solid #dee2e6",
                      transition: "all 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      fontSize: windowWidth < 768 ? "14px" : "16px",
                      padding: windowWidth < 768 ? "8px 12px" : "12px 16px",
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = customerErrors.Address ? "#dc3545" : "#263043";
                      e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = customerErrors.Address ? "#dc3545" : "#dee2e6";
                      e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                    }}
                  />
                  {customerErrors.Address && (
                    <div className="invalid-feedback d-block">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {customerErrors.Address}
                    </div>
                  )}
               </div>

               <div className="row">
                 <div className="col-12 col-md-6 mb-3">
                   <label htmlFor="Email" className="form-label fw-semibold" style={{ color: "#263043", fontSize: windowWidth < 768 ? "0.875rem" : "1rem" }}>
                     Email
                   </label>
                                       <input
                      type="email"
                      name="Email"
                      className={`form-control rounded-3 ${customerErrors.Email ? 'is-invalid' : ''}`}
                      value={newCustomer.Email}
                      onChange={handleNewCustomerInput}
                      placeholder="Enter email address"
                      style={{
                        background: "#f8f9fa",
                        border: customerErrors.Email ? "1px solid #dc3545" : "1px solid #dee2e6",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        fontSize: windowWidth < 768 ? "14px" : "16px",
                        padding: windowWidth < 768 ? "8px 12px" : "12px 16px",
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = customerErrors.Email ? "#dc3545" : "#263043";
                        e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = customerErrors.Email ? "#dc3545" : "#dee2e6";
                        e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                      }}
                    />
                    {customerErrors.Email && (
                      <div className="invalid-feedback d-block">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {customerErrors.Email}
                      </div>
                    )}
                 </div>

                 <div className="col-12 col-md-6 mb-3">
                   <label htmlFor="AvailableBalance" className="form-label fw-semibold" style={{ color: "#263043", fontSize: windowWidth < 768 ? "0.875rem" : "1rem" }}>
                     Available Balance
                   </label>
                                       <input
                      type="number"
                      step="0.01"
                      name="AvailableBalance"
                      className={`form-control rounded-3 ${customerErrors.AvailableBalance ? 'is-invalid' : ''}`}
                      value={newCustomer.AvailableBalance}
                      onChange={handleNewCustomerInput}
                      placeholder="0.00"
                      style={{
                        background: "#f8f9fa",
                        border: customerErrors.AvailableBalance ? "1px solid #dc3545" : "1px solid #dee2e6",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        fontSize: windowWidth < 768 ? "14px" : "16px",
                        padding: windowWidth < 768 ? "8px 12px" : "12px 16px",
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = customerErrors.AvailableBalance ? "#dc3545" : "#263043";
                        e.target.style.boxShadow = "0 0 0 0.2rem rgba(38, 48, 67, 0.25)";
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = customerErrors.AvailableBalance ? "#dc3545" : "#dee2e6";
                        e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                      }}
                    />
                    {customerErrors.AvailableBalance && (
                      <div className="invalid-feedback d-block">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        {customerErrors.AvailableBalance}
                      </div>
                    )}
                 </div>
               </div>

               <div className="d-flex flex-column flex-md-row gap-2 gap-md-3">
                 <button
                   type="button"
                   className="btn rounded-3 fw-bold"
                   onClick={handleCreateCustomer}
                   disabled={isCreatingCustomer}
                   style={{
                     background: "#263043",
                     border: "none",
                     fontSize: windowWidth < 768 ? "13px" : "14px",
                     letterSpacing: 0.5,
                     boxShadow: "0 4px 12px rgba(38, 48, 67, 0.3)",
                     transition: "all 0.3s",
                     color: "white",
                     flex: 1,
                     padding: windowWidth < 768 ? "10px 16px" : "12px 24px",
                   }}
                   onMouseOver={e => {
                     if (!isCreatingCustomer) {
                       e.target.style.background = "#1a2332";
                       e.target.style.transform = "translateY(-2px)";
                       e.target.style.boxShadow = "0 6px 20px rgba(38, 48, 67, 0.4)";
                     }
                   }}
                   onMouseOut={e => {
                     if (!isCreatingCustomer) {
                       e.target.style.background = "#263043";
                       e.target.style.transform = "translateY(0)";
                       e.target.style.boxShadow = "0 4px 12px rgba(38, 48, 67, 0.3)";
                     }
                   }}
                                   >
                    {isCreatingCustomer ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      "Create Customer"
                    )}
                  </button>
                 <button
                   type="button"
                   className="btn rounded-3 fw-bold"
                   onClick={handleCancelCreateCustomer}
                   disabled={isCreatingCustomer}
                   style={{
                     background: "#6c757d",
                     border: "none",
                     fontSize: windowWidth < 768 ? "13px" : "14px",
                     letterSpacing: 0.5,
                     boxShadow: "0 4px 12px rgba(108, 117, 125, 0.3)",
                     transition: "all 0.3s",
                     color: "white",
                     flex: 1,
                     padding: windowWidth < 768 ? "10px 16px" : "12px 24px",
                   }}
                   onMouseOver={e => {
                     if (!isCreatingCustomer) {
                       e.target.style.background = "#5a6268";
                       e.target.style.transform = "translateY(-2px)";
                       e.target.style.boxShadow = "0 6px 20px rgba(108, 117, 125, 0.4)";
                     }
                   }}
                   onMouseOut={e => {
                     if (!isCreatingCustomer) {
                       e.target.style.background = "#6c757d";
                       e.target.style.transform = "translateY(0)";
                       e.target.style.boxShadow = "0 4px 12px rgba(108, 117, 125, 0.3)";
                     }
                   }}
                 >
                   Cancel
                 </button>
               </div>
             </div>
           )}

                     <div className="mb-4">
             <label htmlFor="OrderDate" className="form-label fw-semibold" style={{ color: "#263043", fontSize: windowWidth < 768 ? "0.875rem" : "1rem" }}>
               <FaCalendar className="me-2" />
               Order Date
             </label>
             <input
               onChange={handleInput}
               type="date"
               className="form-control rounded-3"
               name="OrderDate"
               value={values.OrderDate}
               style={{
                 background: "#f8f9fa",
                 border: "1px solid #dee2e6",
                 transition: "all 0.2s",
                 boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                 fontSize: windowWidth < 768 ? "14px" : "16px",
                 padding: windowWidth < 768 ? "8px 12px" : "12px 16px",
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
             {errors.OrderDate && (
               <span className="text-danger small">{errors.OrderDate}</span>
             )}
           </div>

                     <button
             type="submit"
             className="btn w-100 rounded-3 fw-bold"
             disabled={isSubmitting}
             style={{
               background: "#263043",
               border: "none",
               fontSize: windowWidth < 768 ? "16px" : "18px",
               letterSpacing: 1,
               boxShadow: "0 4px 12px rgba(38, 48, 67, 0.3)",
               transition: "all 0.3s",
               color: "white",
               padding: windowWidth < 768 ? "12px 20px" : "14px 32px",
             }}
             onMouseOver={e => {
               if (!isSubmitting) {
                 e.target.style.background = "#1a2332";
                 e.target.style.transform = "translateY(-2px)";
                 e.target.style.boxShadow = "0 6px 20px rgba(38, 48, 67, 0.4)";
               }
             }}
             onMouseOut={e => {
               if (!isSubmitting) {
                 e.target.style.background = "#263043";
                 e.target.style.transform = "translateY(0)";
                 e.target.style.boxShadow = "0 4px 12px rgba(38, 48, 67, 0.3)";
               }
             }}
           >
             <FaShoppingCart className="me-2 mb-1" />
             {isSubmitting ? "Creating..." : "Create Sales Order"}
           </button>
        </form>
      </div>
    </div>
  );
}

export default SalesOrderForm;
