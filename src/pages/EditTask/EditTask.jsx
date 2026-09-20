import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading/Loading";
import styles from "./EditTask.module.css";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadTask = async () => {
      if (!id) {
        setError("Task ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/tasks/${id}`);

        console.log(
          "EDIT TASK RESPONSE:",
          response.data
        );

        const task = response.data?.data;

        if (!task) {
          throw new Error(
            "Task data was not returned by the server."
          );
        }

        setFormData({
          title: task.title || "",
          description: task.description || "",
          status: task.status?.toLowerCase() || "pending",
          priority: task.priority?.toLowerCase() || "medium",
          dueDate: task.dueDate
            ? new Date(task.dueDate)
                .toISOString()
                .split("T")[0]
            : "",
        });
      } catch (err) {
        console.error(
          "LOAD EDIT TASK ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Task not found."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);


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
      setSaving(true);

      const updatedTask = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status.toLowerCase(),
        priority: formData.priority.toLowerCase(),
        dueDate: formData.dueDate || undefined,
      };

      console.log(
        "UPDATING TASK:",
        updatedTask
      );

      const response = await api.put(
        `/tasks/${id}`,
        updatedTask
      );

      console.log(
        "TASK UPDATED:",
        response.data
      );

      navigate(`/tasks/${id}`);
    } catch (err) {
      console.error(
        "UPDATE TASK ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update task."
      );
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return <Loading />;
  }


  if (error && !formData.title) {
    return (
      <div className={styles.page}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>!</div>

          <h2>Task Not Found</h2>

          <p>{error}</p>

          <Link
            to="/tasks"
            className={styles.primaryButton}
          >
            ← Back to Tasks
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className={styles.page}>
      <div className={styles.container}>


        <div className={styles.header}>

          <div className={styles.headerContent}>
            <div className={styles.pageIcon}>✎</div>

            <div>
              <h1>Edit Task</h1>

              <p>
                Update your task information and details.
              </p>
            </div>
          </div>

          <Link
            to={`/tasks/${id}`}
            className={styles.backButton}
          >
            ← Back to Task
          </Link>

        </div>


        {error && (
          <div className={styles.errorMessage}>
            <span>!</span>
            {error}
          </div>
        )}


        <div className={styles.formCard}>

          <div className={styles.formHeader}>
            <h2>Task Information</h2>

            <p>
              Modify the information below and save your changes.
            </p>
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
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
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
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description..."
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

              <Link
                to={`/tasks/${id}`}
                className={styles.cancelButton}
              >
                Cancel
              </Link>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className={styles.spinner}></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    Save Changes
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