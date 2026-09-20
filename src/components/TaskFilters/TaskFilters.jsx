import styles from "./TaskFilters.module.css";

export default function TaskFilters({
  filters,
  onChange,
  onReset,
}) {
  return (
    <section className={styles.wrapper}>

      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>⌕</span>

        <input
          className={styles.search}
          value={filters.search}
          onChange={(e) =>
            onChange("search", e.target.value)
          }
          placeholder="Search by title..."
        />
      </div>

      <div className={styles.filterGroup}>
        <label>Status</label>

        <select
          value={filters.status}
          onChange={(e) =>
            onChange("status", e.target.value)
          }
        >
          <option value="All">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label>Priority</label>

        <select
          value={filters.priority}
          onChange={(e) =>
            onChange("priority", e.target.value)
          }
        >
          <option value="All">All priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label>Sort by</label>

        <select
          value={filters.sort}
          onChange={(e) =>
            onChange("sort", e.target.value)
          }
        >
          <option value="dueDate">Due date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
          <option value="createdAt">Newest</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label>Order</label>

        <select
          value={filters.order}
          onChange={(e) =>
            onChange("order", e.target.value)
          }
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <button
        type="button"
        className={styles.resetButton}
        onClick={onReset}
      >
        Reset
      </button>

    </section>
  );
}