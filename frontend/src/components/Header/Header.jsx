import React, { useEffect, useState } from "react";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Header/Header.css";
import { useToast } from "../../ui/toast/ToastProvider";

function Header({ OpenSidebar }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [hasReminder, setHasReminder] = useState(false);
  const [hasOverdue, setHasOverdue] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check today's reminders only
  const checkTodayReminders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/reminders/all"
      );
      const today = new Date().toISOString().split("T")[0];

      const todayReminders = response.data.reminders.filter((reminder) => {
        const reminderDate = new Date(reminder.Date)
          .toISOString()
          .split("T")[0];
        return reminderDate === today;
      });

      setHasReminder(todayReminders.length > 0);
    } catch (error) {
      console.error("Error checking today's reminders:", error);
    }
  };

  // Check today's overdue payments only
  const checkTodayOverduePayments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/overdue"
      );
      
      // The overdue service returns customers whose latest payment is older than 5 days
      // We'll show the notification if there are any overdue customers
      setHasOverdue(response.data.length > 0);
    } catch (error) {
      console.error("Error checking today's overdue payments:", error);
    }
  };

  useEffect(() => {
    checkTodayReminders();
    checkTodayOverduePayments();

    const interval = setInterval(() => {
      checkTodayReminders();
      checkTodayOverduePayments();
    }, 120000); // check every 2 mins

    return () => clearInterval(interval);
  }, []);

  const handleBellClick = async () => {
    try {
      await axios.post("http://localhost:3001/api/notifications/dismiss");
      setHasReminder(false);
      setHasOverdue(false);
    } catch (err) {
      console.error("Error dismissing notifications:", err);
    }

    navigate("/notification");
  };

  const handleEnvelopeClick = () => toast.info("Messages feature is not implemented yet.");
  const handlePersonClick = () => toast.info("Profile feature is not implemented yet.");
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const shouldShowDot = hasReminder || hasOverdue;

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      
      <div className="header-left">
        <form onSubmit={handleSearch} className="search-container">
          <BsSearch className="icon" />
          <input
            type="text"
            placeholder="Search products, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      
      <div className="header-right">
        <div 
          className="icon-container relative" 
          onClick={handleBellClick}
          data-tooltip="Notifications"
        >
          <BsFillBellFill className="icon" />
          {shouldShowDot && (
            <span className="notification-dot"></span>
          )}
        </div>
        
        <div 
          className="icon-container" 
          onClick={handleEnvelopeClick}
          data-tooltip="Messages"
        >
          <BsFillEnvelopeFill className="icon" />
        </div>
        
        <div 
          className="profile-section" 
          onClick={handlePersonClick}
        >
          <BsPersonCircle className="icon" />
          <div className="profile-info">
            <div className="profile-name">Admin User</div>
            <div className="profile-role">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
