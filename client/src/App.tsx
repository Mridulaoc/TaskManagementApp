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
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
import { useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
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
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/tasks" element={<TaskManagement />} />
          <Route path="dashboard/tasks/add" element={<AddTaskForm />} />
          <Route
            path="dashboard/tasks/edit/:taskId"
            element={<EditTaskForm />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
