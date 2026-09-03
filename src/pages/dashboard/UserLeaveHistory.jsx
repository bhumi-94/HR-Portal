import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLeaveHistory } from "../../features/leave/leaveThunk";

const UserLeaveHistory = () => {
  const dispatch = useDispatch();

  const { history = [], loading, error } = useSelector(
    (state) => state.leave
  );

  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Leave Types");

  useEffect(() => {
    dispatch(getLeaveHistory());
  }, [dispatch]);

  const filteredHistory = useMemo(() => {
    return history.filter((leave) => {
      const statusMatch =
        statusFilter === "All Status" ||
        leave.status?.toLowerCase() === statusFilter.toLowerCase();

      const typeMatch =
        typeFilter === "All Leave Types" ||
        leave.leave_type === typeFilter;

      return statusMatch && typeMatch;
    });
  }, [history, statusFilter, typeFilter]);

  const totalLeaves = history.length;

  const approvedLeaves = history.filter(
    (leave) => leave.status?.toLowerCase() === "approved"
  ).length;

  const pendingLeaves = history.filter(
    (leave) => leave.status?.toLowerCase() === "pending"
  ).length;

  const rejectedLeaves = history.filter(
    (leave) => leave.status?.toLowerCase() === "rejected"
  ).length;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-50 text-green-700";

      case "pending":
        return "bg-amber-50 text-amber-700";

      case "rejected":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getLeaveTypeClass = () => {
    return "bg-purple-50 text-purple-700";
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] px-6 py-8 md:px-10 lg:px-12">

      {/* HEADER */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-[#a27a58]">
          Leave Management ✨
        </p>

        <h1 className="text-3xl font-bold text-[#171717] md:text-4xl">
          Leave History
        </h1>

        <p className="mt-2 text-sm text-gray-500 md:text-base">
          View and track your leave requests.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL */}
        <div className="rounded-3xl border border-[#eee7df] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Requests
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#171717]">
                {totalLeaves}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              ◷
            </div>
          </div>
        </div>

        {/* PENDING */}
        <div className="rounded-3xl border border-[#eee7df] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Pending
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#171717]">
                {pendingLeaves}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              !
            </div>
          </div>
        </div>

        {/* APPROVED */}
        <div className="rounded-3xl border border-[#eee7df] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Approved
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#171717]">
                {approvedLeaves}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700">
              ✓
            </div>
          </div>
        </div>

        {/* REJECTED */}
        <div className="rounded-3xl border border-[#eee7df] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Rejected
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#171717]">
                {rejectedLeaves}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              ×
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full rounded-2xl border border-[#e9e1d9] bg-white px-5 py-3 text-sm outline-none transition focus:border-purple-300 sm:w-auto"
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full rounded-2xl border border-[#e9e1d9] bg-white px-5 py-3 text-sm outline-none transition focus:border-purple-300 sm:w-auto"
        >
          <option>All Leave Types</option>
          <option>Sick Leave</option>
          <option>Casual Leave</option>
          <option>WFH</option>
        </select>
      </div>

      {/* TABLE CARD */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-[#eee7df] bg-white shadow-sm">

        {/* TITLE */}
        <div className="border-b border-[#eee7df] px-6 py-6">
          <h2 className="text-xl font-bold text-[#171717]">
            My Leave Requests
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View your complete leave request history.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="px-6 py-12 text-center text-gray-500">
            Loading leave history...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="px-6 py-12 text-center text-red-500">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && filteredHistory.length === 0 && (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl text-purple-500">
              📋
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              No leave requests found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Your leave requests will appear here.
            </p>
          </div>
        )}

        {/* DESKTOP TABLE */}
        {!loading && filteredHistory.length > 0 && (
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[850px]">

              <thead>
                <tr className="border-b border-[#eee7df] bg-[#fdfcfb]">
                  <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Leave Type
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Dates
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Days
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Reason
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredHistory.map((leave) => (
                  <tr
                    key={leave.id}
                    className="border-b border-[#f0ebe6] last:border-b-0"
                  >

                    {/* TYPE */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold ${getLeaveTypeClass()}`}
                      >
                        {leave.leave_type}
                      </span>
                    </td>

                    {/* DATES */}
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-gray-800">
                        {formatDate(leave.start_date)}
                      </div>

                      <div className="mt-1 text-xs text-gray-400">
                        → {formatDate(leave.end_date)}
                      </div>
                    </td>

                    {/* DAYS */}
                    <td className="px-6 py-5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf8f5] text-sm font-semibold text-gray-800">
                        {leave.duration}
                      </span>
                    </td>

                    {/* REASON */}
                    <td className="max-w-[250px] px-6 py-5">
                      <p className="truncate text-sm text-gray-600">
                        {leave.reason || "-"}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold ${getStatusClass(
                          leave.status
                        )}`}
                      >
                        {leave.status}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

        {/* MOBILE CARDS */}
        {!loading && filteredHistory.length > 0 && (
          <div className="space-y-4 p-4 md:hidden">

            {filteredHistory.map((leave) => (
              <div
                key={leave.id}
                className="rounded-2xl border border-[#eee7df] p-5"
              >

                <div className="flex items-start justify-between gap-3">

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getLeaveTypeClass()}`}
                  >
                    {leave.leave_type}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                      leave.status
                    )}`}
                  >
                    {leave.status}
                  </span>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">

                  <div>
                    <p className="text-xs text-gray-400">
                      Start Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {formatDate(leave.start_date)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      End Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {formatDate(leave.end_date)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Days
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {leave.duration}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Reason
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-gray-800">
                      {leave.reason || "-"}
                    </p>
                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default UserLeaveHistory;
