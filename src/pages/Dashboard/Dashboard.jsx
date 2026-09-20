import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";
import Loading from "../../components/Loading/Loading";

import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    cancelled: 0,
    highPriority: 0,
    completionPercentage: 0,
  });

  const [recentTasks, setRecentTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const statsResponse = await api.get("/tasks/stats");

      console.log(
        "DASHBOARD STATS:",
        statsResponse.data
      );

      const statsData =
        statsResponse.data?.data || {};

      setStats({
        total: statsData.total ?? 0,
        completed: statsData.completed ?? 0,
        pending: statsData.pending ?? 0,
        inProgress: statsData.inProgress ?? 0,
        cancelled: statsData.cancelled ?? 0,
        highPriority: statsData.highPriority ?? 0,
        completionPercentage:
          statsData.completionPercentage ?? 0,
      });

      const tasksResponse = await api.get(
        "/tasks?sort=createdAt&order=desc"
      );

      console.log(
        "RECENT TASKS:",
        tasksResponse.data
      );

      const tasksData =
        tasksResponse.data?.data || [];

      setRecentTasks(
        Array.isArray(tasksData)
          ? tasksData.slice(0, 5)
          : []
      );
    } catch (err) {
      console.error(
        "DASHBOARD ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard."
      );

      setRecentTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);


  const formatStatus = (status) => {
    if (!status) {
      return "Pending";
    }

    return status
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };


  const getStatusClass = (status) => {
    switch (status) {
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


  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return styles.highPriority;

      case "low":
        return styles.lowPriority;

      default:
        return styles.mediumPriority;
    }
  };


  const formatPriority = (priority) => {
    if (!priority) {
      return "Medium";
    }

    return (
      priority.charAt(0).toUpperCase() +
      priority.slice(1)
    );
  };


  if (loading) {
    return <Loading />;
  }


  return (
    <div className={styles.dashboard}>


      <div className={styles.pageHeader}>

        <div className={styles.headerText}>

          <h1>
            Dashboard
          </h1>

          <p>
            Track your work and stay on top of your tasks.
          </p>

        </div>

        <Link
          to="/tasks/new"
          className={styles.primaryButton}
        >
          <span className={styles.buttonIcon}>
            +
          </span>

          New Task
        </Link>

      </div>



      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>
            !
          </span>

          {error}
        </div>
      )}



      <div className={styles.stats}>


        <div className={styles.statCard}>

          <div
            className={`${styles.statIcon} ${styles.totalIcon}`}
          >
            ✓
          </div>

          <div className={styles.statContent}>

            <span>
              Total Tasks
            </span>

            <strong>
              {stats.total}
            </strong>

          </div>

        </div>



        <div className={styles.statCard}>

          <div
            className={`${styles.statIcon} ${styles.completedIcon}`}
          >
            ✓
          </div>

          <div className={styles.statContent}>

            <span>
              Completed
            </span>

            <strong>
              {stats.completed}
            </strong>

          </div>

        </div>



        <div className={styles.statCard}>

          <div
            className={`${styles.statIcon} ${styles.pendingIcon}`}
          >
            ◷
          </div>

          <div className={styles.statContent}>

            <span>
              Pending
            </span>

            <strong>
              {stats.pending}
            </strong>

          </div>

        </div>



        <div className={styles.statCard}>

          <div
            className={`${styles.statIcon} ${styles.priorityIcon}`}
          >
            !
          </div>

          <div className={styles.statContent}>

            <span>
              High Priority
            </span>

            <strong>
              {stats.highPriority}
            </strong>

          </div>

        </div>

      </div>



      <div className={styles.dashboardGrid}>


        <div className={styles.completionCard}>

          <div className={styles.cardHeader}>

            <div>

              <h2>
                Task Completion
              </h2>

              <p>
                Overall task completion progress
              </p>

            </div>

            <div className={styles.percentage}>
              {stats.completionPercentage}%
            </div>

          </div>



          <div className={styles.progressBackground}>

            <div
              className={styles.progressBar}
              style={{
                width: `${Math.min(
                  Math.max(
                    stats.completionPercentage,
                    0
                  ),
                  100
                )}%`,
              }}
            />

          </div>



          <div className={styles.progressInfo}>

            <span>
              {stats.completed} completed
            </span>

            <span>
              {stats.total} total tasks
            </span>

          </div>



          <div className={styles.statusSummary}>

            <div>
              <span
                className={`${styles.dot} ${styles.greenDot}`}
              />
              Completed

              <strong>
                {stats.completed}
              </strong>
            </div>

            <div>
              <span
                className={`${styles.dot} ${styles.yellowDot}`}
              />
              Pending

              <strong>
                {stats.pending}
              </strong>
            </div>

            <div>
              <span
                className={`${styles.dot} ${styles.blueDot}`}
              />
              In Progress

              <strong>
                {stats.inProgress}
              </strong>
            </div>

          </div>

        </div>



        <div className={styles.quickCard}>

          <div className={styles.cardHeader}>

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Manage your workspace
              </p>

            </div>

          </div>


          <Link
            to="/tasks/new"
            className={styles.quickAction}
          >

            <span className={styles.quickIcon}>
              +
            </span>

            <div>
              <strong>
                Create New Task
              </strong>

              <small>
                Add a task to your workspace
              </small>
            </div>

            <span className={styles.arrow}>
              →
            </span>

          </Link>


          <Link
            to="/tasks"
            className={styles.quickAction}
          >

            <span className={styles.quickIcon}>
              ✓
            </span>

            <div>
              <strong>
                View All Tasks
              </strong>

              <small>
                Manage your existing tasks
              </small>
            </div>

            <span className={styles.arrow}>
              →
            </span>

          </Link>

        </div>

      </div>



      <section className={styles.recent}>

        <div className={styles.sectionHeader}>

          <div>

            <h2>
              Recent Tasks
            </h2>

            <p>
              Your latest tasks
            </p>

          </div>

          <Link
            to="/tasks"
            className={styles.viewAll}
          >
            View all →
          </Link>

        </div>



        {recentTasks.length === 0 ? (

          <div className={styles.emptyState}>

            <div className={styles.emptyIcon}>
              ✓
            </div>

            <h3>
              No tasks yet
            </h3>

            <p>
              Create your first task to get started.
            </p>

            <Link
              to="/tasks/new"
              className={styles.primaryButton}
            >
              <span className={styles.buttonIcon}>
                +
              </span>

              Create Task
            </Link>

          </div>

        ) : (


          <div className={styles.taskList}>

            {recentTasks.map((task) => (

              <Link
                key={task._id}
                to={`/tasks/${task._id}`}
                className={styles.task}
              >

                <div className={styles.taskLeft}>

                  <div className={styles.taskCheck}>
                    {task.status === "completed"
                      ? "✓"
                      : ""}
                  </div>

                  <div className={styles.taskInfo}>

                    <strong>
                      {task.title}
                    </strong>

                    <small>
                      {task.dueDate
                        ? `Due: ${new Date(
                            task.dueDate
                          ).toLocaleDateString()}`
                        : "No due date"}
                    </small>

                  </div>

                </div>


                <div className={styles.taskRight}>

                  <span
                    className={`${styles.priorityBadge} ${
                      getPriorityClass(
                        task.priority
                      )
                    }`}
                  >
                    {formatPriority(
                      task.priority
                    )}
                  </span>

                  <span
                    className={`${styles.status} ${
                      getStatusClass(
                        task.status
                      )
                    }`}
                  >
                    {formatStatus(
                      task.status
                    )}
                  </span>

                </div>

              </Link>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}