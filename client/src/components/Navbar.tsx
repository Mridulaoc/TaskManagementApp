import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { logoutUser } from "../features/userSlice";
import { AppDispatch, RootState } from "../store/store";
import {
  IoNotifications,
  IoTrash,
  IoCheckmarkDone,
  IoPersonCircle,
} from "react-icons/io5";
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
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
        !notificationRef.current.contains(event.target as Node) &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm px-4 py-3 md:px-6 md:py-4 font-['Poppins']">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div
          className="text-2xl md:text-3xl font-bold cursor-pointer flex items-center"
          onClick={() => navigate("/")}
        >
          <span className="text-primary">Task</span>
          <span className="text-secondary">Tribe</span>
        </div>

        {isAuthenticated && (
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={toggleNotifications}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-primary"
                aria-label="Notifications"
              >
                <IoNotifications size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-primary text-white">
                    <h3 className="font-semibold">Notifications</h3>
                    <div className="flex gap-3">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-white hover:text-secondary transition-colors"
                          title="Mark all as read"
                        >
                          <IoCheckmarkDone size={18} />
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={handleClearAll}
                          className="text-white hover:text-red-300 transition-colors"
                          title="Clear all"
                        >
                          <IoTrash size={18} />
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
                          onClick={() =>
                            handleNotificationClick(notification.id)
                          }
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.isRead ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm ${
                                  !notification.isRead
                                    ? "font-semibold text-primary"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.message}
                              </p>
                              {notification.taskTitle && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Task: {notification.taskTitle}
                                </p>
                              )}
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
                <IoPersonCircle
                  size={28}
                  className="text-primary hover:text-secondary transition-colors"
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                    <p className="text-sm font-medium text-gray-700">
                      {user.name}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
