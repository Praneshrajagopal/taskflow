import styles from "./Navbar.module.css";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>

        <div className={styles.logo}>
          Task<span>Flow</span>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userName}>
            {user?.name || "User"}
          </div>

          <div className={styles.userEmail}>
            {user?.email || "user@example.com"}
          </div>
        </div>

      </div>
    </nav>
  );
}