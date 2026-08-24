import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchEmployeeHistory } from "../../features/attendance/attendanceThunk";
import { logout } from "../../features/auth/authSlice";

const EmployeeHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // REDUX STATE

  const {
    history = [],
    historyLoading,
    historyError,
  } = useSelector((state) => state.attendance);

  // LOCAL STATE
  const [search, setSearch] = useState("");

  // FETCH EMPLOYEE HISTORY

  useEffect(() => {
    dispatch(fetchEmployeeHistory());
  }, [dispatch]);

  // LOGOUT
  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  // GET YYYY-MM-DD

  const formatDateKey = (date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // GET LAST 7 DAYS

  const lastSevenDays = useMemo(() => {
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);
      dates.push({
        key: formatDateKey(date),
        date,
      });
    }

    return dates;
  }, []);

  // FORMAT DATE
  // Example: 21 Aug

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  // FORMAT TIME
  // Example: 10:17

  const formatTime = (time) => {
    if (!time) {
      return "—";
    }

    const parts = String(time).split(":");
    if (parts.length < 2) {
      return time;
    }
    return `${parts[0]}:${parts[1]}`;
  };

  // FORMAT TAP IN / TAP OUT

  const formatAttendanceTime = (record) => {
    if (!record) {
      return "—";
    }
    const tapIn = formatTime(record.tap_in_time);
    const tapOut = formatTime(record.tap_out_time);
    if (!record.tap_in_time && !record.tap_out_time) {
      return "—";
    }
    if (!record.tap_out_time) {
      return <span className="font-medium text-[#8b5aa8]">{tapIn} → —</span>;
    }
    return (
      <span className="whitespace-nowrap">
        <span className="font-medium text-[#5d7f68]">{tapIn}</span>

        <span className="mx-1 text-[#b8b0a9]">→</span>

        <span className="font-medium text-[#a85c65]">{tapOut}</span>
      </span>
    );
  };

  // GROUP HISTORY BY EMPLOYEE

  const employees = useMemo(() => {
    const employeeMap = {};

    history.forEach((record) => {
      const employeeId = record.employee_id;

      if (!employeeId) {
        return;
      }

      // Create employee even if attendance is NULL
      if (!employeeMap[employeeId]) {
        employeeMap[employeeId] = {
          user_id: record.user_id,
          employee_id: employeeId,
          fullname: record.fullname || "Unknown Employee",
          profile_image: record.profile_image || null,
          records: {},
        };
      }

      // Add attendance record only when it exists
      if (record.tap_in_date) {
        employeeMap[employeeId].records[record.tap_in_date] = record;
      }
    });

    return Object.values(employeeMap);
  }, [history]);

  // SEARCH EMPLOYEES

  const filteredEmployees = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return employees;
    }

    return employees.filter((employee) => {
      return (
        employee.employee_id?.toLowerCase().includes(searchText) ||
        employee.fullname?.toLowerCase().includes(searchText)
      );
    });
  }, [employees, search]);

  // STATISTICS

  // Total employees
  const totalEmployees = employees.length;

  // Number of employees who have at least one attendance record
  const employeesWithAttendance = employees.filter((employee) => {
    return Object.keys(employee.records).length > 0;
  }).length;

  // Today's date
  const todayKey = lastSevenDays[0]?.key;

  // Employees who tapped in today
  const todayPresent = employees.filter((employee) => {
    return Boolean(employee.records[todayKey]?.tap_in_time);
  }).length;

  // LOADING

  if (historyLoading && history.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-[#292524]">
        {/* SIDEBAR */}
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-[#eee7df] bg-white lg:flex lg:flex-col">
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

          <div className="px-4">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#b0aaa4]">
              Workspace
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#77716b] transition hover:bg-[#faf5fc]"
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
          </div>

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

        {/* LOADING CONTENT */}
        <main className="lg:ml-64">
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#eadcf1] border-t-[#8b5aa8]" />

              <p className="text-sm font-medium text-[#8f8983]">
                Loading employee history...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#292524]">
      {/* =====================================================
          SIDEBAR
      ====================================================== */}
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

          {/* USERS */}
          <button
            onClick={() => navigate("/dashboard")}
            className=" flex w-full items-center gap-3 rounded-2xl bg-[#f6eafa] px-4 py-3 text-sm font-semibold text-[#8b5aa8]"
          >
            <span className="text-lg">♙</span>
            Users
          </button>

          {/* EMPLOYEE HISTORY */}
          <button
            onClick={() => navigate("/employee-history")}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-[#f6eafa] px-4 py-3 text-sm font-semibold text-[#8b5aa8]"
          >
            <span className="text-lg">◷</span>
            Employee History
          </button>
        </div>

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

      {/* MAIN CONTENT */}
      <main className="lg:ml-64">
        <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          {/* MOBILE HEADER */}
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

          {/* PAGE HEADER */}
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-[#b08a68]">
                Attendance ✨
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-[#292524] sm:text-4xl">
                Employee History
              </h2>

              <p className="mt-2 text-sm text-[#8f8983] sm:text-base">
                View employee tap-in and tap-out history for the last 7 days.
              </p>
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-80">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a8a29e]">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-[#ebe4dc] bg-white py-3 pl-11 pr-4 text-sm text-[#292524] outline-none transition placeholder:text-[#b8b2ac] focus:border-[#d8b9e7] focus:ring-4 focus:ring-[#f3e8f8]"
              />
            </div>
          </div>

          {/* ERROR */}
          {historyError && (
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#f3c6cc] bg-[#fff1f2] px-5 py-4 text-sm font-medium text-[#b4535c]">
              <span>{historyError}</span>

              <button
                onClick={() => dispatch(fetchEmployeeHistory())}
                className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-[#a85c65] shadow-sm"
              >
                Retry
              </button>
            </div>
          )}

          {/* =================================================
              STAT CARDS
          ================================================== */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* TOTAL EMPLOYEES */}
            <div className="rounded-[24px] border border-[#eee7df] bg-white p-5 shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#9c958f]">Total employees</p>

                  <p className="mt-2 text-3xl font-bold text-[#292524]">
                    {totalEmployees}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e8f8] text-lg">
                  ♡
                </div>
              </div>
            </div>

            {/* TODAY PRESENT */}
            <div className="rounded-[24px] border border-[#eee7df] bg-white p-5 shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#9c958f]">Tapped in today</p>

                  <p className="mt-2 text-3xl font-bold text-[#292524]">
                    {todayPresent}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f5ed] text-lg">
                  ✦
                </div>
              </div>
            </div>

            {/* WITH ATTENDANCE */}
            <div className="rounded-[24px] border border-[#eee7df] bg-white p-5 shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#9c958f]">History available</p>

                  <p className="mt-2 text-3xl font-bold text-[#292524]">
                    {employeesWithAttendance}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0ee] text-lg">
                  ◷
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              HISTORY TABLE
          ================================================== */}
          <div className="overflow-hidden rounded-[24px] border border-[#eee7df] bg-white shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
            {/* TABLE HEADER */}
            <div className="flex flex-col gap-2 border-b border-[#eee7df] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#292524]">
                  Employee History
                </h3>

                <p className="mt-1 text-xs text-[#9c958f]">
                  Tap-in → Tap-out · Last 7 days
                </p>
              </div>

              {historyLoading && (
                <div className="flex items-center gap-2 text-xs font-medium text-[#8b5aa8]">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#eadcf1] border-t-[#8b5aa8]" />
                  Updating...
                </div>
              )}
            </div>
            {/* HORIZONTAL SCROLL */}
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full border-collapse">
                {/* TABLE HEAD */}
                <thead>
                  <tr className="border-b border-[#eee7df] bg-[#fcfaf8]">
                    {/* EMPLOYEE ID */}
                    <th className="sticky left-0 z-20 min-w-[130px] bg-[#fcfaf8] px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#8f8983]">
                      Employee ID
                    </th>
                    {/* EMPLOYEE NAME */}
                    <th className="sticky left-[130px] z-20 min-w-[220px] bg-[#fcfaf8] px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#8f8983]">
                      Employee Name
                    </th>
                    {/* LAST 7 DAYS */}
                    {lastSevenDays.map((day, index) => (
                      <th
                        key={day.key}
                        className="min-w-[145px] px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-[#8f8983]"
                      >
                        <div>{formatDisplayDate(day.date)}</div>
                        <div className="mt-1 text-[9px] font-medium normal-case tracking-normal text-[#b5aea8]">
                          {index === 0
                            ? "Today"
                            : index === 1
                              ? "Yesterday"
                              : `${index} days ago`}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                {/* TABLE BODY */}
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f6eafa] text-2xl text-[#8b5aa8]">
                          ◷
                        </div>
                        <p className="mt-4 text-sm font-semibold text-[#5f5954]">
                          No employee history found
                        </p>
                        <p className="mt-1 text-xs text-[#a8a29e]">
                          {search
                            ? "Try searching with another employee name or ID."
                            : "There is no attendance history available."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <tr
                        key={employee.employee_id}
                        className="border-b border-[#f0ebe6] transition hover:bg-[#fdfafc]"
                      >
                        {/* EMPLOYEE ID */}
                        <td className="sticky left-0 z-10 bg-white px-5 py-5">
                          <span className="rounded-xl bg-[#f6eafa] px-3 py-1.5 text-xs font-bold text-[#8b5aa8]">
                            {employee.employee_id}
                          </span>
                        </td>
                        {/* EMPLOYEE NAME */}
                        <td className="sticky left-[130px] z-10 bg-white px-5 py-5">
                          <div className="flex items-center gap-3">
                            {/* AVATAR */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#e8d5f5] text-sm font-bold text-[#8b5aa8]">
                              {employee.profile_image ? (
                                <img
                                  src={`http://localhost:3000${employee.profile_image}`}
                                  alt={employee.fullname}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                employee.fullname
                                  ?.split(" ")
                                  .map((name) => name.charAt(0))
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()
                              )}
                            </div>
                            {/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e8d5f5] text-sm font-bold text-[#8b5aa8]">
                              {employee.fullname
                                ?.split(" ")
                                .map((name) => name.charAt(0))
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div> */}
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[#292524]">
                                {employee.fullname}
                              </p>
                              <p className="mt-0.5 text-xs text-[#aaa39d]">
                                Employee
                              </p>
                            </div>
                          </div>
                        </td>
                        {/* EACH DAY */}
                        {lastSevenDays.map((day) => {
                          const record = employee.records[day.key];
                          return (
                            <td key={day.key} className="px-5 py-5 text-center">
                              {record ? (
                                <div className="inline-flex rounded-xl bg-[#faf8f5] px-3 py-2">
                                  {formatAttendanceTime(record)}
                                </div>
                              ) : (
                                <span className="text-sm text-[#c2bbb5]">
                                  —
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* TABLE FOOTER */}
            <div className="border-t border-[#eee7df] bg-[#fcfaf8] px-6 py-4">
              <div className="flex flex-col gap-2 text-xs text-[#aaa39d] sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing {filteredEmployees.length} of {totalEmployees}{" "}
                  employees
                </p>
                <p>🟢 Tap In&nbsp;&nbsp; → &nbsp;&nbsp;🔴 Tap Out</p>
              </div>
            </div>
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

export default EmployeeHistory;
