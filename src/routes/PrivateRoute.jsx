import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />};

export default PrivateRoute;