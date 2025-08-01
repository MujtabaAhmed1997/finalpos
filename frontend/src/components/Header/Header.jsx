// import React from 'react';
// import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';
// import { useNavigate } from 'react-router-dom';
// import '../Header/Header.css';

// function Header({ OpenSidebar }) {
//   const navigate = useNavigate();

//   const handleBellClick = () => {
//     navigate('/customerpayment/overdue');
//   };

//   const handleEnvelopeClick = () => {
//     alert('Messages clicked!');
//   };

//   const handlePersonClick = () => {
//     alert('Profile clicked!');
//   };

//   return (
//     <header className='header'>
//       <div className='menu-icon'>
//         <BsJustify className='icon' onClick={OpenSidebar} />
//       </div>
//       <div className='header-left'>
//         <BsSearch className='icon' />
//       </div>
//       <div className='header-right'>
//         <div className='icon-container' onClick={handleBellClick}>
//           <BsFillBellFill className='icon' />
//         </div>
//         <div className='icon-container' onClick={handleEnvelopeClick}>
//           <BsFillEnvelopeFill className='icon' />
//         </div>
//         <div className='icon-container' onClick={handlePersonClick}>
//           <BsPersonCircle className='icon' />
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;

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

function Header({ OpenSidebar }) {
  const navigate = useNavigate();
  const [hasReminder, setHasReminder] = useState(false);
  const [hasOverdue, setHasOverdue] = useState(false);

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

  const handleEnvelopeClick = () => alert("Messages clicked!");
  const handlePersonClick = () => alert("Profile clicked!");

  const shouldShowDot = hasReminder || hasOverdue;

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">
        <BsSearch className="icon" />
      </div>
      <div className="header-right">
        <div className="icon-container relative" onClick={handleBellClick}>
          <BsFillBellFill className="icon" />
          {shouldShowDot && (
            <span
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                height: "10px",
                width: "10px",
                backgroundColor: "red",
                borderRadius: "50%",
                border: "1px solid white",
              }}
            ></span>
          )}
        </div>
        <div className="icon-container" onClick={handleEnvelopeClick}>
          <BsFillEnvelopeFill className="icon" />
        </div>
        <div className="icon-container" onClick={handlePersonClick}>
          <BsPersonCircle className="icon" />
        </div>
      </div>
    </header>
  );
}

export default Header;
