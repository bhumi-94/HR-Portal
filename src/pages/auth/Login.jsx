import Button from "../../components/common/Button";
import working_boy from "../../assets/working_boy.svg";

import { useNavigate, Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { loginUser, googleLogin } from "../../features/auth/authThunk";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Google button container
  const googleButtonRef = useRef(null);
  const googleInitializedRef = useRef(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      if (Number(result.user.role) === 1) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/user-dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Google login failed:", error);
      alert(error || "Google login failed");
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      if (!response?.credential) {
        throw new Error("Google authentication failed");
      }

      const result = await dispatch(
        googleLogin({
          credential: response.credential,
          rememberMe: formData.rememberMe,
        }),
      );
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      if (Number(result.user.role) === 1) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/user-dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Google login failed:", error);

      alert(error || "Google login failed. Please try again.");
    }
  };

  useEffect(() => {
    const initializeGoogle = () => {
      if (
        googleInitializedRef.current ||
        !window.google ||
        !window.google.accounts ||
        !googleButtonRef.current
      ) {
        return;
      }

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!clientId) {
        console.error("VITE_GOOGLE_CLIENT_ID is missing");
        return;
      }

      googleInitializedRef.current = true;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleLogin,
      });

      googleButtonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 350,
      });
    };

    if (window.google && window.google.accounts) {
      initializeGoogle();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", initializeGoogle);

      return () => {
        existingScript.removeEventListener("load", initializeGoogle);
      };
    }

    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";

    script.async = true;
    script.defer = true;

    script.onload = initializeGoogle;

    script.onerror = () => {
      console.error("Failed to load Google Identity Services");
    };

    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-blue-50 p-4 sm:p-6">
      {/* Main Card */}
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row">
        {/* Left Section */}
        <div className="flex w-full items-center justify-center bg-blue-100 p-6 sm:p-10 md:w-1/2 md:p-12 lg:p-14">
          <div className="w-full max-w-sm text-center">
            <img
              src={working_boy}
              alt="Working person"
              className="mx-auto mb-5 h-auto w-2/3 max-w-[220px] sm:w-3/4"
            />

            <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl lg:text-3xl">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Sign in to continue
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full p-6 sm:p-8 md:w-1/2 md:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">
              Sign In
            </h2>

            <hr className="my-4 border-gray-300" />

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Your Email"
                  required
                  className="w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Your Password"
                  required
                  className="w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
                />
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <label
                  htmlFor="rememberMe"
                  className="flex cursor-pointer items-center gap-2 text-xs text-gray-600 sm:text-sm"
                >
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 cursor-pointer accent-blue-600"
                  />

                  <span>Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:underline sm:text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={false}
                className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-sm text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 sm:text-base"
              >
                Login
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <hr className="flex-1 border-gray-300" />

                <span className="text-sm text-gray-500">or</span>

                <hr className="flex-1 border-gray-300" />
              </div>

              {/* Google Login */}
              <div className="flex w-full justify-center">
                <div ref={googleButtonRef} className="min-h-[44px] "></div>
              </div>

              {/* Register */}
              <p className="pt-2 text-center text-xs text-gray-600 sm:text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
