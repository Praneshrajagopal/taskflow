import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/Loading/Loading";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog/DeleteConfirmDialog";
import styles from "./TaskDetails.module.css";

export default function TaskDetails() {
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);


  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/tasks/${id}`);

        const taskData = response.data?.data;

        if (!taskData) {
          throw new Error("Task not found.");
        }

        setTask(taskData);
      } catch (err) {
        console.error("LOAD TASK ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load task."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);


  const handleDelete = async () => {
    try {
      setDeleting(true);

      await api.delete(`/tasks/${id}`);

      window.location.href = "/tasks";
    } catch (err) {
      console.error("DELETE TASK ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete task."
      );

      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };


  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };


  if (loading) {
    return <Loading />;
  }


  if (!task) {
    return (
      <div className={styles.page}>
        <div className={styles.errorCard}>
          <h2>Task Not Found</h2>

          <p>
            {error || "The task could not be found."}
          </p>

          <Link
            to="/tasks"
            className={styles.backButton}
          >
            ← Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.page}>

        <div className={styles.container}>


          <div className={styles.pageHeader}>

            <div>
              <h1>Task Details</h1>

              <p>
                View your task information.
              </p>
            </div>

            <Link
              to="/tasks"
              className={styles.backButton}
            >
              ← Back to Tasks
            </Link>

          </div>



          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}



          <div className={styles.card}>


            <div className={styles.cardHeader}>

              <div>

                <span className={styles.taskLabel}>
                  TASK
                </span>

                <h2 className={styles.taskTitle}>
                  {task.title}
                </h2>

                <p className={styles.created}>
                  Created:{" "}
                  {task.createdAt
                    ? new Date(
                        task.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>

              </div>

              <span
                className={`${styles.status} ${
                  task.status === "completed"
                    ? styles.completed
                    : task.status ===
                      "in-progress"
                    ? styles.inProgress
                    : task.status === "cancelled"
                    ? styles.cancelled
                    : styles.pending
                }`}
              >
                {formatStatus(task.status)}
              </span>

            </div>



            <div className={styles.section}>

              <h3>
                Description
              </h3>

              <p>
                {task.description ||
                  "No description provided."}
              </p>

            </div>



            <div className={styles.infoGrid}>

              <div className={styles.infoItem}>
                <span>Priority</span>
                <strong>
                  {task.priority || "Medium"}
                </strong>
              </div>

              <div className={styles.infoItem}>
                <span>Status</span>
                <strong>
                  {formatStatus(task.status)}
                </strong>
              </div>

              <div className={styles.infoItem}>
                <span>Due Date</span>
                <strong>
                  {task.dueDate
                    ? new Date(
                        task.dueDate
                      ).toLocaleDateString()
                    : "No due date"}
                </strong>
              </div>

              <div className={styles.infoItem}>
                <span>Last Updated</span>
                <strong>
                  {task.updatedAt
                    ? new Date(
                        task.updatedAt
                      ).toLocaleDateString()
                    : "N/A"}
                </strong>
              </div>

            </div>



            <div className={styles.actions}>

              <button
                type="button"
                className={styles.deleteButton}
                onClick={() =>
                  setShowDeleteDialog(true)
                }
              >
                Delete Task
              </button>

            </div>

          </div>

        </div>

      </div>



      {showDeleteDialog && (
        <DeleteConfirmDialog
          taskName={task.title}
          deleting={deleting}
          onCancel={() =>
            setShowDeleteDialog(false)
          }
          onConfirm={handleDelete}
        />
      )}

    </>
  );
}