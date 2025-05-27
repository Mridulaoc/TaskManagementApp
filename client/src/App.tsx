import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import AdminHome from "./pages/AdminHome";
import Dashboard from "./pages/Dashboard";
import { TaskManagement } from "./pages/TaskManagement";
import AddTaskForm from "./pages/AddTaskForm";
import EditTaskForm from "./pages/EditTaskForm";
import MainLayout from "./components/MainLayout";
import { UserProtectedRoute } from "./components/ProtectedRoutes";
import { restoreUserAuth } from "./features/userSlice";
// import { restoreAdminAuth } from "./features/adminSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
import { useEffect } from "react";
function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initializeAuth = () => {
      const userToken = localStorage.getItem("userToken");
      if (userToken) {
        try {
          dispatch(restoreUserAuth());
        } catch (error) {
          console.error("Failed to restore user auth:", error);
          localStorage.removeItem("userToken");
        }
      }

      const adminToken = localStorage.getItem("adminToken");
      if (adminToken) {
        try {
          // dispatch(restoreAdminAuth({ token: adminToken }));
        } catch (error) {
          console.error("Failed to restore admin auth:", error);
          localStorage.removeItem("adminToken");
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <UserProtectedRoute>
                <Dashboard />
              </UserProtectedRoute>
            }
          />
        </Route>
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="admin/dashboard/tasks" element={<TaskManagement />} />
        <Route path="admin/dashboard/tasks/add" element={<AddTaskForm />} />
        <Route
          path="admin/dashboard/tasks/edit/:taskId"
          element={<EditTaskForm />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
