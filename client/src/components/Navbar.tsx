import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { logoutUser } from "../features/userSlice";
import { AppDispatch, RootState } from "../store/store";
import { IoNotifications, IoTrash, IoCheckmarkDone } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
} from "../features/notificationSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );

  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.notification
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = (notificationId: string) => {
    dispatch(markAsRead(notificationId));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
    setShowNotifications(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-secondary">
        <span className="text-primary">Task</span>Tribe
      </div>

      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <div className="relative" ref={notificationRef}>
            <button
              onClick={toggleNotifications}
              className="relative hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <IoNotifications size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                        title="Mark all as read"
                      >
                        <IoCheckmarkDone size={16} />
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="Clear all"
                      >
                        <IoTrash size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.isRead ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm ${
                                !notification.isRead ? "font-semibold" : ""
                              } text-gray-800`}
                            >
                              {notification.message}
                            </p>
                            {notification.taskTitle && (
                              <p className="text-xs text-gray-600 mt-1">
                                Task: {notification.taskTitle}
                              </p>
                            )}
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <span className="hidden sm:inline">{user.name}</span>

          <button
            onClick={handleLogout}
            className="text-primary px-3 py-1 rounded hover:bg-blue-100"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
