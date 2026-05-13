import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./NotificationBell.css";
import { get } from "../service/apiClient";

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
          get(`/reminders?date=${today}`),
          get("/overdue"),
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
    <div className="notification-container">
      <div className="notification-header">
        <div className="notification-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
          </svg>
        </div>
        <h1 className="notification-title">Notifications Center</h1>
        <p className="notification-subtitle">Stay updated with your daily alerts</p>
      </div>

      {error && (
        <div className="error-message">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading notifications...</p>
        </div>
      ) : (
        <div className="notification-grid">
          {/* Reminders Section */}
          <div className="notification-card reminders-card">
            <div className="card-header">
              <div className="card-icon reminders-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="card-title-section">
                <h2 className="card-title">Today's Reminders</h2>
                <span className="card-count">{reminders.length}</span>
              </div>
            </div>
            <div className="card-content">
              {reminders.length > 0 ? (
                <div className="reminders-list">
                  {reminders.map((reminder, idx) => (
                    <div key={idx} className="reminder-item">
                      <div className="reminder-content">
                        <p className="reminder-text">
                          {reminder.TaskDescription || "No description provided"}
                        </p>
                        <span className="reminder-time">
                          {new Date(reminder.createdAt || Date.now()).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <p>No reminders for today</p>
                </div>
              )}
            </div>
          </div>

          {/* Overdue Payments Section */}
          <div className="notification-card overdue-card">
            <div className="card-header">
              <div className="card-icon overdue-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
              <div className="card-title-section">
                <h2 className="card-title">Overdue Payments</h2>
                <span className="card-count overdue-count">{overduePayments.length}</span>
              </div>
            </div>
            <div className="card-content">
              {overduePayments.length > 0 ? (
                <div className="overdue-table">
                  <div className="table-header">
                    <span>Customer</span>
                    <span>Phone</span>
                    <span>Action</span>
                  </div>
                  <div className="table-body">
                    {overduePayments.map((customer) => (
                      <div key={customer.CustomerID} className="table-row">
                        <div className="customer-info">
                          <span className="customer-id">#{customer.CustomerID}</span>
                          <span className="customer-name">{customer.CustomerName}</span>
                        </div>
                        <span className="customer-phone">{customer.Phone}</span>
                        <Link
                          to={`/customerpayment/${customer.CustomerID}`}
                          className="action-button"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          </svg>
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <p>No overdue payments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
