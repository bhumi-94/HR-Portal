import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const openSidebar = () => {
      setIsOpen(true);
    };

    window.addEventListener("openSidebar", openSidebar);

    return () => {
      window.removeEventListener("openSidebar", openSidebar);
    };
  }, []);

  return (
    <aside
      className={`
   fixed
    top-0
    left-0
    z-[60]
    h-screen
    w-64
    bg-white
    border-r
    border-gray-100
     transition-transform
    duration-300

    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
`}
    >
      {/* LOGO */}
      <div className="flex items-center gap-3 px-7 py-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8d5f5] text-xl">
          ✦
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-tight text-[#292524]">
            HR Portal
          </h1>
          <p className="text-xs text-[#a8a29e]">People management</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-5 right-4 text-gray-500"
        >
          ✕
        </button>
      </div>

      {/* WORKSPACE */}
      {user?.role === 1 ? (
        // ================= ADMIN SIDEBAR =================
        <div className="px-4">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#b0aaa4]">
            Workspace
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex w-full items-center gap-3 rounded-2xl bg-[#f6eafa] px-4 py-3 text-sm font-semibold text-[#8b5aa8]"
          >
            <span className="text-lg">♙</span>
            Users
          </button>

          <button
            onClick={() => navigate("/employee-history")}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-[#f6eafa] px-4 py-3 text-sm font-semibold text-[#8b5aa8]"
          >
            <span className="text-lg">◷</span>
            Employee History
          </button>

          <button
            onClick={() => navigate("/employee-leave")}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-[#f6eafa] px-4 py-3 text-sm font-semibold text-[#8b5aa8]"
          >
            <span className="text-lg">▣</span>
            Employee Leaves
          </button>

          <button
            onClick={() => navigate("/holiday-calendar")}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-[#f6eafa] px-4 py-3 text-sm font-semibold text-[#8b5aa8]"
          >
            <span className="text-lg">!</span>
            Holidays
          </button>
          
        </div>
      ) : (
        // EMPLOYEE SIDEBAR
        <div className="px-4">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#b0aaa4]">
            Workspace
          </p>

          <button
            onClick={() => navigate("/user-dashboard")}
            className="flex w-full items-center gap-3 rounded-2xl bg-[#f6eafa] px-4 py-3 text-sm font-semibold text-[#8b5aa8]"
          >
            <span className="text-lg">♙</span>
            My Dashboard
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-[#f6eafa] px-4 py-3 text-sm font-semibold text-[#8b5aa8]"
          >
            <span className="text-lg">◈</span>
            My Profile
          </button>

          <button
            onClick={() => navigate("/user-leave-history")}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-[#f6eafa] px-4 py-3 text-sm font-semibold text-[#8b5aa8]"
          >
            <span className="text-lg">#</span>
            Leave History
          </button>

          <button
            onClick={() => navigate("/holiday-calendar")}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-[#f6eafa] px-4 py-3 text-sm font-semibold text-[#8b5aa8]"
          >
            <span className="text-lg">!</span>
            Holidays
          </button>
        </div>
      )}

      {/* LOGOUT */}
      <div className="mt-auto p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#a85c65] transition hover:bg-[#fff1f2]"
        >
          <span>↪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
