import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import Email from "../../assets/Email.svg";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../features/auth/authThunk";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await dispatch(forgotPassword(email)).unwrap();

      setMessage(response.message);
    } catch (error) {
      setError(error || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-blue-50 px-4 py-6">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:min-h-[550px] md:flex-row">
        {/* LEFT */}
        <div className="flex w-full items-center justify-center p-6 sm:p-8 md:w-1/2 md:p-10 lg:p-14">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl md:text-3xl">
                Forgot Password
              </h2>
              <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-3"
                />
              </div>
              <Button
                type="submit"
                disabled={false}
                className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm text-white transition duration-200 hover:bg-blue-500"
              >
                Send Reset Link
              </Button>
              {message && (
                <p className="text-center text-green-600">{message}</p>
              )}
              {error && <p className="text-center text-red-600">{error}</p>}
              <p className="pt-1 text-center text-xs text-gray-600 sm:text-sm">
                Back to{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
        {/* RIGHT */}
        <div className="flex w-full items-center justify-center bg-blue-50 p-6 sm:p-8 md:w-1/2 md:p-10 lg:p-12">
          z
          <div className="w-full max-w-[400px]">
            <img
              src={Email}
              alt="Email illustration"
              className="mx-auto h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
