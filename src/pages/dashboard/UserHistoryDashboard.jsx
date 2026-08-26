import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchAttendance,
  tapIn,
  tapOut,
} from "../../features/attendance/attendanceThunk";

import { logout } from "../../features/auth/authSlice";
import LeaveSection from "../../components/layout/LeaveSection";

const UserHistoryDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ATTENDANCE STATE
  const {
    attendance = [],
    loading,
    error,
    message,
  } = useSelector((state) => state.attendance || {});

  // USER

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getRoleName = (role) => {
    if (Number(role) === 1) {
      return "HR";
    }

    return "User";
  };

  // PROFILE IMAGE

  const SERVER_URL = "http://localhost:3000";

  const profilePic = user?.profile_image
    ? user.profile_image.startsWith("http")
      ? user.profile_image
      : `${SERVER_URL}${user.profile_image}`
    : null;
  // FETCH ATTENDANCE

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    dispatch(fetchAttendance());
  }, [dispatch, navigate]);

  // TAP IN

  const handleTapIn = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    const result = await dispatch(tapIn());

    if (tapIn.fulfilled.match(result)) {
      dispatch(fetchAttendance());
    }
  };

  // TAP OUT

  const handleTapOut = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    const result = await dispatch(tapOut());

    if (tapOut.fulfilled.match(result)) {
      dispatch(fetchAttendance());
    }
  };

  // LOGOUT

  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  // LAST 7 DAYS

  const lastSevenDays = Array.isArray(attendance) ? attendance.slice(0, 7) : [];

  // ================= TODAY'S ATTENDANCE =================

  const getLocalDate = (dateValue) => {
    if (!dateValue) return null;

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getLocalDate(new Date());

  const todayAttendance = Array.isArray(attendance)
    ? attendance.find((record) => {
        const recordDate = getLocalDate(record?.tap_in_date);

        return recordDate === today;
      })
    : null;
  // UI 

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#292524]">
      {/* ================= MAIN ================= */}
      <main className="">
        <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          {/* ================= HEADER ================= */}

          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-[#b08a68]">
              Your space ✨
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-[#292524] sm:text-4xl">
              My Dashboard
            </h2>

            <p className="mt-2 text-sm text-[#8f8983] sm:text-base">
              Track your attendance and working hours.
            </p>
          </div>

          {/* ================= TAP BUTTONS ================= */}

          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* TAP IN */}

            <button
              onClick={handleTapIn}
              disabled={loading}
              className="rounded-[24px] border border-[#eee7df] bg-white p-6 text-left shadow-[0_8px_30px_rgba(80,60,40,0.04)] transition hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#9c958f]">Start your workday</p>

                  <h3 className="mt-2 text-2xl font-bold text-[#292524]">
                    {loading ? "Please wait..." : "Tap In"}
                  </h3>

                  <p className="mt-1 text-sm text-[#a8a29e]">
                    Mark your arrival
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f5ed] text-2xl">
                  ↗
                </div>
              </div>
            </button>

            {/* TAP OUT */}

            <button
              onClick={handleTapOut}
              disabled={loading}
              className="rounded-[24px] border border-[#eee7df] bg-white p-6 text-left shadow-[0_8px_30px_rgba(80,60,40,0.04)] transition hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#9c958f]">Finish your workday</p>

                  <h3 className="mt-2 text-2xl font-bold text-[#292524]">
                    {loading ? "Please wait..." : "Tap Out"}
                  </h3>

                  <p className="mt-1 text-sm text-[#a8a29e]">
                    Mark your departure
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0ee] text-2xl">
                  ↙
                </div>
              </div>
            </button>
          </div>

          {/* ================= SUCCESS ================= */}

          {message && (
            <div className="mb-6 rounded-2xl border border-[#cce8d7] bg-[#eaf7ef] px-5 py-4 text-sm font-medium text-[#43865c]">
              {message}
            </div>
          )}

          {/* ================= ERROR ================= */}

          {error && (
            <div className="mb-6 rounded-2xl border border-[#f3c6cc] bg-[#fff1f2] px-5 py-4 text-sm font-medium text-[#b4535c]">
              {error}
            </div>
          )}

          {/* ================= HISTORY ================= */}

          <div className="overflow-hidden rounded-[28px] border border-[#eee7df] bg-white shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
            <div className="border-b border-[#eee7df] px-6 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e8f8] text-lg">
                  ♡
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#292524]">
                    Today's History
                  </h3>

                  <p className="mt-1 text-sm text-[#9c958f]">
                    {todayAttendance?.tap_in_time} -{" "}
                    {todayAttendance?.tap_out_time}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden mt-5 rounded-[28px] border border-[#eee7df] bg-white shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
            {/* HEADER */}

            <div className="border-b border-[#eee7df] px-6 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e8f8] text-lg">
                  ♡
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#292524]">
                    Attendance History
                  </h3>

                  <p className="mt-1 text-sm text-[#9c958f]">
                    Your previous 7 attendance records
                  </p>
                </div>
              </div>
            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-[#faf8f5]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#9c958f]">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#9c958f]">
                      Tap In
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#9c958f]">
                      Tap Out
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee7df]">
                  {/* LOADING */}

                  {loading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-10 text-center text-sm text-[#9c958f]"
                      >
                        Loading attendance...
                      </td>
                    </tr>
                  ) : lastSevenDays.length === 0 ? (
                    /* NO DATA */

                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-10 text-center text-sm text-[#9c958f]"
                      >
                        No attendance history found.
                      </td>
                    </tr>
                  ) : (
                    /* DATA */

                    lastSevenDays.map((record, index) => {
                      const rowKey =
                        record?.id ??
                        `${record?.tap_in_date || "date"}-${record?.tap_in_time || "time"}-${index}`;

                      return (
                        <tr
                          key={rowKey}
                          className="transition hover:bg-[#fcfaf8]"
                        >
                          {/* DATE */}

                          <td className="px-6 py-5">
                            <span className="font-semibold text-[#292524]">
                              {record?.tap_in_date || "—"}
                            </span>
                          </td>

                          {/* TAP IN */}

                          <td className="px-6 py-5">
                            <span className="rounded-xl bg-[#eaf7ef] px-3 py-2 text-sm font-medium text-[#43865c]">
                              {record?.tap_in_time || "—"}
                            </span>
                          </td>

                          {/* TAP OUT */}

                          <td className="px-6 py-5">
                            <span className="rounded-xl bg-[#fff1ef] px-3 py-2 text-sm font-medium text-[#b76b61]">
                              {record?.tap_out_time || "—"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <LeaveSection />

          {/* ================= FOOTER ================= */}

          <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-[#aaa39d] sm:flex-row">
            <p>HR Portal · People management</p>

            <p>Made with care ✦</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserHistoryDashboard;
