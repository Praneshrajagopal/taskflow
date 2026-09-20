import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from "./CreateTask.module.css";

export default function CreateTask() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setLoading(true);

      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status.toLowerCase(),
        priority: formData.priority.toLowerCase(),
        dueDate: formData.dueDate || undefined,
      };

      console.log("CREATING TASK:", taskData);

      const response = await api.post("/tasks", taskData);

      console.log("TASK CREATED:", response.data);

      navigate("/tasks");
    } catch (err) {
      console.error("CREATE TASK ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create task."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>

      <div className={styles.container}>


        <div className={styles.header}>

          <div className={styles.headerContent}>
            <div className={styles.pageIcon}>+</div>

            <div>
              <h1>Create New Task</h1>

              <p>
                Create a new task and add it to your workspace.
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/tasks")}
          >
            ← Back to Tasks
          </button>

        </div>


        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>!</span>

            <span>{error}</span>
          </div>
        )}


        <div className={styles.formCard}>

          <div className={styles.formHeader}>
            <div>
              <h2>Task Information</h2>

              <p>
                Enter the details for your new task.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className={styles.form}
          >


            <div className={styles.formGroup}>

              <label htmlFor="title">
                Task Title
                <span>*</span>
              </label>

              <input
                id="title"
                type="text"
                name="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                required
              />

              <small>
                {formData.title.length}/100 characters
              </small>

            </div>


            <div className={styles.formGroup}>

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe the task and any important details..."
                value={formData.description}
                onChange={handleChange}
                maxLength={1000}
                rows={6}
              />

              <small>
                {formData.description.length}/1000 characters
              </small>

            </div>


            <div className={styles.detailsTitle}>
              Task Details
            </div>

            <div className={styles.detailsGrid}>


              <div className={styles.formGroup}>

                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>

              </div>


              <div className={styles.formGroup}>

                <label htmlFor="priority">
                  Priority
                </label>

                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">
                    Low
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">
                    High
                  </option>
                </select>

              </div>


              <div className={styles.formGroup}>

                <label htmlFor="dueDate">
                  Due Date
                </label>

                <input
                  id="dueDate"
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />

              </div>

            </div>


            <div className={styles.actions}>

              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => navigate("/tasks")}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.buttonSpinner}></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <span>+</span>
                    Create Task
                  </>
                )}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}