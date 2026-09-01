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

const AppRoutes = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route
        path="/"
        element={
          token ? (
            <Navigate
              to={
                Number(JSON.parse(localStorage.getItem("user"))?.role) === 1
                  ? "/dashboard"
                  : "/user-dashboard"
              }
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={
          token ? (
            <Navigate
              to={
                Number(JSON.parse(localStorage.getItem("user"))?.role) === 1
                  ? "/dashboard"
                  : "/user-dashboard"
              }
              replace
            />
          ) : (
            <Login />
          )
        }
      />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* ================= PRIVATE LAYOUT ================= */}

      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* These are CHILDREN of MainLayout */}

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/user-dashboard" element={<UserHistoryDashboard />} />

        <Route path="/employee-history" element={<EmployeeHistory />} />

        <Route path="/employee-leave" element={<EmployeeLeave />} />
        {/* <Route path="/hr/employee-leave" element={<EmployeeLeave />} /> */}
        <Route path="/user-leave-history" element={<UserLeaveHistory/>}/>
        <Route path="/holiday-calendar" element={<HolidaysCalendar/>}/>

      </Route>

      {/* ================= 404 ================= */}

      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;
