import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../components/common/Button";
import working_girl from "../../assets/working_girl.svg";
import { registerUser } from "../../features/auth/authThunk";
import { signupSchema } from "../../validation/signupSchema";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    personal_email: "",
    working_email: "",
    phone: "",
    address: "",
    gender: "",
    department: "",
    job_title: "",
    password: "",
    confirmPassword: "",
    terms: false,
    // profileImage: null,
  });

  const [errors, setErrors] = useState({});

  const { loading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (success) {
      alert("Registration successful! Please login.");
      navigate("/login");
    }
  }, [success, navigate]);

  // HANDLE INPUT CHANGE

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Remove error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("BUTTON CLICKED");
    console.log("FORM DATA:", formData);

    setErrors({});

    try {
      // 1. Validate normal form fields
      await signupSchema.validate(formData, {
        abortEarly: false,
      });

      console.log("VALIDATION PASSED");

      // 2. Create FormData
      const data = new FormData();

      // 3. Add normal fields

      data.append("firstname", formData.firstname);
      data.append("lastname", formData.lastname);
      data.append("username", formData.username);

      data.append("personal_email", formData.personal_email);
      data.append("working_email", formData.working_email);

      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("gender", formData.gender);
      data.append("department", formData.department);
      data.append("job_title", formData.job_title);
      data.append("password", formData.password);
      
      // 4. Add profile image
      // if (formData.profileImage) {
      //   data.append("profileImage", formData.profileImage);
      // }

      // Check FormData
      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }

      // 5. Send FormData through Redux
      const result = await dispatch(registerUser(data));

      console.log("REGISTER RESULT:", result);

      // 6. Registration successful
      if (registerUser.fulfilled.match(result)) {
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      console.log("VALIDATION ERROR:", error);

      const validationErrors = {};

      if (error.inner && error.inner.length > 0) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
      }
      console.log("VALIDATION ERRORS:", validationErrors);
      setErrors(validationErrors);
    }
  };
  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <div className="min-h-screen bg-[#eef5fc] px-4 py-8 sm:px-6">
      {/* MAIN CARD */}
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(31,64,104,0.12)]">
        {/* ================= HEADER ================= */}
        <div className="border-b border-slate-200 bg-[#f8fbff] px-6 py-6 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-500">
                HR Portal
              </p>

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Create Profile
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create a new employee account
              </p>
            </div>

            {/* Small illustration */}
            <img
              src={working_girl}
              alt="Working"
              className="hidden h-20 w-20 object-contain sm:block"
            />
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="px-6 py-6 sm:px-8 sm:py-8">
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ================= PERSONAL INFORMATION ================= */}

            <div className="mb-6">
              <h2 className="text-base font-semibold text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Enter the employee's basic details.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              {/* <div> */}
                {/* <label
                  htmlFor="profileImage"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Profile Image
                </label> */}

              
                {/* <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      profileImage: e.target.files[0],
                    })
                  }
                  className="w-full rounded-md border border-gray-400 px-3 py-2"
                /> */}
              {/* </div> */}

              {/* FIRST NAME */}
              <div>
                <label htmlFor="firstname" className={labelClass}>
                  First Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={inputClass}
                />
                {errors.firstname && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.firstname}
                  </p>
                )}
              </div>

              {/* LAST NAME */}
              <div>
                <label htmlFor="lastname" className={labelClass}>
                  Last Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={inputClass}
                />

                {errors.lastname && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastname}</p>
                )}
              </div>

              {/* USERNAME */}
              <div>
                <label htmlFor="username" className={labelClass}>
                  Username <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className={inputClass}
                />

                {errors.username && (
                  <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number <span className="text-red-500">*</span>
                </label>

                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className={inputClass}
                />

                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* PERSONAL EMAIL */}
              <div>
                <label htmlFor="personalEmail" className={labelClass}>
                  Personal Email <span className="text-red-500">*</span>
                </label>

                <input
                  type="email"
                  id="personal_email"
                  name="personal_email"
                  value={formData.personal_email}
                  onChange={handleChange}
                  placeholder="personal@example.com"
                  className={inputClass}
                />
                {/**
              * <input
                type="email"
                id="personalEmail"
                name="personalEmail"
                value={formData.personalEmail}
                onChange={handleChange}
                placeholder="personal@example.com"
                className={inputClass}
              />
              */}

                {errors.personalEmail && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.personalEmail}
                  </p>
                )}
              </div>

              {/* WORKING EMAIL */}
              <div>
                <label htmlFor="workingEmail" className={labelClass}>
                  Working Email{" "}
                  <span className="text-xs font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="working_email"
                  name="working_email"
                  value={formData.working_email}
                  type="email"
                  // id="workingEmail"
                  // name="workingEmail"
                  // value={formData.workingEmail}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={inputClass}
                />

                {errors.workingEmail && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.workingEmail}
                  </p>
                )}
              </div>

              {/* GENDER */}
              <div>
                <label htmlFor="gender" className={labelClass}>
                  Gender <span className="text-red-500">*</span>
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>

                {errors.gender && (
                  <p className="mt-1 text-xs text-red-500">{errors.gender}</p>
                )}
              </div>

              {/* ADDRESS */}
              <div>
                <label htmlFor="address" className={labelClass}>
                  Address <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className={inputClass}
                />

                {errors.address && (
                  <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                )}
              </div>
            </div>

            {/* ================= WORK INFORMATION ================= */}

            <div className="mb-6 mt-8 border-t border-slate-200 pt-6">
              <h2 className="text-base font-semibold text-slate-900">
                Work Information
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Add the employee's professional details.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              {/* DEPARTMENT */}
              <div>
                <label htmlFor="department" className={labelClass}>
                  Department <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Human Resources"
                  className={inputClass}
                />

                {errors.department && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.department}
                  </p>
                )}
              </div>

              {/* JOB TITLE */}
              <div>
                <label htmlFor="jobTitle" className={labelClass}>
                  Job Title <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  id="job_title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  placeholder="e.g. Software Developer"
                  className={inputClass}
                />

                {/* <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Software Developer"
                  className={inputClass}
                /> */}

                {errors.jobTitle && (
                  <p className="mt-1 text-xs text-red-500">{errors.jobTitle}</p>
                )}
              </div>
            </div>

            {/* ================= SECURITY ================= */}

            <div className="mb-6 mt-8 border-t border-slate-200 pt-6">
              <h2 className="text-base font-semibold text-slate-900">
                Account Security
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Set a secure password for the employee account.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              {/* PASSWORD */}
              <div>
                <label htmlFor="password" className={labelClass}>
                  Password <span className="text-red-500">*</span>
                </label>

                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={inputClass}
                />

                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label htmlFor="confirmPassword" className={labelClass}>
                  Confirm Password <span className="text-red-500">*</span>
                </label>

                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={inputClass}
                />

                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* ================= TERMS ================= */}

            <div className="mt-6">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 cursor-pointer accent-blue-600"
                />

                <label
                  htmlFor="terms"
                  className="text-xs leading-5 text-slate-500 sm:text-sm"
                >
                  I agree to the{" "}
                  <span className="font-medium text-blue-600">
                    Terms and Conditions
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-blue-600">
                    Privacy Policy
                  </span>
                </label>
              </div>

              {errors.terms && (
                <p className="mt-1 text-xs text-red-500">{errors.terms}</p>
              )}
            </div>

            {/* ================= SUBMIT ================= */}

            <div className="mt-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>

            {/* LOGIN */}

            <p className="mt-5 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
