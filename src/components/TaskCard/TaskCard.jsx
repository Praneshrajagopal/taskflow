import { Link } from "react-router-dom";
import styles from "./TaskCard.module.css";

export default function TaskCard({ task, onDelete }) {
  const getStatusClass = () => {
    switch (task.status) {
      case "completed":
        return styles.completed;

      case "in-progress":
        return styles.inProgress;

      case "cancelled":
        return styles.cancelled;

      default:
        return styles.pending;
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  const formatPriority = (priority) => {
    if (!priority) return "Medium";

    return (
      priority.charAt(0).toUpperCase() +
      priority.slice(1)
    );
  };

  return (
    <article className={styles.card}>

      <div className={styles.cardHeader}>

        <span className={styles.priority}>
          {formatPriority(task.priority)}
        </span>

        <span
          className={`${styles.status} ${getStatusClass()}`}
        >
          {formatStatus(task.status)}
        </span>

      </div>

      <Link
        to={`/tasks/${task._id}`}
        className={styles.title}
      >
        {task.title}
      </Link>

      <p className={styles.description}>
        {task.description || "No description provided."}
      </p>

      <div className={styles.date}>
        <span>▣</span>

        {task.dueDate
          ? `Due: ${new Date(
              task.dueDate
            ).toLocaleDateString()}`
          : "No due date"}
      </div>

      <div className={styles.actions}>

        <Link
          to={`/tasks/${task._id}`}
          className={styles.viewButton}
        >
          ◉ View
        </Link>

        <Link
          to={`/tasks/${task._id}/edit`}
          className={styles.editButton}
        >
          ✎ Edit
        </Link>

        <button
          type="button"
          className={styles.deleteButton}
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>

      </div>

    </article>
  );
}