import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestLeave } from "../../features/leave/leaveThunk";

const LeaveRequestModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const dispatch = useDispatch();

  const { submitting } = useSelector((state) => state.leave);

  const [duration, setDuration] = useState(0);

  // Calculate duration
  useEffect(() => {
    if (!formData.startDate || !formData.endDate) {
      setDuration(0);
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (end < start) {
      setDuration(0);
      return;
    }

    const difference = end.getTime() - start.getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;

    setDuration(days);
  }, [formData.startDate, formData.endDate]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "reason") {
      for (let i = 0; i < value.length; i++) {
        const code = value.charCodeAt(i);

        const isUppercase = code >= 65 && code <= 90;
        const isLowercase = code >= 97 && code <= 122;
        const isNumber = code >= 48 && code <= 57;
        const isSpace = code === 32;

        if (!isUppercase && !isLowercase && !isNumber && !isSpace) {
          return;
        }
      }
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!duration) {
      return;
    }

    try {
      await dispatch(
        requestLeave({
          leaveType: formData.leaveType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
        }),
      ).unwrap();

      console.log("Leave request submitted successfully");

      onClose();
    } catch (error) {
      console.error("Leave request failed:", error);
    }
  };
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#292524]/35 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* MODAL */}
      <div
        className="
          relative
          w-full
          max-w-xl
          max-h-[90vh]
          overflow-y-auto
          rounded-[28px]
          border
          border-[#eee7df]
          bg-[#fffdfb]
          p-7
          shadow-[0_25px_80px_rgba(60,40,70,0.18)]
        "
      >
        {/* TOP DECORATION */}
        <div className="absolute left-0 top-0 h-1.5 w-full rounded-t-[28px] bg-gradient-to-r from-[#d9b6e9] via-[#9b65b5] to-[#f4c9c5]" />

        {/* HEADER */}
        <div className="mb-7 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3e8f8] text-xl text-[#8b5aa8]">
              ♡
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#292524]">
                Request For Leave
              </h2>

              <p className="mt-1 text-sm text-[#99918b]">
                Submit a new leave request.
              </p>
            </div>
          </div>

          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-xl
              text-[#918a84]
              transition
              hover:bg-[#f5efeb]
              hover:text-[#292524]
            "
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* LEAVE TYPE */}
          <div>
            <label
              htmlFor="leaveType"
              className="mb-2 block text-sm font-semibold text-[#403b37]"
            >
              Leave Type
            </label>

            <select
              id="leaveType"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              required
              className="
                h-12
                w-full
                rounded-2xl
                border
                border-[#e8dfd8]
                bg-[#fcfaf8]
                px-4
                text-sm
                text-[#403b37]
                outline-none
                transition
                focus:border-[#a66abd]
                focus:ring-4
                focus:ring-[#f3e8f8]
              "
            >
              <option value="">Select leave type</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="WFH">WFH</option>
            </select>
          </div>

          {/* DATE ROW */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* START DATE */}
            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm font-semibold text-[#403b37]"
              >
                Start Date
              </label>

              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border
                  border-[#e8dfd8]
                  bg-[#fcfaf8]
                  px-4
                  text-sm
                  text-[#403b37]
                  outline-none
                  transition
                  focus:border-[#a66abd]
                  focus:ring-4
                  focus:ring-[#f3e8f8]
                "
              />
            </div>

            {/* END DATE */}
            <div>
              <label
                htmlFor="endDate"
                className="mb-2 block text-sm font-semibold text-[#403b37]"
              >
                End Date
              </label>

              <input
                id="endDate"
                name="endDate"
                type="date"
                min={formData.startDate || undefined}
                value={formData.endDate}
                onChange={handleChange}
                required
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border
                  border-[#e8dfd8]
                  bg-[#fcfaf8]
                  px-4
                  text-sm
                  text-[#403b37]
                  outline-none
                  transition
                  focus:border-[#a66abd]
                  focus:ring-4
                  focus:ring-[#f3e8f8]
                "
              />
            </div>
          </div>

          {/* DURATION */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#403b37]">
              Duration
            </label>

            <div
              className="
                flex
                h-12
                items-center
                rounded-2xl
                border
                border-[#e8dfd8]
                bg-[#f3e8f8]/60
                px-4
              "
            >
              <span className="text-sm font-semibold text-[#8b5aa8]">
                {duration > 0
                  ? `${duration} ${duration === 1 ? "Day" : "Days"}`
                  : "Select dates"}
              </span>
            </div>
          </div>

          {/* REASON */}
          <div>
            <label
              htmlFor="reason"
              className="mb-2 block text-sm font-semibold text-[#403b37]"
            >
              Reason
            </label>

            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Tell us the reason for your leave..."
              className="
                w-full
                resize-none
                rounded-2xl
                border
                border-[#e8dfd8]
                bg-[#fcfaf8]
                p-4
                text-sm
                text-[#403b37]
                outline-none
                transition
                placeholder:text-[#b7aea7]
                focus:border-[#a66abd]
                focus:ring-4
                focus:ring-[#f3e8f8]
              "
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 border-t border-[#eee7df] pt-6">
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-2xl
                border
                border-[#e4dbd4]
                bg-white
                px-5
                py-3
                text-sm
                font-semibold
                text-[#625b55]
                transition
                hover:bg-[#f8f4f1]
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="
                rounded-2xl
                bg-[#8b5aa8]
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                shadow-[0_8px_20px_rgba(139,90,168,0.22)]
                transition
                hover:bg-[#764994]
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestModal;
