import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Go to login page
    navigate("/login", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="
        mt-5
        rounded-lg
        bg-red-500
        px-4
        py-2
        text-sm
        font-medium
        text-white
        transition
        hover:bg-red-600
        active:scale-95
      "
    >
      Logout
    </button>
  );
};

export default LogoutButton;