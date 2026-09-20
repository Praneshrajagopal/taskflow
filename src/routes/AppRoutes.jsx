import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Loading from "../components/Loading/Loading";

import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";

import Dashboard from "../pages/Dashboard/Dashboard";
import Tasks from "../pages/Tasks/Tasks";
import TaskDetails from "../pages/TaskDetails/TaskDetails";
import CreateTask from "../pages/CreateTask/CreateTask";
import EditTask from "../pages/EditTask/EditTask";


function ProtectedRoute({ children }) {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}


function PublicRoute({ children }) {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}


function AppRoutes() {
  return (
    <Routes>


      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />


      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />


      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />


      <Route
        path="/tasks/new"
        element={
          <ProtectedRoute>
            <CreateTask />
          </ProtectedRoute>
        }
      />


      <Route
        path="/tasks/:id"
        element={
          <ProtectedRoute>
            <TaskDetails />
          </ProtectedRoute>
        }
      />


      <Route
        path="/tasks/:id/edit"
        element={
          <ProtectedRoute>
            <EditTask />
          </ProtectedRoute>
        }
      />


      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}

export default AppRoutes;