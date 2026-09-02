import axios from "axios";
import NotificationBell from "../common/NotificationBell";

const Header = () => {
  const markNotificationAsRead = async (notificationId) => {
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

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: 1,
              }
            : notification,
        ),
      );
    } catch (error) {
      console.error(
        "Mark notification error:",
        error.response?.data || error.message,
      );
    }
  };

  // const unreadCount = notifications.filter(
  //   (notification) => Number(notification.is_read) === 0,
  // ).length;

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
          <div className="ml-auto">
            <NotificationBell />
          </div>
      </div>
    </header>
  );
};

export default Header;
