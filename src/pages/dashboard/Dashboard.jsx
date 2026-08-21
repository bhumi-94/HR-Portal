import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchUsers,
  updateUserStatus,
} from "../../features/employee/employeeSlice";
import { logout } from "../../features/auth/authSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { users, loading, error, updatingUserId } = useSelector(
    (state) => state.employee,
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // TOGGLE USER STATUS
  const handleToggleStatus = (user) => {
    const newStatus = Number(user.isActive) === 1 ? 0 : 1;

    dispatch(
      updateUserStatus({
        userId: user.id,
        isActive: newStatus,
      }),
    );
  };

  // LOGOUT

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

   
  // FILTER USERS
   

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        user.fullname?.toLowerCase().includes(searchText) ||
        user.username?.toLowerCase().includes(searchText) ||
        user.employee_id?.toLowerCase().includes(searchText) ||
        user.personal_email?.toLowerCase().includes(searchText) ||
        user.working_email?.toLowerCase().includes(searchText) ||
        user.department?.toLowerCase().includes(searchText) ||
        user.job_title?.toLowerCase().includes(searchText);

      const isActive = Number(user.isActive) === 1;

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && isActive) ||
        (filter === "disabled" && !isActive);

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  // STATISTICS

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => Number(user.isActive) === 1,
  ).length;

  const disabledUsers = users.filter(
    (user) => Number(user.isActive) === 0,
  ).length;

  // AVATAR

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#292524]">
      {/* SIDEBAR*/}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-[#eee7df] bg-white lg:flex lg:flex-col">
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
        </div>

        {/* NAVIGATION */}
        

        <div className="px-4">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#b0aaa4]">
            Workspace
          </p>

    

          <button className="flex w-full items-center gap-3 rounded-2xl bg-[#f6eafa] px-4 py-3 text-sm font-semibold text-[#8b5aa8]">
            <span className="text-lg">♙</span>
            Users
          </button>
        </div>

        {/* BOTTOM PROFILE */}

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

      {/* MAIN CONTENT */}

      <main className="lg:ml-64">
        <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          {/* MOBILE HEADER*/}

          <div className="mb-6 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8d5f5]">
                ✦
              </div>

              <div>
                <h1 className="font-bold">HR Portal</h1>
                <p className="text-xs text-[#a8a29e]">People management</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#a85c65] shadow-sm"
            >
              Logout
            </button>
          </div>

          {/*PAGE HEADER */}

          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-[#b08a68]">
                Hello EveryOne ✨
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-[#292524] sm:text-4xl">
                Your people
              </h2>

              <p className="mt-2 text-sm text-[#8f8983] sm:text-base">
                Manage your team and keep everything running smoothly.
              </p>
            </div>

            {/* SEARCH */}

            <div className="relative w-full md:w-80">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a8a29e]">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search people..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-[#ebe4dc] bg-white py-3 pl-11 pr-4 text-sm text-[#292524] outline-none transition placeholder:text-[#b8b2ac] focus:border-[#d8b9e7] focus:ring-4 focus:ring-[#f3e8f8]"
              />
            </div>
          </div>

          {/*ERROR*/}

          {error && (
            <div className="mb-6 rounded-2xl border border-[#f3c6cc] bg-[#fff1f2] px-5 py-4 text-sm font-medium text-[#b4535c]">
              {error}
            </div>
          )}

          {/* STAT CARDS*/}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* TOTAL */}

            <div className="rounded-[24px] border border-[#eee7df] bg-white p-5 shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#9c958f]">Total people</p>

                  <p className="mt-2 text-3xl font-bold text-[#292524]">
                    {totalUsers}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e8f8] text-lg">
                  ♡
                </div>
              </div>
            </div>

            {/* ACTIVE */}

            <div className="rounded-[24px] border border-[#eee7df] bg-white p-5 shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#9c958f]">Active</p>

                  <p className="mt-2 text-3xl font-bold text-[#292524]">
                    {activeUsers}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f5ed] text-lg">
                  ✦
                </div>
              </div>
            </div>

            {/* DISABLED */}

            <div className="rounded-[24px] border border-[#eee7df] bg-white p-5 shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#9c958f]">Disabled</p>

                  <p className="mt-2 text-3xl font-bold text-[#292524]">
                    {disabledUsers}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0ee] text-lg">
                  ♢
                </div>
              </div>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Personal Email</th>
                  <th>Working Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Gender</th>
                  <th>Department</th>
                  <th>Job Title</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="13" className="no-users">
                      No people found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      {/* Employee ID */}
                      <td>
                        <span className="employee-id">{user.employee_id}</span>
                      </td>
                      {/* Full Name */}
                      <td>
                        <div className="person-info">
                          {/* Profile Image */}
                          <div className="avatar">
                            {user.profile_image ? (
                              <>
                                {/* {console.log(
                                  "PROFILE IMAGE:",
                                  user.profile_image,
                                )} */}

                                <img
                                  src={`http://localhost:3000${user.profile_image}`}
                                  alt={user.fullname}
                                  className="profile-avatar-image"
                                />
                              </>
                            ) : (
                              <>
                                {user.fullname
                                  ?.split(" ")
                                  .map((name) => name.charAt(0))
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </>
                            )}
                          </div>

                          {/* User Name */}
                          <div>
                            <div className="person-name">{user.fullname}</div>
                            <div className="person-id">#{user.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td>{user.username}</td>

                      {/* Personal Email */}
                      <td>{user.personal_email}</td>

                      {/* Working Email */}
                      <td>{user.working_email || "—"}</td>

                      {/* Phone */}
                      <td>{user.phone || "—"}</td>

                      {/* Address */}
                      <td>
                        <span className="address-cell">
                          {user.address || "—"}
                        </span>
                      </td>

                      {/* Gender */}
                      <td>{user.gender || "—"}</td>

                      {/* Department */}
                      <td>{user.department || "—"}</td>

                      {/* Job Title */}
                      <td>{user.job_title || "—"}</td>

                      {/* Role */}
                      <td>
                        <span
                          className={
                            Number(user.role) === 1
                              ? "role-badge hr"
                              : "role-badge user"
                          }
                        >
                          {Number(user.role) === 1 ? "HR" : "User"}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={
                            Number(user.isActive) === 1
                              ? "status-badge active"
                              : "status-badge disabled"
                          }
                        >
                          ●{" "}
                          {Number(user.isActive) === 1 ? "Active" : "Disabled"}
                        </span>
                      </td>

                      {/* Action */}
                      <td>
                        <button
                          className={
                            Number(user.isActive) === 1
                              ? "disable-btn"
                              : "enable-btn"
                          }
                          onClick={() => handleToggleStatus(user)}
                          disabled={updatingUserId === user.id}
                        >
                          {updatingUserId === user.id
                            ? "Updating..."
                            : Number(user.isActive) === 1
                              ? "Disable"
                              : "Enable"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}

          <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-[#aaa39d] sm:flex-row">
            <p>HR Portal · People management</p>

            <p>Made with care ✦</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
