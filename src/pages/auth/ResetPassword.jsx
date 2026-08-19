import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Reset_password from "../../assets/Reset_password.svg";
import Button from "../../components/common/Button";

import { resetPassword } from "../../features/auth/authThunk";

const ResetPassword = () => {
  const { token: pathToken } = useParams();

 
  const [searchParams] = useSearchParams();

  const queryToken = searchParams.get("token");

  
  const token = pathToken || queryToken;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Check token ONLY when button is clicked
    if (!token) {
      setError("Invalid reset link");
      return;
    }

    // Check password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      console.log("Reset token:", token);

      const response = await dispatch(
        resetPassword({
          token: token,
          password: formData.password,
        }),
      ).unwrap();

      console.log("Reset response:", response);

      setMessage(response.message || "Password reset successfully");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);

      setError(error || "Failed to reset password");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-blue-50 p-4 sm:p-6">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row">
        {/* LEFT */}

        <div className="flex w-full items-center justify-center bg-blue-100 p-6 sm:p-10 md:w-1/2">
          <div className="w-full max-w-sm text-center">
            <img
              src={Reset_password}
              alt="Reset Password"
              className="mx-auto mb-5 h-auto w-3/4"
            />
          </div>
        </div>

        {/* RIGHT */}

        <div className="w-full p-6 sm:p-8 md:w-1/2">
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800">
              Reset Password
            </h2>

            <hr className="my-4 border-gray-300" />

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NEW PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  required
                  className="w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-700 outline-none"
                />
              </div>

              {/* CONFIRM PASSWORD */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>

                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
                  required
                  className="w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-700 outline-none"
                />
              </div>

              <Button
                type="submit"
                disabled={false}
                className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm text-white transition hover:bg-blue-500"
              >
                Confirm Password
              </Button>

              {message && (
                <p className="text-center text-green-600">{message}</p>
              )}

              {error && <p className="text-center text-red-600">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
