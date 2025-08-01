import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsFillAlarmFill, BsClock, BsExclamationCircle } from "react-icons/bs";
import "./ReminderWidget.css";

const ReminderWidget = () => {
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingReminders();
  }, []);

  const fetchUpcomingReminders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/reminders/all");
      const allReminders = response.data.reminders || [];
      
      // Filter for upcoming reminders (today and next 3 days)
      const today = new Date();
      const next3Days = new Date();
      next3Days.setDate(today.getDate() + 3);
      
      const upcoming = allReminders.filter(reminder => {
        const reminderDate = new Date(reminder.Date);
        return reminderDate >= today && reminderDate <= next3Days;
      }).slice(0, 5); // Show only first 5 upcoming reminders
      
      setUpcomingReminders(upcoming);
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