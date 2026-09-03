import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare, Star } from "lucide-react";

import { submitFeedback } from "../../features/feedback/feedbackThunk";

import { clearFeedbackStatus } from "../../features/feedback/feedbackSlice";

const Feedback = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user)

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.feedback);

  const [formData, setFormData] = useState({
    problem: "",
    against: "",
  });

  
  useEffect(() => {
    if (success) {
      setFormData({
        problem: "",
        against: "",
      });

      const timer = setTimeout(() => {
        dispatch(clearFeedbackStatus());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.problem.trim()) {
      return;
    }

    dispatch(
      submitFeedback({
        problem: formData.problem,
        against: formData.against,
      }),
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f6f1] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f0e2fa] flex items-center justify-center">
              <MessageSquare size={24} className="text-[#8e5ab4]" />
            </div>

            <div>
              <p className="text-sm text-[#a87843]">Employee Experience ✨</p>

              <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
            </div>
          </div>

          <p className="text-gray-500 mt-3">
            Share your thoughts, suggestions, or concerns with the HR team.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#eee5db] shadow-sm p-6 sm:p-8">
          {success && (
            <div className="mb-5 rounded-xl bg-green-50 border border-green-200 p-4 text-green-700">
              Feedback submitted successfully! HR has been notified.
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 bg-[#fffcf8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#9b63bd] cursor-not-allowed"
                value={user?.fullname || ""}
                readOnly
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem <span className="text-red-500">*</span>
              </label>

              <textarea
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                rows={6}
                placeholder="Describe your problem..."
                className="w-full rounded-xl border border-gray-200 bg-[#fffcf8] px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-[#9b63bd]"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Against
                <span className="text-gray-400 ml-2">(Optional)</span>
              </label>

              <input
                type="text"
                name="against"
                value={formData.against}
                onChange={handleChange}
                placeholder="Enter person, department, or subject (optional)"
                className="w-full rounded-xl border border-gray-200 bg-[#fffcf8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#9b63bd]"
              />
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#925bb4] text-white font-semibold shadow-md hover:bg-[#814ca3] disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
