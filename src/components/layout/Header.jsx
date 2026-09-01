import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import axios from "axios";

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const API_URL = "http://localhost:3000/api";
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      const response = await axios.get(
        "http://localhost:3000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      console.log("NOTIFICATION RESPONSE:", response.data);

      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error(
        "Notification fetch error:",
        error.response?.data || error.message,
      );
    }
  };
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:3000/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      fetchNotifications();
    } catch (error) {
      console.error(
        "Mark notification error:",
        error.response?.data || error.message,
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => Number(notification.is_read) === 0,
  ).length;

  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        h-16
       bg-[#fffbf4]
        border-b
        border-[#eee]
        lg:left-64
      "
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          className="lg:hidden text-gray-700"
          onClick={() => {
            window.dispatchEvent(new Event("openSidebar"));
          }}
        >
          ☰
        </button>

        {/* Header title */}
        <div className="hidden sm:block">
          <p className="text-sm text-gray-500"></p>
        </div>

        {/* Notification */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition"
          >
            <Bell size={20} className="text-purple-700" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-[350px] max-w-[calc(100vw-30px)] bg-white rounded-xl shadow-xl border border-gray-100 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="font-semibold text-gray-800">Notifications</h3>

                <span className="text-xs text-gray-500">
                  {unreadCount} unread
                </span>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={()=>markAsRead(notification.id)}
                      className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 ${
                        Number(notification.is_read) === 0
                          ? "bg-purple-50"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          🔔
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {notification.title}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {notification.message}
                          </p>

                          <p className="text-[10px] text-gray-400 mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
