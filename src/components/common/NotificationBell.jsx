import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell } from "lucide-react";

import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../features/notifications/notificationThunk";

const NotificationBell = () => {
  const dispatch = useDispatch();

  const { notifications, unreadCount, loading } = useSelector(
    (state) => state.notification,
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleNotificationClick = (notification) => {
    if (Number(notification.is_read) === 0) {
      dispatch(markNotificationAsRead(notification.id));
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-700"
      >
        <Bell size={23} />

        {/* Unread Count */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-[100]">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-800">Notifications</h3>

            {unreadCount > 0 && (
              <button
                onClick={() => dispatch(markAllNotificationsAsRead())}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && <p className="p-4 text-sm text-gray-500">Loading...</p>}

            {!loading && notifications.length === 0 && (
              <p className="p-4 text-sm text-gray-500 text-center">
                No notifications
              </p>
            )}

            {!loading &&
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 ${
                    Number(notification.is_read) === 0 ? "bg-amber-50" : ""
                  }`}
                >
                  <p className="font-medium text-sm text-gray-800">
                    {notification.title}
                  </p>

                  <p className="text-xs text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
