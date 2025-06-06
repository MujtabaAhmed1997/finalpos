// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const NotificationsPage = () => {
//   const [reminders, setReminders] = useState([]);
//   const [overdues, setOverdues] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const today = new Date().toISOString().split("T")[0];

//       try {
//         const [reminderRes, overdueRes] = await Promise.all([
//           axios.get("http://localhost:3001/api/reminders/all"),
//           axios.get("http://localhost:3001/customerpayment/overdue"),
//         ]);

//         const todayReminders = reminderRes.data.reminders.filter((reminder) => {
//           const reminderDate = new Date(reminder.Date)
//             .toISOString()
//             .split("T")[0];
//           return reminderDate === today;
//         });

//         const todayOverdues = overdueRes.data.overduePayments.filter(
//           (payment) => {
//             const dueDate = new Date(payment.dueDate)
//               .toISOString()
//               .split("T")[0];
//             return dueDate === today;
//           }
//         );

//         setReminders(todayReminders);
//         setOverdues(todayOverdues);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>🔔 Notifications for Today</h2>

//       <div style={{ marginTop: "2rem" }}>
//         <h3>📌 Reminders</h3>
//         {reminders.length === 0 ? (
//           <p>No reminders for today.</p>
//         ) : (
//           <ul>
//             {reminders.map((reminder) => (
//               <li key={reminder.id}>
//                 <strong>{reminder.title || "Reminder"}</strong>:{" "}
//                 {reminder.description || "No description"}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div style={{ marginTop: "2rem" }}>
//         <h3>💸 Overdue Payments</h3>
//         {overdues.length === 0 ? (
//           <p>No overdue payments due today.</p>
//         ) : (
//           <ul>
//             {overdues.map((payment) => (
//               <li key={payment.id}>
//                 Customer:{" "}
//                 <strong>{payment.Customer?.customerName || "Unknown"}</strong>,
//                 Amount Due: <strong>{payment.remaining}</strong>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationsPage;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const NotificationPage = () => {
//   const [reminders, setReminders] = useState([]);
//   const [overduePayments, setOverduePayments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const [remindersRes, paymentsRes] = await Promise.all([
//           axios.get("http://localhost:3001/api/reminders/all"),
//           axios.get("http://localhost:3001/customerpayment/overdue"),
//         ]);

//         const today = new Date().toISOString().split("T")[0];

//         const todaysReminders = remindersRes.data.reminders.filter((r) => {
//           const date = new Date(r.Date).toISOString().split("T")[0];
//           return date === today;
//         });

//         setReminders(todaysReminders);
//         setOverduePayments(paymentsRes.data.overduePayments); // show all overdue regardless of date
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   return (
//     <div className="p-4">
//       <h2>Notifications</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <section style={{ marginBottom: "2rem" }}>
//             <h3>🔔 Today's Reminders</h3>
//             {reminders.length > 0 ? (
//               <ul>
//                 {reminders.map((reminder) => (
//                   <li key={reminder.id}>
//                     <strong>{reminder.Title}</strong> - {reminder.Description}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No reminders for today.</p>
//             )}
//           </section>

//           <section>
//             <h3>💰 Overdue Payments</h3>
//             {overduePayments.length > 0 ? (
//               <ul>
//                 {overduePayments.map((payment) => (
//                   <li key={payment.id}>
//                     <strong>Customer:</strong>{" "}
//                     {payment.customer?.name || "Unknown"} <br />
//                     <strong>Due Amount:</strong> {payment.remainingAmount}{" "}
//                     <br />
//                     <strong>Due Date:</strong>{" "}
//                     {new Date(payment.dueDate).toLocaleDateString()}
//                     <hr />
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No overdue payments.</p>
//             )}
//           </section>
//         </>
//       )}
//     </div>
//   );
// };

// export default NotificationPage;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

// const NotificationPage = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [overdueCustomers, setOverdueCustomers] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:3001/api/overdue-notifications"
//         );
//         setNotifications(response.data);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//         setError("Failed to fetch overdue notifications.");
//       }
//     };

//     const fetchOverdueCustomers = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/api/overdue");
//         if (Array.isArray(response.data)) {
//           setOverdueCustomers(response.data);
//         } else {
//           setError("Unexpected response format while fetching customers.");
//         }
//       } catch (error) {
//         console.error("Error fetching overdue customers:", error);
//         setError("Failed to fetch overdue customers.");
//       }
//     };

//     fetchNotifications();
//     fetchOverdueCustomers();
//   }, []);

//   return (
//     <div className="container mt-4">
//       <h2 className="text-center">Notifications</h2>
//       {error && <p className="text-danger">{error}</p>}

//       {/* Notifications Section */}
//       <div className="mb-5">
//         <h4>Overdue Payments Notifications</h4>
//         {notifications.length > 0 ? (
//           <ul className="list-group">
//             {notifications.map((notification, index) => (
//               <li
//                 key={index}
//                 className="list-group-item d-flex justify-content-between align-items-center"
//               >
//                 <span>
//                   {notification.CustomerName} has an overdue payment of{" "}
//                   <strong>Rs {notification.remainingAmount}</strong>
//                   due on{" "}
//                   <strong>
//                     {new Date(notification.dueDate).toLocaleDateString()}
//                   </strong>
//                   .
//                 </span>
//                 <Link
//                   to={`/customerpayment/${notification.CustomerID}`}
//                   className="btn btn-sm btn-outline-primary"
//                 >
//                   View
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-muted">No overdue notifications found.</p>
//         )}
//       </div>

//       {/* Overdue Customers Section */}
//       <div>
//         <h4>Late Payment Customers</h4>
//         <table className="table table-bordered table-striped table-responsive">
//           <thead className="table-dark">
//             <tr>
//               <th>Customer ID</th>
//               <th>Customer Name</th>
//               <th>Phone Number</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {overdueCustomers.length > 0 ? (
//               overdueCustomers.map((customer) => (
//                 <tr key={customer.CustomerID}>
//                   <td>{customer.CustomerID}</td>
//                   <td>{customer.CustomerName}</td>
//                   <td>{customer.Phone}</td>
//                   <td>
//                     <Link
//                       to={`/customerpayment/${customer.CustomerID}`}
//                       className="btn btn-sm btn-info"
//                     >
//                       Payments Made
//                     </Link>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="text-center">
//                   No overdue customers found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default NotificationPage;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const NotificationPage = () => {
//   const [reminders, setReminders] = useState([]);
//   const [overduePayments, setOverduePayments] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const today = new Date().toISOString().split("T")[0];

//         const [remindersRes, overdueRes] = await Promise.all([
//           axios.get(`http://localhost:3001/api/reminders?date=${today}`),
//           axios.get("http://localhost:3001/api/overdue"),
//         ]);

//         const todayReminders = remindersRes.data;

//         setReminders(remindersRes.data?.reminders || []);
//         setOverduePayments(overdueRes.data || []);
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//         setError("Failed to fetch reminders or overdue payments.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);
//   console.log("todayreminder", reminders);
//   console.log("overduePayments", overduePayments);

//   if (loading) return <div className="container mt-5">Loading...</div>;

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4 text-center">🔔 Notifications</h2>

//       {error && (
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//       )}

//       <div className="mb-5">
//         <h4>📌 Today's Reminders</h4>
//         {reminders.length === 0 ? (
//           <p>No reminders for today.</p>
//         ) : (
//           <ul className="list-group">
//             {reminders.map((reminder) => (
//               <li className="list-group-item" key={reminder.id}>
//                 <strong>{reminder.title || "Reminder"}</strong>:{" "}
//                 {reminder.TaskDescription || "No description"}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div>
//         <h4>💰 Overdue Customer Payments</h4>
//         {overduePayments.length === 0 ? (
//           <p>No overdue payments.</p>
//         ) : (
//           <ul className="list-group">
//             {overduePayments.map((payment) => (
//               <li className="list-group-item" key={payment.id}>
//                 <strong>Customer:</strong> {payment.CustomerName || "Unknown"}{" "}
//                 <br />
//                 <strong>Address:</strong> {payment.Address} <br />
//                 <strong>Phone:</strong>
//                 {payment.Phone}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationPage;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Link } from "react-router-dom";

// const NotificationPage = () => {
//   const [reminders, setReminders] = useState([]);
//   const [overduePayments, setOverduePayments] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const today = new Date().toISOString().split("T")[0];

//         const [remindersRes, overdueRes] = await Promise.all([
//           axios.get(`http://localhost:3001/api/reminders?date=${today}`),
//           axios.get("http://localhost:3001/api/overdue"),
//         ]);

//         setReminders(remindersRes.data?.reminders || []);
//         setOverduePayments(overdueRes.data || []);
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//         setError("Failed to fetch reminders or overdue payments.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="container mt-4">
//       <h2 className="text-center mb-4">📢 Notifications</h2>
//       {error && <p className="text-danger text-center">{error}</p>}

//       {loading ? (
//         <p className="text-center">Loading...</p>
//       ) : (
//         <>
//           {/* Reminders Section */}
//           <div className="mb-5">
//             <h4>📌 Reminders for Today</h4>
//             {reminders.length > 0 ? (
//               <ul className="list-group">
//                 {reminders.map((reminder, idx) => (
//                   <li key={idx} className="list-group-item">
//                     <strong>{reminder.Title || "Reminder"}:</strong>{" "}
//                     {reminder.TaskDescription || "No description"}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-muted">No reminders for today.</p>
//             )}
//           </div>

//           {/* Overdue Payments Section */}
//           <div>
//             <h4>💸 Overdue Customers</h4>
//             <table className="table table-bordered table-striped table-responsive">
//               <thead className="table-dark">
//                 <tr>
//                   <th>Customer ID</th>
//                   <th>Name</th>
//                   <th>Phone</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {overduePayments.length > 0 ? (
//                   overduePayments.map((customer) => (
//                     <tr key={customer.CustomerID}>
//                       <td>{customer.CustomerID}</td>
//                       <td>{customer.CustomerName}</td>
//                       <td>{customer.Phone}</td>
//                       <td>
//                         <Link
//                           to={`/customerpayment/${customer.CustomerID}`}
//                           className="btn btn-sm btn-info"
//                         >
//                           Payments Made
//                         </Link>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="text-center">
//                       No overdue customers found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default NotificationPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const NotificationPage = () => {
  const [reminders, setReminders] = useState([]);
  const [overduePayments, setOverduePayments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        const [remindersRes, overdueRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/reminders?date=${today}`),
          axios.get("http://localhost:3001/api/overdue"),
        ]);

        setReminders(remindersRes.data?.reminders || []);
        setOverduePayments(overdueRes.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to fetch reminders or overdue payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      {/* <h2 className="text-center mb-4 fw-bold text-primary">
        🔔 Daily Notifications
      </h2> */}
      {error && <p className="text-danger text-center">{error}</p>}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-info" role="status" />
          <p className="mt-2">Loading notifications...</p>
        </div>
      ) : (
        <div className="row">
          {/* Reminders */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow border-0 h-100">
              <div
                className="card-header text-white"
                style={{
                  background: "linear-gradient(45deg, #007bff, #00c6ff)",
                }}
              >
                <h5 className="mb-0">📌 Reminders for Today</h5>
              </div>
              <div className="card-body">
                {reminders.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {reminders.map((reminder, idx) => (
                      <li
                        key={idx}
                        className="list-group-item d-flex flex-column"
                      >
                        {/* <span className="fw-bold">
                          {reminder.createdAt || "Untitled"}
                        </span> */}
                        <small className="text-muted">
                          {reminder.TaskDescription ||
                            "No description provided"}
                        </small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No reminders for today.</p>
                )}
              </div>
            </div>
          </div>

          {/* Overdue Payments */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow border-0 h-100">
              <div
                className="card-header text-white"
                style={{
                  background: "linear-gradient(45deg, #dc3545, #ff6b6b)",
                }}
              >
                <h5 className="mb-0">💸 Overdue Customers</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover m-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overduePayments.length > 0 ? (
                        overduePayments.map((customer) => (
                          <tr key={customer.CustomerID}>
                            <td>{customer.CustomerID}</td>
                            <td>{customer.CustomerName}</td>
                            <td>{customer.Phone}</td>
                            <td>
                              <Link
                                to={`/customerpayment/${customer.CustomerID}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                View Payments
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">
                            No overdue customers found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
