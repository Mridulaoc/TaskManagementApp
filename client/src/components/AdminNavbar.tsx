import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../features/adminSlice";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.admin);

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate("/admin");
  };

  return (
    <nav className="bg-white shadow-sm px-4 py-3 md:px-6 md:py-4 font-['Poppins']">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div
          className="text-2xl md:text-3xl font-bold cursor-pointer"
          onClick={() => isAuthenticated && navigate("/admin/dashboard")}
        >
          <span className="text-primary">Task</span>
          <span className="text-secondary">Tribe</span>
        </div>

        {isAuthenticated && (
          <div className="flex items-center space-x-4 md:space-x-6">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-primary hover:text-[#0a0d3a] transition-colors"
            >
              <span className="hidden sm:inline-block">Logout</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
