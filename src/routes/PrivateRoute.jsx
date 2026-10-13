import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const role = Number(user.role);

  // HR-only dashboard
  if (location.pathname === "/dashboard" && role !== 1) {
    return <Navigate to="/user-dashboard" replace />;
  }

  // Employee-only dashboard
  if (location.pathname === "/user-dashboard" && role === 1) {
    return <Navigate to="/dashboard" replace />;
  }

  return children || <Outlet />;
};

export default PrivateRoute;
