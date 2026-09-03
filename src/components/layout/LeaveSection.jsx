import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import LeaveRequestModal from "./LeaveRequestModal";

import {
  fetchLeaveSummary,
  fetchMyLeaveRequests,
} from "../../features/leave/leaveThunk";

const LeaveSection = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { summary, requests, loading, requestSuccess, requestError } =
    useSelector((state) => state.leave);
  useEffect(() => {
    dispatch(fetchLeaveSummary());
    dispatch(fetchMyLeaveRequests());
  }, [dispatch]);

  // REFRESH AFTER REQUEST

  useEffect(() => {
    if (requestSuccess) {
      dispatch(fetchLeaveSummary());
      dispatch(fetchMyLeaveRequests());
    }
  }, [requestSuccess, dispatch]);

  // STATUS STYLE
  const getStatusStyle = (status) => {
    if (status === "Approved") {
      return "bg-[#e8f5ed] text-[#5d7f68]";
    }

    if (status === "Rejected") {
      return "bg-[#fff1f2] text-[#b4535c]";
    }

    return "bg-[#fff7e8] text-[#b08a68]";
  };

  // DATE FORMAT

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // LOADING

  if (loading && requests.length === 0) {
    return (
      <section className="mt-8 rounded-[28px] border border-[#eee7df] bg-white p-6 shadow-[0_8px_30px_rgba(80,60,40,0.04)]">
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#eadcf1] border-t-[#8b5aa8]" />

            <p className="text-sm font-medium text-[#8f8983]">
              Loading leave information...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="mt-8 rounded-[28px] border border-[#eee7df] bg-white p-5 shadow-[0_8px_30px_rgba(80,60,40,0.04)] sm:p-6">
        {/*  HEADER */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-[#b08a68]">
              Leave Management ✨
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-[#292524] sm:text-3xl">
              Your Leave
            </h2>

            <p className="mt-2 text-sm text-[#8f8983]">
              Track your leave balance and manage your requests.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full rounded-2xl bg-[#8b5aa8] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(139,90,168,0.22)] transition hover:bg-[#764994] active:scale-[0.98] sm:w-auto"
          >
            + Request For Leave
          </button>
        </div>

        {/*  ERROR= */}

        {requestError && (
          <div className="mb-6 rounded-2xl border border-[#f3c6cc] bg-[#fff1f2] px-5 py-4 text-sm font-medium text-[#b4535c]">
            {requestError}
          </div>
        )}

        {/* LEAVE CARD */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* SICK LEAVE */}

          <div className="rounded-[24px] border border-[#eee7df] bg-[#fcfaf8] p-5 transition hover:shadow-[0_8px_25px_rgba(80,60,40,0.05)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#9c958f]">Sick Leave</p>

                <p className="mt-2 text-3xl font-bold text-[#292524]">
                  {summary.sick.remaining}
                </p>

                <p className="mt-1 text-xs text-[#aaa39d]">days remaining</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e8f8] text-lg text-[#8b5aa8]">
                ♡
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-between gap-2 text-xs text-[#9c958f]">
              <span>Used: {summary.sick.used}</span>
              <span>Pending: {summary.sick.pending}</span>
              <span>Total: {summary.sick.allocated}</span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eadcf1]">
              <div
                className="h-full rounded-full bg-[#8b5aa8] transition-all"
                style={{
                  width: `${
                    summary.sick.allocated > 0
                      ? Math.min(
                          (summary.sick.used / summary.sick.allocated) * 100,
                          100,
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
          <div className="rounded-[24px] border border-[#eee7df] bg-[#fcfaf8] p-5 transition hover:shadow-[0_8px_25px_rgba(80,60,40,0.05)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#9c958f]">
                  Casual Leave
                </p>

                <p className="mt-2 text-3xl font-bold text-[#292524]">
                  {summary.casual.remaining}
                </p>

                <p className="mt-1 text-xs text-[#aaa39d]">days remaining</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f5ed] text-lg text-[#5d7f68]">
                ✦
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-between gap-2 text-xs text-[#9c958f]">
              <span>Used: {summary.casual.used}</span>
              <span>Pending: {summary.casual.pending}</span>
              <span>Total: {summary.casual.allocated}</span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8f5ed]">
              <div
                className="h-full rounded-full bg-[#5d7f68] transition-all"
                style={{
                  width: `${
                    summary.casual.allocated > 0
                      ? Math.min(
                          (summary.casual.used / summary.casual.allocated) *
                            100,
                          100,
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
        {/* REQUEST HISTORY*/}

        <div className="mt-8 overflow-hidden rounded-[24px] border border-[#eee7df] bg-white">
          <div className="border-t border-[#eee7df] bg-[#fcfaf8] px-5 py-4">
            <div className="flex flex-col gap-2 text-xs text-[#aaa39d] sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {requests.length}{" "}
                {requests.length === 1 ? "request" : "requests"}
              </p>

              <p>🟡 Pending&nbsp;&nbsp; 🟢 Approved&nbsp;&nbsp; 🔴 Rejected</p>
            </div>
          </div>
        </div>
      </section>

      {/*LEAVE REQUEST MODAL*/}

      <LeaveRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default LeaveSection;
