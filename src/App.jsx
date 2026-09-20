import { AuthProvider, useAuth } from "./context/AuthContext";

import AppRoutes from "./routes/AppRoutes";

import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Loading from "./components/Loading/Loading";

import styles from "./App.module.css";

function Layout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <AppRoutes />;
  }

  return (
    <div className={styles.appLayout}>

      <Navbar />

      <Sidebar />

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <AppRoutes />
        </div>
      </main>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}