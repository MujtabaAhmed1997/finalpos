import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsFillAlarmFill, BsClock, BsExclamationCircle } from "react-icons/bs";
import "./ReminderWidget.css";

const ReminderWidget = () => {
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("ReminderWidget component rendered"); // Debug log

  useEffect(() => {
    console.log("ReminderWidget useEffect triggered"); // Debug log
    fetchUpcomingReminders();
  }, []);

  const fetchUpcomingReminders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/reminders/all");
      const allReminders = response.data.reminders || [];
      
      console.log("All reminders:", allReminders); // Debug log
      
      // Filter for upcoming reminders (today and next 3 days)
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day
      const next3Days = new Date();
      next3Days.setDate(today.getDate() + 3);
      next3Days.setHours(23, 59, 59, 999); // Set to end of day
      
      console.log("Today:", today); // Debug log
      console.log("Next 3 days:", next3Days); // Debug log
      
      const upcoming = allReminders.filter(reminder => {
        const reminderDate = new Date(reminder.Date);
        reminderDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
        console.log("Reminder date:", reminderDate, "Task:", reminder.TaskDescription); // Debug log
        return reminderDate >= today && reminderDate <= next3Days;
      }).slice(0, 5); // Show only first 5 upcoming reminders
      
      console.log("Upcoming reminders:", upcoming); // Debug log
      
      // If no upcoming reminders, show all reminders for debugging
      if (upcoming.length === 0 && allReminders.length > 0) {
        console.log("No upcoming reminders found, showing all reminders for debugging");
        setUpcomingReminders(allReminders.slice(0, 3));
      } else if (upcoming.length === 0 && allReminders.length === 0) {
        // Add a test reminder for debugging
        console.log("No reminders in database, adding test reminder");
        const testReminder = {
          ReminderID: 'test',
          TaskDescription: 'Test reminder - check if widget is working',
          Date: new Date().toISOString()
        };
        setUpcomingReminders([testReminder]);
      } else {
        setUpcomingReminders(upcoming);
      }
    } catch (error) {
      console.error("Failed to fetch upcoming reminders:", error);
      setUpcomingReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (date) => {
    const today = new Date();
    const reminderDate = new Date(date);
    const diffTime = reminderDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return <BsExclamationCircle className="priority-icon urgent" />;
    } else if (diffDays <= 3) {
      return <BsClock className="priority-icon warning" />;
    }
    return <BsFillAlarmFill className="priority-icon normal" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="reminder-widget">
        <div className="widget-header">
          <BsFillAlarmFill className="widget-icon" />
          <h3>Upcoming Reminders</h3>
        </div>
        <div className="widget-content">
          <div className="loading-spinner-small"></div>
          <p style={{textAlign: 'center', marginTop: '10px', fontSize: '0.9rem'}}>Loading reminders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reminder-widget">
      <div className="widget-header">
        <BsFillAlarmFill className="widget-icon" />
        <h3>Upcoming Reminders</h3>
        <span className="reminder-count">{upcomingReminders.length}</span>
      </div>
      
      <div className="widget-content">
        {upcomingReminders.length > 0 ? (
          <div className="reminder-list">
            {upcomingReminders.map((reminder, index) => (
              <div key={reminder.ReminderID} className="reminder-item">
                <div className="reminder-item-header">
                  {getPriorityIcon(reminder.Date)}
                  <span className="reminder-date">{formatDate(reminder.Date)}</span>
                </div>
                <p className="reminder-text">{reminder.TaskDescription}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reminders">
            <p>No upcoming reminders</p>
            <p style={{fontSize: '0.8rem', opacity: 0.8}}>Debug: {loading ? 'Loading...' : 'No reminders found'}</p>
          </div>
        )}
        
        <div className="widget-footer">
          <button 
            onClick={() => window.location.href = "/reminder/view"}
            className="view-all-btn"
          >
            View All Reminders
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderWidget; 