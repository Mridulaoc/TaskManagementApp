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
    <nav className=" p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-secondary">
        <span className="text-primary">Task</span>Tribe
      </div>

      {isAuthenticated && (
        <div className="flex items-center gap-4">
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

export default AdminNavbar;
