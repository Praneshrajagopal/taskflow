import { useState } from "react";
import styles from "./TaskForm.module.css";

const initialValues = {
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
  status: "pending",
};

export default function TaskForm({
  initialData = initialValues,
  onSubmit,
  submitting = false,
  submitText = "Save Task",
}) {
  const [form, setForm] = useState({
    ...initialValues,
    ...initialData,
    priority: initialData?.priority?.toLowerCase() || "medium",
    status: initialData?.status?.toLowerCase() || "pending",
    dueDate: initialData?.dueDate
      ? new Date(initialData.dueDate)
          .toISOString()
          .slice(0, 10)
      : "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.dueDate
    ) {
      setError(
        "Title, description and due date are required."
      );
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(`${form.dueDate}T00:00:00`);

    if (selectedDate < today) {
      setError("Due date cannot be in the past.");
      return;
    }

    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority.toLowerCase(),
        status: form.status.toLowerCase(),
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save the task."
      );
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      {error && (
        <div className={styles.errorMessage}>
          <span>!</span>
          {error}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="title">
          Task Title
          <span className={styles.required}>*</span>
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter task title"
          maxLength={120}
        />

        <div className={styles.counter}>
          {form.title.length}/120
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">
          Description
          <span className={styles.required}>*</span>
        </label>

        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the task..."
          rows={5}
          maxLength={1000}
        />

        <div className={styles.counter}>
          {form.description.length}/1000
        </div>
      </div>

      <div className={styles.grid}>

        <div className={styles.formGroup}>
          <label htmlFor="dueDate">
            Due Date
            <span className={styles.required}>*</span>
          </label>

          <input
            id="dueDate"
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="priority">
            Priority
          </label>

          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">
              In Progress
            </option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={submitting}
        >
          {submitting ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}