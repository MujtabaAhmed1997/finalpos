import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import { useEffect, useState } from "react";
import axios from "axios";
import "./AddReminderComponent.css"; // Reuse the same styling

const DisplayReminderComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      try {
        const formattedDate = formatDate(selectedDate);
        const response = await axios.get(
          `http://localhost:3001/api/reminders?date=${formattedDate}`
        );
        setReminders(response.data.reminders);
      } catch (error) {
        console.error("Failed to fetch reminders:", error);
        setReminders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, [selectedDate]);
  console.log(reminders, "reminders");
  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Your Reminders</h2>

        <div className="calendar-container">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="calendar"
          />
        </div>

        <div className="reminder-list mt-4">
          {loading ? (
            <div className="alert alert-secondary">Loading reminders...</div>
          ) : reminders.length > 0 ? (
            reminders.map((reminder, index) => (
              <div key={index} className="alert alert-info mt-2">
                📌 {reminder.TaskDescription}
              </div>
            ))
          ) : (
            <div className="alert alert-warning mt-3">
              No reminders for this date.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayReminderComponent;
