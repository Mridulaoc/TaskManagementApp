import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import AdminHome from "./pages/AdminHome";
import Dashboard from "./pages/Dashboard";
import { TaskManagement } from "./pages/TaskManagement";
import AddTaskForm from "./services/AddTaskForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="admin/dashboard/tasks" element={<TaskManagement />} />
        <Route path="admin/dashboard/tasks/add" element={<AddTaskForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
