import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
} from "../../features/leave/hrLeaveThunk";

const EmployeeLeave = () => {
  const dispatch = useDispatch();

  const {
    requests = [],
    loading,
    actionLoading,
    error,
    actionError,
  } = useSelector((state) => state.hrLeave);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [typeFilter, setTypeFilter] = useState("All");

  // FETCH

  useEffect(() => {
    dispatch(fetchAllLeaveRequests());
  }, [dispatch]);

  // SEARCH + FILTER

  const filteredRequests = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return requests.filter((request) => {
      const employeeName = `${request.firstname || ""} ${
        request.lastname || ""
      }`.toLowerCase();

      const matchesSearch =
        !searchText ||
        employeeName.includes(searchText) ||
        request.employee_id?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      const matchesType =
        typeFilter === "All" || request.leave_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [requests, search, statusFilter, typeFilter]);

  // STATS
  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) => request.status === "Pending",
  ).length;

  const approvedRequests = requests.filter(
    (request) => request.status === "Approved",
  ).length;

  const rejectedRequests = requests.filter(
    (request) => request.status === "Rejected",
  ).length;

  // DATE

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // STATUS

  const getStatusStyle = (status) => {
    if (status === "Approved") {
      return "bg-[#e8f5ed] text-[#5d7f68]";
    }

    if (status === "Rejected") {
      return "bg-[#fff1f2] text-[#b4535c]";
    }

    return "bg-[#fff7e8] text-[#b08a68]";
  };

  const handleApprove = async (leaveId) => {
    try {
      console.log("HANDLE APPROVE LEAVE ID:", leaveId);

      if (!leaveId) {
        console.error("Leave ID is missing");
        return;
      }

      const result = await dispatch(approveLeaveRequest(leaveId)).unwrap();

      console.log("APPROVE SUCCESS:", result);

      // Refresh leave list
      dispatch(fetchAllLeaveRequests());
    } catch (error) {
      console.error("HANDLE APPROVE ERROR:", error);
    }
  };

  const handleReject = async (leaveId) => {
    try {
      console.log("HANDLE REJECT LEAVE ID:", leaveId);

      if (!leaveId) {
        console.error("Leave ID is missing");
        return;
      }

      const result = await dispatch(rejectLeaveRequest(leaveId)).unwrap();

      console.log("REJECT SUCCESS:", result);

      // Refresh leave list
      dispatch(fetchAllLeaveRequests());
    } catch (error) {
      console.error("HANDLE REJECT ERROR:", error);
    }
  };
  // LOADING

  if (loading && requests.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-[#292524]">
        <main>
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#eadcf1] border-t-[#8b5aa8]" />

              <p className="text-sm font-medium text-[#8f8983]">
                Loading employee leave requests...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#292524]">
      <main>
        <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          {/* HEADER*/}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-[#b08a68]">
                Leave Management ✨
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-[#292524] sm:text-4xl">
                Employee Leave
              </h2>

              <p className="mt-2 text-sm text-[#8f8983] sm:text-base">
                Review and manage employee leave requests.
              </p>
            </div>

            {/* SEARCH */}

            <div className="relative w-full lg:w-80">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a8a29e]">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-[#ebe4dc] bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#b8b2ac] focus:border-[#d8b9e7] focus:ring-4 focus:ring-[#f3e8f8]"
              />
            </div>
          </div>

          {/*error */}

          {(error || actionError) && (
            <div className="mb-6 rounded-2xl border border-[#f3c6cc] bg-[#fff1f2] px-5 py-4 text-sm font-medium text-[#b4535c]">
              {error || actionError}
            </div>
          )}

          {/*STATS */}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* TOTAL */}

            <div className="rounded-[24px] border border-[#eee7df] bg-white p-5 shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#9c958f]">Total Requests</p>

                  <p className="mt-2 text-3xl font-bold">{totalRequests}</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e8f8] text-lg text-[#8b5aa8]">
                  ◷
                </div>
              </div>
            </div>

            {/* PENDING */}

            <div className="rounded-[24px] border border-[#eee7df] bg-white p-5 shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#9c958f]">Pending</p>

                  <p className="mt-2 text-3xl font-bold">{pendingRequests}</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff7e8] text-lg">
                  !
                </div>
              </div>
            </div>

            {/* APPROVED */}

            <div className="rounded-[24px] border border-[#eee7df] bg-white p-5 shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#9c958f]">Approved</p>

                  <p className="mt-2 text-3xl font-bold">{approvedRequests}</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f5ed] text-lg">
                  ✓
                </div>
              </div>
            </div>

            {/* REJECTED */}

            <div className="rounded-[24px] border border-[#eee7df] bg-white p-5 shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#9c958f]">Rejected</p>

                  <p className="mt-2 text-3xl font-bold">{rejectedRequests}</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1f2] text-lg">
                  ×
                </div>
              </div>
            </div>
          </div>

          {/* FILTERS */}

          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-[#ebe4dc] bg-white px-4 py-3 text-sm outline-none focus:border-[#d8b9e7] focus:ring-4 focus:ring-[#f3e8f8]"
            >
              <option value="All">All Status</option>

              <option value="Pending">Pending</option>

              <option value="Approved">Approved</option>

              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-2xl border border-[#ebe4dc] bg-white px-4 py-3 text-sm outline-none focus:border-[#d8b9e7] focus:ring-4 focus:ring-[#f3e8f8]"
            >
              <option value="All">All Leave Types</option>

              <option value="Sick Leave">Sick Leave</option>

              <option value="Casual Leave">Casual Leave</option>

              <option value="WFH">WFH</option>
            </select>
          </div>

          {/* =========================================
              TABLE
          ========================================= */}

          <div className="overflow-hidden rounded-[24px] border border-[#eee7df] bg-white shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
            {/* HEADER */}

            <div className="flex flex-col gap-2 border-b border-[#eee7df] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold">Leave Requests</h3>

                <p className="mt-1 text-xs text-[#9c958f]">
                  Review employee requests and take action.
                </p>
              </div>

              {loading && (
                <div className="flex items-center gap-2 text-xs font-medium text-[#8b5aa8]">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#eadcf1] border-t-[#8b5aa8]" />
                  Updating...
                </div>
              )}
            </div>

            {/* =========================================
                MOBILE CARDS
            ========================================= */}

            <div className="block md:hidden">
              {filteredRequests.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f6eafa] text-2xl text-[#8b5aa8]">
                    ◷
                  </div>

                  <p className="mt-4 text-sm font-semibold">
                    No leave requests found
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#eee7df]">
                  {filteredRequests.map((request) => {
                    const employeeName = `${request.firstname || ""} ${
                      request.lastname || ""
                    }`.trim();

                    return (
                      <div key={request.id} className="p-5">
                        {/* EMPLOYEE */}

                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#e8d5f5] text-sm font-bold text-[#8b5aa8]">
                              {request.profile_image ? (
                                <img
                                  src={`http://localhost:3000${request.profile_image}`}
                                  alt={employeeName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                employeeName
                                  .split(" ")
                                  .map((name) => name.charAt(0))
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold">
                                {employeeName}
                              </p>

                              <p className="text-xs text-[#aaa39d]">
                                {request.employee_id}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-bold ${getStatusStyle(
                              request.status,
                            )}`}
                          >
                            {request.status}
                          </span>
                        </div>

                        {/* DETAILS */}

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-[#faf8f5] p-3">
                            <p className="text-[11px] text-[#aaa39d]">
                              Leave Type
                            </p>

                            <p className="mt-1 text-sm font-bold">
                              {request.leave_type}
                            </p>
                          </div>

                          <div className="rounded-xl bg-[#faf8f5] p-3">
                            <p className="text-[11px] text-[#aaa39d]">
                              Duration
                            </p>

                            <p className="mt-1 text-sm font-bold">
                              {request.duration}{" "}
                              {request.duration === 1 ? "day" : "days"}
                            </p>
                          </div>

                          <div className="col-span-2 rounded-xl bg-[#faf8f5] p-3">
                            <p className="text-[11px] text-[#aaa39d]">Dates</p>

                            <p className="mt-1 text-sm font-medium">
                              {formatDate(request.start_date)} →{" "}
                              {formatDate(request.end_date)}
                            </p>
                          </div>

                          <div className="col-span-2 rounded-xl bg-[#faf8f5] p-3">
                            <p className="text-[11px] text-[#aaa39d]">Reason</p>

                            <p className="mt-1 text-sm text-[#5f5954]">
                              {request.reason}
                            </p>
                          </div>
                        </div>

                        {/* ACTIONS */}

                        {request.status === "Pending" && (
                          <div className="mt-5 grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              disabled={actionLoading}
                              onClick={() => handleApprove(request.id)}
                              className="rounded-xl bg-[#e8f5ed] px-4 py-3 text-xs font-bold text-[#5d7f68] transition hover:bg-[#d8edde] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              ✓ Approve
                            </button>

                            <button
                              type="button"
                              disabled={actionLoading}
                              onClick={() => handleReject(request.id)}
                              className="rounded-xl bg-[#fff1f2] px-4 py-3 text-xs font-bold text-[#b4535c] transition hover:bg-[#ffe2e5] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              × Reject
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* =========================================
                DESKTOP TABLE
            ========================================= */}

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-[1100px] w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#eee7df] bg-[#fcfaf8]">
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#8f8983]">
                      Employee
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#8f8983]">
                      Leave Type
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#8f8983]">
                      Dates
                    </th>

                    <th className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-[#8f8983]">
                      Days
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#8f8983]">
                      Reason
                    </th>

                    <th className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-[#8f8983]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-[#8f8983]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f6eafa] text-2xl text-[#8b5aa8]">
                          ◷
                        </div>

                        <p className="mt-4 text-sm font-semibold">
                          No leave requests found
                        </p>

                        <p className="mt-1 text-xs text-[#a8a29e]">
                          Try changing your filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request) => {
                      const employeeName = `${request.firstname || ""} ${
                        request.lastname || ""
                      }`.trim();

                      return (
                        <tr
                          key={request.id}
                          className="border-b border-[#f0ebe6] transition hover:bg-[#fdfafc]"
                        >
                          {/* EMPLOYEE */}

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#e8d5f5] text-xs font-bold text-[#8b5aa8]">
                                {request.profile_image ? (
                                  <img
                                    src={`http://localhost:3000${request.profile_image}`}
                                    alt={employeeName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  employeeName
                                    .split(" ")
                                    .map((name) => name.charAt(0))
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()
                                )}
                              </div>

                              <div>
                                <p className="text-sm font-bold">
                                  {employeeName}
                                </p>

                                <p className="mt-0.5 text-xs text-[#aaa39d]">
                                  {request.employee_id}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* TYPE */}

                          <td className="px-5 py-5">
                            <span className="rounded-xl bg-[#f6eafa] px-3 py-1.5 text-xs font-bold text-[#8b5aa8]">
                              {request.leave_type}
                            </span>
                          </td>

                          {/* DATES */}

                          <td className="px-5 py-5">
                            <p className="text-sm text-[#5f5954]">
                              {formatDate(request.start_date)}
                            </p>

                            <p className="mt-1 text-xs text-[#aaa39d]">
                              → {formatDate(request.end_date)}
                            </p>
                          </td>

                          {/* DAYS */}

                          <td className="px-5 py-5 text-center">
                            <span className="rounded-xl bg-[#faf8f5] px-3 py-1.5 text-xs font-bold">
                              {request.duration}
                            </span>
                          </td>

                          {/* REASON */}

                          <td className="max-w-[220px] px-5 py-5">
                            <p
                              className="truncate text-sm text-[#5f5954]"
                              title={request.reason}
                            >
                              {request.reason}
                            </p>
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-5 text-center">
                            <span
                              className={`rounded-xl px-3 py-1.5 text-[11px] font-bold ${getStatusStyle(
                                request.status,
                              )}`}
                            >
                              {request.status}
                            </span>
                          </td>

                          {/* ACTION */}

                          <td className="px-5 py-5">
                            {request.status === "Pending" ? (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  disabled={actionLoading}
                                  onClick={() => handleApprove(request.id)}
                                  className="rounded-xl bg-[#e8f5ed] px-3 py-2 text-xs font-bold text-[#5d7f68] transition hover:bg-[#d8edde] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  ✓
                                </button>

                                <button
                                  type="button"
                                  disabled={actionLoading}
                                  onClick={() => handleReject(request.id)}
                                  className="rounded-xl bg-[#fff1f2] px-3 py-2 text-xs font-bold text-[#b4535c] transition hover:bg-[#ffe2e5] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-[#aaa39d]">
                                Completed
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}

            <div className="border-t border-[#eee7df] bg-[#fcfaf8] px-6 py-4">
              <div className="flex flex-col gap-2 text-xs text-[#aaa39d] sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing {filteredRequests.length} of {totalRequests} requests
                </p>

                <p>
                  🟡 Pending&nbsp;&nbsp; 🟢 Approved&nbsp;&nbsp; 🔴 Rejected
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}

          <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-[#aaa39d] sm:flex-row">
            <p>HR Portal · People management</p>

            <p>Leave Management ✦</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeLeave;
