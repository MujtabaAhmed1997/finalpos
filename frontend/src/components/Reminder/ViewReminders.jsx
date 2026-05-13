import React, { useState, useEffect } from "react";
import { 
  BsFillAlarmFill, 
  BsSearch, 
  BsFilter, 
  BsCalendar3,
  BsTrash,
  BsPencil,
  BsPlus,
  BsClock,
  BsCheckCircle,
  BsExclamationCircle
} from "react-icons/bs";
import "./ViewReminders.css";
import { useConfirm } from "../../ui/confirm/ConfirmProvider";
import { useToast } from "../../ui/toast/ToastProvider";
import { useNavigate } from "react-router-dom";
import { get, put, delete_ } from "../../service/apiClient";

const ViewReminders = () => {
  const { confirm } = useConfirm();
  const toast = useToast();
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAllReminders();
  }, []);

  const fetchAllReminders = async () => {
    try {
      setLoading(true);
      const response = await get("/reminders/all");
      setReminders(response.data.reminders || []);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch reminders:", error);
      setError("Failed to load reminders");
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reminderId) => {
    const ok = await confirm({
      title: "Delete reminder?",
      description: "This will permanently delete the reminder.",
      confirmText: "Delete",
      cancelText: "Cancel",
      tone: "danger",
    });
    if (!ok) return;

    try {
      await delete_(`/reminders/${reminderId}`);
      toast.success("Reminder deleted.");
      fetchAllReminders();
    } catch (error) {
      console.error("Failed to delete reminder:", error);
      toast.error("Failed to delete reminder");
    }
  };

  const handleEdit = (reminder) => {
    setSelectedReminder(reminder);
    setShowModal(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      await put(`/reminders/${selectedReminder.ReminderID}`, updatedData);
      setShowModal(false);
      setSelectedReminder(null);
      toast.success("Reminder updated.");
      fetchAllReminders();
    } catch (error) {
      console.error("Failed to update reminder:", error);
      toast.error("Failed to update reminder");
    }
  };

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.TaskDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || reminder.Date === filterDate;
    return matchesSearch && matchesDate;
  });

  const getPriorityColor = (date) => {
    const today = new Date();
    const reminderDate = new Date(date);
    const diffTime = reminderDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "overdue";
    if (diffDays === 0) return "today";
    if (diffDays <= 3) return "urgent";
    return "normal";
  };

  const getPriorityIcon = (date) => {
    const priority = getPriorityColor(date);
    switch (priority) {
      case "overdue":
        return <BsExclamationCircle className="priority-icon overdue" />;
      case "today":
        return <BsClock className="priority-icon today" />;
      case "urgent":
        return <BsExclamationCircle className="priority-icon urgent" />;
      default:
        return <BsCheckCircle className="priority-icon normal" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="reminder-view-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading reminders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reminder-view-container">
      <div className="reminder-header">
        <div className="header-content">
          <div className="header-left">
            <BsFillAlarmFill className="header-icon" />
            <h1>Reminders</h1>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{reminders.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {reminders.filter(r => getPriorityColor(r.Date) === "today").length}
              </span>
              <span className="stat-label">Today</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {reminders.filter(r => getPriorityColor(r.Date) === "overdue").length}
              </span>
              <span className="stat-label">Overdue</span>
            </div>
          </div>
        </div>
      </div>

      <div className="reminder-controls">
        <div className="search-filter-section">
          <div className="search-box">
            <BsSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search reminders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-box">
            <BsFilter className="filter-icon" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="date-filter"
            />
            {filterDate && (
              <button 
                onClick={() => setFilterDate("")}
                className="clear-filter"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <button 
          onClick={() => navigate("/reminder/add")}
          className="add-reminder-btn"
        >
          <BsPlus /> Add Reminder
        </button>
      </div>

      {error && (
        <div className="error-message">
          <BsExclamationCircle />
          {error}
        </div>
      )}

      <div className="reminders-grid">
        {filteredReminders.length > 0 ? (
          filteredReminders.map((reminder) => (
            <div 
              key={reminder.ReminderID} 
              className={`reminder-card ${getPriorityColor(reminder.Date)}`}
            >
              <div className="reminder-card-header">
                {getPriorityIcon(reminder.Date)}
                <div className="reminder-date">
                  <BsCalendar3 />
                  {formatDate(reminder.Date)}
                </div>
              </div>
              
              <div className="reminder-content">
                <p className="reminder-description">{reminder.TaskDescription}</p>
              </div>

              <div className="reminder-actions">
                <button 
                  onClick={() => handleEdit(reminder)}
                  className="action-btn edit-btn"
                  title="Edit"
                >
                  <BsPencil />
                </button>
                <button 
                  onClick={() => handleDelete(reminder.ReminderID)}
                  className="action-btn delete-btn"
                  title="Delete"
                >
                  <BsTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <BsFillAlarmFill className="empty-icon" />
            <h3>No reminders found</h3>
            <p>
              {searchTerm || filterDate 
                ? "Try adjusting your search or filter criteria"
                : "Create your first reminder to get started"
              }
            </p>
            {!searchTerm && !filterDate && (
              <button 
                onClick={() => navigate("/reminder/add")}
                className="add-first-reminder-btn"
              >
                <BsPlus /> Add Your First Reminder
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && selectedReminder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Reminder</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleUpdate({
                TaskDescription: formData.get('description'),
                Date: formData.get('date')
              });
            }}>
              <div className="form-group">
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  defaultValue={selectedReminder.TaskDescription}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={selectedReminder.Date}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReminders; 