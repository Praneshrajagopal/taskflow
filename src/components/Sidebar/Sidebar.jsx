import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const getNavClass = ({ isActive }) =>
    isActive
      ? `${styles.navItem} ${styles.active}`
      : styles.navItem;

  return (
    <aside className={styles.sidebar}>

      <div className={styles.workspace}>
        <p className={styles.title}>WORKSPACE</p>

        <NavLink to="/dashboard" className={getNavClass}>
          <span className={styles.icon}>▦</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/tasks" className={getNavClass}>
          <span className={styles.icon}>✓</span>
          <span>Tasks</span>
        </NavLink>

        <NavLink to="/tasks/new" className={getNavClass}>
          <span className={styles.icon}>+</span>
          <span>Create Task</span>
        </NavLink>
      </div>

      <div className={styles.logoutContainer}>
        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          <span className={styles.logoutIcon}>↪</span>
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}