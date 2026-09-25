import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import PrivateRoute from "../routes/PrivateRoute";
import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/dashboard/Profile";
import UserHistoryDashboard from "../pages/dashboard/UserHistoryDashboard";
import EmployeeHistory from "../pages/dashboard/EmployeeHistory";
import EmployeeLeave from "../pages/dashboard/EmployeeLeave";
import UserLeaveHistory from "../pages/dashboard/UserLeaveHistory";
import HolidaysCalendar from "../pages/dashboard/HolidaysCalendar";
import Feedback from "../pages/dashboard/Feedback";

const AppRoutes = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid stored user:", error);

    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    user = null;
  }

  const role = Number(user?.role);

  const dashboardPath = role === 1 ? "/dashboard" : "/user-dashboard";

  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path="/"
        element={
          token && user ? (
            <Navigate to={dashboardPath} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={
          token && user ? <Navigate to={dashboardPath} replace /> : <Login />
        }
      />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* ================= PRIVATE ROUTES ================= */}

      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/user-dashboard" element={<UserHistoryDashboard />} />

        <Route path="/employee-history" element={<EmployeeHistory />} />

        <Route path="/employee-leave" element={<EmployeeLeave />} />

        <Route path="/user-leave-history" element={<UserLeaveHistory />} />

        <Route path="/holiday-calendar" element={<HolidaysCalendar />} />

        <Route path="/feedback" element={<Feedback />} />
      </Route>

      {/* ================= 404 ================= */}

      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
