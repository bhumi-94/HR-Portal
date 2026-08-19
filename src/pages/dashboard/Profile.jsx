import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  const fileInputRef = useRef(null);

  const [user, setUser] = useState(initialUser);

  const [profilePic, setProfilePic] = useState(
    initialUser?.profile_image
      ? `http://localhost:3000${initialUser.profile_image}`
      : null,
  );

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await axios.get("http://localhost:3000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("CURRENT USER:", response.data);

        const currentUser = response.data.user || response.data;

        setUser(currentUser);

        localStorage.setItem("user", JSON.stringify(currentUser));

        if (currentUser.profile_image) {
          setProfilePic(`http://localhost:3000${currentUser.profile_image}`);
        } else {
          setProfilePic(null);
        }
      } catch (error) {
        console.error(
          "Failed to fetch current user:",
          error.response?.data || error.message,
        );
      }
    };

    fetchCurrentUser();
  }, []);

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleProfileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Check size
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    // Show immediately
    const previewUrl = URL.createObjectURL(file);
    setProfilePic(previewUrl);

    try {
      const formData = new FormData();

      formData.append("profilePic", file);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:3000/api/users/profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);

      alert("Profile picture updated successfully!");

      const imageUrl = `http://localhost:3000${response.data.profile_image}`;

      setProfilePic(imageUrl);

      
      const updatedUser = {
        ...user,
        profile_image: response.data.profile_image,
      };

      setUser(updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Upload error:", error);

      // alert(
      //   error.response?.data?.message || "Failed to upload profile picture",
      // );
    }
  };

  // setProfilePic(
  //   `http://localhost:3000${response.data.profilePic}`
  // );
  // LOGOUT

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };
  // ROLE

  const getRoleName = (role) => {
    if (Number(role) === 1) return "HR";
    return "User";
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#292524]">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-[#eee7df] bg-white lg:flex lg:flex-col">
        {/* LOGO */}
        <div className="flex items-center gap-3 px-7 py-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8d5f5] text-xl">
            ✦
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#292524]">
              HR Portal
            </h1>
            <p className="text-xs text-[#a8a29e]">People management</p>
          </div>
        </div>
        {/* SIDEBAR NAVIGATION */}
        <div className="px-4">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#b0aaa4]">
            Account
          </p>
          {/* MY PROFILE */}
          <button className="flex w-full items-center gap-3 rounded-2xl bg-[#f6eafa] px-4 py-3 text-sm font-semibold text-[#8b5aa8]">
            <span className="text-lg">♡</span>
            My Profile
          </button>
        </div>
        {/* SIDEBAR USER*/}
        <div className="mt-auto p-4">
          <div className="mb-3 rounded-2xl bg-[#faf8f5] p-4">
            <div className="flex items-center gap-3">
              {/* AVATAR */}

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3d4d9] text-sm font-bold text-[#9f4f5c]">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-purple-700">
                    {user?.fullname?.charAt(0)?.toUpperCase() || "D"}
                  </span>
                )}
              </div>

              {/* USER INFO */}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#292524]">
                  {user?.fullname || "User"}
                </p>

                <p className="text-xs text-[#a8a29e]">
                  {getRoleName(user?.role)}
                </p>
              </div>
            </div>
          </div>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#a85c65] transition hover:bg-[#fff1f2]"
          >
            <span className="text-lg">↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="lg:ml-64">
        <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          {/*  MOBILE HEADER */}

          <div className="mb-7 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8d5f5]">
                ✦
              </div>

              <div>
                <h1 className="font-bold text-[#292524]">HR Portal</h1>

                <p className="text-xs text-[#a8a29e]">My Profile</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#a85c65] shadow-sm"
            >
              Logout
            </button>
          </div>

          {/* PAGE HEADER */}

          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-[#b08a68]">
              Your space ✨
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-[#292524] sm:text-4xl">
              My Profile
            </h2>

            <p className="mt-2 text-sm text-[#8f8983] sm:text-base">
              Your account information, all in one place.
            </p>
          </div>

          {/* PROFILE HERO */}

          <div className="mb-6 overflow-hidden rounded-[28px] border border-[#eee7df] bg-white shadow-[0_10px_40px_rgba(80,60,40,0.05)]">
            {/* TOP DECORATION */}

            <div className="relative h-32 overflow-hidden bg-[#f3e8f8]">
              <div className="absolute -right-8 -top-16 h-48 w-48 rounded-full bg-[#ead5f2] opacity-70" />
              <div className="absolute right-32 top-10 h-24 w-24 rounded-full bg-[#f5dfe5] opacity-70" />
              <div className="absolute -bottom-10 left-20 h-32 w-32 rounded-full bg-[#e5f0e9] opacity-70" />
              <div className="absolute left-8 top-7 text-2xl text-[#b18cc3]">
                ✦
              </div>

              <div className="absolute right-12 top-8 text-xl text-[#c995a1]">
                ♡
              </div>
            </div>

            {/* PROFILE CONTENT */}

            <div className="relative px-6 pb-7 sm:px-8">
              {/* AVATAR + STATUS */}

              <div className="-mt-12 mb-5 flex items-end justify-between">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border-4 border-white bg-[#e8ddf3] text-2xl font-bold text-[#80639b] shadow-md">
                  <div
                    onClick={handleProfileClick}
                    className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-[28px] border-white bg-[#e8ddf3] text-2xl font-bold text-[#80639b] shadow-md transition hover:scale-105"
                  >
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-purple-700">
                        {user?.fullname?.charAt(0)?.toUpperCase() || "D"}
                      </span>
                    )}

                    {/* Hover camera icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition hover:opacity-100">
                      <span className="text-2xl text-white">📷</span>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleProfileChange}
                    className="hidden"
                  />
                </div>

                {/* STATUS */}

                <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#e8f6ed] px-4 py-2 text-xs font-semibold text-[#4d8a68]">
                  <span className="h-2 w-2 rounded-full bg-[#62ad7e]" />
                  Active account
                </span>
              </div>

              {/* NAME */}

              <div>
                <h3 className="text-2xl font-bold text-[#292524]">
                  {user?.fullname || "N/A"}
                </h3>

                <p className="mt-1 text-sm text-[#9c958f]">
                  {user?.email || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* ACCOUNT INFORMATION */}

          <div className="rounded-[28px] border border-[#eee7df] bg-white shadow-[0_10px_40px_rgba(80,60,40,0.05)]">
            {/* CARD HEADER */}
            <div className="border-b border-[#f0ebe5] px-6 py-6 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e8f8] text-lg">
                  ♡
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#292524]">
                    Account Information
                  </h3>

                  <p className="mt-1 text-sm text-[#a39c96]">
                    Your registered account details
                  </p>
                </div>
              </div>
            </div>

            {/* USER DETAILS */}

            <div className="grid gap-x-10 gap-y-1 px-6 py-3 sm:grid-cols-2 sm:px-8">
              {/* USER ID */}

              <div className="border-b border-[#f3eee9] py-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#aaa39d]">
                  User ID
                </p>

                <p className="mt-2 text-base font-semibold text-[#292524]">
                  #{user?.id || "N/A"}
                </p>
              </div>

              {/* FULL NAME */}

              <div className="border-b border-[#f3eee9] py-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#aaa39d]">
                  Full Name
                </p>

                <p className="mt-2 text-base font-semibold text-[#292524]">
                  {user?.fullname || "N/A"}
                </p>
              </div>

              {/* EMAIL */}

              <div className="border-b border-[#f3eee9] py-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#aaa39d]">
                  Email Address
                </p>

                <p className="mt-2 break-all text-base font-semibold text-[#292524]">
                  {user?.email || "N/A"}
                </p>
              </div>

              {/* ROLE */}

              <div className="border-b border-[#f3eee9] py-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#aaa39d]">
                  Role
                </p>

                <span className="mt-2 inline-flex rounded-full bg-[#f3e8f8] px-3 py-1.5 text-xs font-semibold text-[#895fa0]">
                  {getRoleName(user?.role)}
                </span>
              </div>

              {/* ACCOUNT STATUS */}

              <div className="py-6 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#aaa39d]">
                  Account Status
                </p>

                <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#e8f6ed] px-3 py-1.5 text-xs font-semibold text-[#4d8a68]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#62ad7e]" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-[#aaa39d] sm:flex-row">
            <p>HR Portal · People management</p>

            <p>Made with care ✦</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
