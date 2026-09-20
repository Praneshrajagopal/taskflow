import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";
import Loading from "../../components/Loading/Loading";
import DeleteConfirmDialog from "../../components/DeleteConfirmDialog/DeleteConfirmDialog";

import styles from "./Tasks.module.css";

export default function Tasks() {

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  const [search, setSearch] = useState("");


  const [status, setStatus] = useState("");

  const [priority, setPriority] = useState("");


  const [sortField, setSortField] =
    useState("createdAt");

  const [sortOrder, setSortOrder] =
    useState("desc");


  const [currentPage, setCurrentPage] =
    useState(1);

  const tasksPerPage = 8;



  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);



  const loadTasks = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await api.get(
        "/tasks"
      );

      console.log(
        "TASKS RESPONSE:",
        response.data
      );

      const taskData =
        response.data?.data;

      setTasks(
        Array.isArray(taskData)
          ? taskData
          : []
      );

    } catch (err) {
      console.error(
        "TASKS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load tasks."
      );

      setTasks([]);

    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    loadTasks();
  }, []);



  const filteredTasks = useMemo(() => {
    let result = [...tasks];



    if (search.trim()) {
      const searchText =
        search.toLowerCase().trim();

      result = result.filter((task) =>
        task.title
          ?.toLowerCase()
          .includes(searchText)
      );
    }



    if (status) {
      result = result.filter(
        (task) =>
          task.status === status
      );
    }



    if (priority) {
      result = result.filter(
        (task) =>
          task.priority === priority
      );
    }



    result.sort((a, b) => {

      let valueA;
      let valueB;


      if (sortField === "title") {

        valueA =
          a.title?.toLowerCase() || "";

        valueB =
          b.title?.toLowerCase() || "";

      } else if (
        sortField === "priority"
      ) {

        const priorityOrder = {
          low: 1,
          medium: 2,
          high: 3,
        };

        valueA =
          priorityOrder[
            a.priority
          ] || 0;

        valueB =
          priorityOrder[
            b.priority
          ] || 0;

      } else if (
        sortField === "status"
      ) {

        valueA =
          a.status || "";

        valueB =
          b.status || "";

      } else if (
        sortField === "dueDate"
      ) {

        valueA = a.dueDate
          ? new Date(
              a.dueDate
            ).getTime()
          : Infinity;

        valueB = b.dueDate
          ? new Date(
              b.dueDate
            ).getTime()
          : Infinity;

      } else {

        valueA = a.createdAt
          ? new Date(
              a.createdAt
            ).getTime()
          : 0;

        valueB = b.createdAt
          ? new Date(
              b.createdAt
            ).getTime()
          : 0;
      }


      if (valueA < valueB) {
        return sortOrder === "asc"
          ? -1
          : 1;
      }

      if (valueA > valueB) {
        return sortOrder === "asc"
          ? 1
          : -1;
      }

      return 0;
    });


    return result;

  }, [
    tasks,
    search,
    status,
    priority,
    sortField,
    sortOrder,
  ]);



  const totalPages = Math.ceil(
    filteredTasks.length /
      tasksPerPage
  );


  const safeCurrentPage =
    totalPages > 0
      ? Math.min(
          currentPage,
          totalPages
        )
      : 1;


  const startIndex =
    (safeCurrentPage - 1) *
    tasksPerPage;


  const endIndex =
    startIndex + tasksPerPage;


  const currentTasks =
    filteredTasks.slice(
      startIndex,
      endIndex
    );



  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    status,
    priority,
    sortField,
    sortOrder,
  ]);



  const handleSort = (field) => {

    if (sortField === field) {

      setSortOrder(
        (previous) =>
          previous === "asc"
            ? "desc"
            : "asc"
      );

    } else {

      setSortField(field);

      setSortOrder("asc");
    }

  };



  const clearFilters = () => {

    setSearch("");

    setStatus("");

    setPriority("");

    setSortField("createdAt");

    setSortOrder("desc");

    setCurrentPage(1);
  };



  const handleDeleteClick = (
    taskId
  ) => {

    const task = tasks.find(
      (item) =>
        item._id === taskId
    );

    if (!task) return;

    setSelectedTask(task);

    setShowDeleteDialog(true);
  };



  const handleCancelDelete = () => {

    if (deleting) return;

    setShowDeleteDialog(false);

    setSelectedTask(null);
  };



  const handleConfirmDelete =
    async () => {

      if (!selectedTask) {
        return;
      }

      try {

        setDeleting(true);

        await api.delete(
          `/tasks/${selectedTask._id}`
        );



        setTasks(
          (previousTasks) =>
            previousTasks.filter(
              (task) =>
                task._id !==
                selectedTask._id
            )
        );



        setShowDeleteDialog(false);

        setSelectedTask(null);

      } catch (err) {

        console.error(
          "DELETE TASK ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to delete task."
        );

      } finally {

        setDeleting(false);
      }
    };



  const formatStatus = (
    taskStatus
  ) => {

    if (!taskStatus) {
      return "Pending";
    }

    return taskStatus
      .split("-")
      .map(
        (word) =>
          word
            .charAt(0)
            .toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };



  const formatPriority = (
    taskPriority
  ) => {

    if (!taskPriority) {
      return "Medium";
    }

    return (
      taskPriority
        .charAt(0)
        .toUpperCase() +
      taskPriority.slice(1)
    );
  };



  const getStatusClass = (
    taskStatus
  ) => {

    switch (taskStatus) {

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



  const getPriorityClass = (
    taskPriority
  ) => {

    switch (taskPriority) {

      case "high":
        return styles.high;

      case "low":
        return styles.low;

      default:
        return styles.medium;
    }
  };



  const formatDate = (
    date
  ) => {

    if (!date) {
      return "No due date";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };



  const getSortIcon = (
    field
  ) => {

    if (sortField !== field) {
      return "↕";
    }

    return sortOrder === "asc"
      ? "↑"
      : "↓";
  };



  if (loading) {
    return <Loading />;
  }



  return (
    <>
      <div className={styles.page}>


        <div className={styles.pageHeader}>

          <div>

            <h1>
              Tasks
            </h1>

            <p>
              Manage and track all your tasks.
            </p>

          </div>


          <Link
            to="/tasks/new"
            className={
              styles.primaryButton
            }
          >
            + New Task
          </Link>

        </div>



        {error && (
          <div
            className={
              styles.errorMessage
            }
          >
            {error}
          </div>
        )}



        <div
          className={
            styles.toolbar
          }
        >


          <div
            className={
              styles.searchBox
            }
          >

            <span
              className={
                styles.searchIcon
              }
            >
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>



          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className={
              styles.filterSelect
            }
          >

            <option value="">
              All Status
            </option>

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



          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }
            className={
              styles.filterSelect
            }
          >

            <option value="">
              All Priority
            </option>

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



          {(search ||
            status ||
            priority) && (

            <button
              type="button"
              className={
                styles.clearButton
              }
              onClick={
                clearFilters
              }
            >
              Clear
            </button>

          )}

        </div>



        <div
          className={
            styles.tableInfo
          }
        >

          <span>

            Showing{" "}

            <strong>
              {filteredTasks.length === 0
                ? 0
                : startIndex + 1}
            </strong>

            {" "}to{" "}

            <strong>
              {Math.min(
                endIndex,
                filteredTasks.length
              )}
            </strong>

            {" "}of{" "}

            <strong>
              {filteredTasks.length}
            </strong>

            {" "}tasks

          </span>

        </div>



        {currentTasks.length === 0 ? (

          <div
            className={
              styles.emptyState
            }
          >

            <div
              className={
                styles.emptyIcon
              }
            >
              ✓
            </div>

            <h2>
              No tasks found
            </h2>

            <p>
              Try changing your search
              or filters.
            </p>

            <button
              type="button"
              className={
                styles.clearEmptyButton
              }
              onClick={
                clearFilters
              }
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <div
            className={
              styles.tableWrapper
            }
          >

            <table
              className={
                styles.table
              }
            >

              <thead>

                <tr>


                  <th>

                    <button
                      type="button"
                      onClick={() =>
                        handleSort(
                          "title"
                        )
                      }
                      className={
                        styles.sortButton
                      }
                    >

                      <span>
                        Task
                      </span>

                      <span
                        className={
                          styles.sortIcon
                        }
                      >
                        {getSortIcon(
                          "title"
                        )}
                      </span>

                    </button>

                  </th>



                  <th>

                    <button
                      type="button"
                      onClick={() =>
                        handleSort(
                          "status"
                        )
                      }
                      className={
                        styles.sortButton
                      }
                    >

                      <span>
                        Status
                      </span>

                      <span
                        className={
                          styles.sortIcon
                        }
                      >
                        {getSortIcon(
                          "status"
                        )}
                      </span>

                    </button>

                  </th>



                  <th>

                    <button
                      type="button"
                      onClick={() =>
                        handleSort(
                          "priority"
                        )
                      }
                      className={
                        styles.sortButton
                      }
                    >

                      <span>
                        Priority
                      </span>

                      <span
                        className={
                          styles.sortIcon
                        }
                      >
                        {getSortIcon(
                          "priority"
                        )}
                      </span>

                    </button>

                  </th>



                  <th>

                    <button
                      type="button"
                      onClick={() =>
                        handleSort(
                          "dueDate"
                        )
                      }
                      className={
                        styles.sortButton
                      }
                    >

                      <span>
                        Due Date
                      </span>

                      <span
                        className={
                          styles.sortIcon
                        }
                      >
                        {getSortIcon(
                          "dueDate"
                        )}
                      </span>

                    </button>

                  </th>



                  <th>

                    <button
                      type="button"
                      onClick={() =>
                        handleSort(
                          "createdAt"
                        )
                      }
                      className={
                        styles.sortButton
                      }
                    >

                      <span>
                        Created
                      </span>

                      <span
                        className={
                          styles.sortIcon
                        }
                      >
                        {getSortIcon(
                          "createdAt"
                        )}
                      </span>

                    </button>

                  </th>



                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {currentTasks.map(
                  (task) => (

                    <tr
                      key={
                        task._id
                      }
                    >


                      <td>

                        <Link
                          to={`/tasks/${task._id}`}
                          className={
                            styles.taskTitle
                          }
                        >
                          {task.title}
                        </Link>

                        <span
                          className={
                            styles.description
                          }
                        >
                          {task.description
                            ? task.description
                                .length > 55
                              ? `${task.description.slice(
                                  0,
                                  55
                                )}...`
                              : task.description
                            : "No description"}
                        </span>

                      </td>



                      <td>

                        <span
                          className={`${styles.statusBadge} ${getStatusClass(
                            task.status
                          )}`}
                        >
                          {formatStatus(
                            task.status
                          )}
                        </span>

                      </td>



                      <td>

                        <span
                          className={`${styles.priorityBadge} ${getPriorityClass(
                            task.priority
                          )}`}
                        >
                          {formatPriority(
                            task.priority
                          )}
                        </span>

                      </td>



                      <td>

                        <span
                          className={
                            styles.date
                          }
                        >
                          {formatDate(
                            task.dueDate
                          )}
                        </span>

                      </td>



                      <td>

                        <span
                          className={
                            styles.date
                          }
                        >
                          {formatDate(
                            task.createdAt
                          )}
                        </span>

                      </td>



                      <td>

                        <div
                          className={
                            styles.actions
                          }
                        >

                          <Link
                            to={`/tasks/${task._id}`}
                            className={
                              styles.viewButton
                            }
                            title="View task"
                          >
                            View
                          </Link>


                          <Link
                            to={`/tasks/${task._id}/edit`}
                            className={
                              styles.editButton
                            }
                            title="Edit task"
                          >
                            Edit
                          </Link>


                          <button
                            type="button"
                            className={
                              styles.deleteButton
                            }
                            onClick={() =>
                              handleDeleteClick(
                                task._id
                              )
                            }
                            title="Delete task"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}



        {totalPages > 1 && (

          <div
            className={
              styles.pagination
            }
          >

            <button
              type="button"
              className={
                styles.pageButton
              }
              disabled={
                safeCurrentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (previous) =>
                    previous - 1
                )
              }
            >
              ← Previous
            </button>


            <div
              className={
                styles.pageNumbers
              }
            >

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map(
                (pageNumber) => (

                  <button
                    key={
                      pageNumber
                    }
                    type="button"
                    className={
                      safeCurrentPage ===
                      pageNumber
                        ? `${styles.pageNumber} ${styles.activePage}`
                        : styles.pageNumber
                    }
                    onClick={() =>
                      setCurrentPage(
                        pageNumber
                      )
                    }
                  >
                    {pageNumber}
                  </button>

                )
              )}

            </div>


            <button
              type="button"
              className={
                styles.pageButton
              }
              disabled={
                safeCurrentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (previous) =>
                    previous + 1
                )
              }
            >
              Next →
            </button>

          </div>

        )}

      </div>



      {showDeleteDialog &&
        selectedTask && (

          <DeleteConfirmDialog
            taskName={
              selectedTask.title
            }
            deleting={
              deleting
            }
            onCancel={
              handleCancelDelete
            }
            onConfirm={
              handleConfirmDelete
            }
          />

        )}

    </>
  );
}