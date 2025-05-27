import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/userSlice";
import { AppDispatch, RootState } from "../store/store";
import { IoNotifications } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <nav className=" p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-secondary">
        <span className="text-primary">Task</span>Tribe
      </div>

      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <button
            className="relative hover:text-gray-300"
            aria-label="Notifications"
          >
            <IoNotifications />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping" />
          </button>

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
