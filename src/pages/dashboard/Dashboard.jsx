import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchUsers,
  updateUserStatus,
} from "../../features/employee/employeeSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { users, loading, error, updatingUserId } = useSelector(
    (state) => state.employee,
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleToggleStatus = (user) => {
    const newStatus = Number(user.isActive) === 1 ? 0 : 1;

    dispatch(
      updateUserStatus({
        userId: user.id,
        isActive: newStatus,
      }),
    );
  };

  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

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

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => Number(user.isActive) === 1,
  ).length;

  const disabledUsers = users.filter(
    (user) => Number(user.isActive) === 0,
  ).length;

  return (
  
    <div className="min-h-screen bg-[#faf8f5] text-[#292524]">
    
      <main className="">
      
        <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          
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
          {error && (
            <div className="mb-6 rounded-2xl border border-[#f3c6cc] bg-[#fff1f2] px-5 py-4 text-sm font-medium text-[#b4535c]">
              {error}
            </div>
          )}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                      <td>
                        <span className="employee-id">{user.employee_id}</span>
                      </td>

                      <td>
                        <div className="person-info">
                          <div className="avatar">
                            {user.profile_image ? (
                              <>
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

                          <div>
                            <div className="person-name">{user.fullname}</div>
                            <div className="person-id">#{user.id}</div>
                          </div>
                        </div>
                      </td>

                      <td>{user.username}</td>

                      <td>{user.personal_email}</td>

                      <td>{user.working_email || "—"}</td>

                      <td>{user.phone || "—"}</td>

                      <td>
                        <span className="address-cell">
                          {user.address || "—"}
                        </span>
                      </td>

                      <td>{user.gender || "—"}</td>

                      <td>{user.department || "—"}</td>

                      <td>{user.job_title || "—"}</td>

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
