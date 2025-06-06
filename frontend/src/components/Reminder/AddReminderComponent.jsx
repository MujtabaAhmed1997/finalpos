// import "react-calendar/dist/Calendar.css";
// import Calendar from "react-calendar";
// import { useState } from "react";
// import "./AddReminderComponent.css";

// const AddReminderComponent = () => {
//   const [value, setChange] = useState(new Date());

//   return (
//     <div className="container">
//       <div className="card">
//         <h2 className="title">Add Reminder</h2>

//         <div className="calendar-container">
//           <Calendar onChange={setChange} value={value} className="calendar" />
//         </div>

//         <div className="input-group">
//           <label htmlFor="reminder-desc" className="label">
//             Task Description
//           </label>
//           <textarea
//             name="reminder-desc"
//             id="reminder-desc"
//             className="textarea"
//             placeholder="Enter your task details here..."
//             rows="4"
//           ></textarea>
//         </div>

//         <button className="submit-button">Submit</button>
//       </div>
//     </div>
//   );
// };

// export default AddReminderComponent;

import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import { useState } from "react";
import axios from "axios";
import "./AddReminderComponent.css";

const AddReminderComponent = () => {
  const [value, setChange] = useState(new Date());
  const [taskDescription, setTaskDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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

      const response = await axios.post(
        "http://localhost:3001/api/reminders/add",
        {
          TaskDescription: taskDescription,
          Date: formattedDate,
        }
      );

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

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Add Reminder</h2>

        <div className="calendar-container">
          <Calendar onChange={setChange} value={value} className="calendar" />
        </div>

        <div className="input-group">
          <label htmlFor="reminder-desc" className="label">
            Task Description
          </label>
          <textarea
            name="reminder-desc"
            id="reminder-desc"
            className="textarea"
            placeholder="Enter your task details here..."
            rows="4"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          ></textarea>
        </div>

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AddReminderComponent;
