import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddReminderComponent.css";
import { post } from "../../service/apiClient";

const AddReminderComponent = () => {
  const [value, setChange] = useState(new Date());
  const [taskDescription, setTaskDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!taskDescription || !value) {
      setErrorMsg("Please enter a task and choose a date.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const formattedDate = value.toISOString().split("T")[0]; // yyyy-mm-dd

      const response = await post("/reminders/add", {
        TaskDescription: taskDescription,
        Date: formattedDate,
      });

      setSuccessMsg("Reminder added successfully!");
      setTaskDescription(""); // Clear the textarea
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoToHomepage = () => {
    navigate("/homepage");
  };

  return (
    <div className="reminder-container">
      <div className="reminder-card">
        <header className="reminder-header">
          <div className="reminder-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="reminder-title">Add New Reminder</h1>
          <p className="reminder-subtitle">Schedule your important tasks and never miss a deadline</p>
          <button
            type="button"
            className="homepage-button"
            onClick={handleGoToHomepage}
            aria-label="Go to homepage"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor"/>
            </svg>
            <span>Go to Homepage</span>
          </button>
        </header>

        <main className="reminder-content">
          <section className="calendar-section">
            <label className="section-label" htmlFor="reminder-calendar">Select Date</label>
            <div className="calendar-wrapper">
              <Calendar 
                onChange={setChange} 
                value={value} 
                className="reminder-calendar"
                minDate={new Date()}
                id="reminder-calendar"
              />
            </div>
          </section>

          <section className="task-section">
            <label className="section-label" htmlFor="reminder-textarea">Task Description</label>
            <div className="textarea-wrapper">
              <textarea
                id="reminder-textarea"
                className="reminder-textarea"
                placeholder="Enter your task details here... (e.g., Follow up with supplier, Review inventory, etc.)"
                rows="4"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                maxLength={500}
                aria-describedby="char-counter"
              ></textarea>
              <div id="char-counter" className="char-count" aria-live="polite">
                {taskDescription.length}/500 characters
              </div>
            </div>
          </section>

          {errorMsg && (
            <div className="alert alert-error" role="alert" aria-live="assertive">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success" role="alert" aria-live="polite">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          <footer className="reminder-actions">
            <button
              type="button"
              className="reminder-button"
              onClick={handleSubmit}
              disabled={loading}
              aria-describedby={loading ? "loading-text" : "button-text"}
            >
              {loading ? (
                <>
                  <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span id="loading-text">Saving Reminder...</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
                  </svg>
                  <span id="button-text">Add Reminder</span>
                </>
              )}
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AddReminderComponent;
