import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />

      <main className="flex-grow p-4 md:p-6">
        <Outlet />
      </main>

      <footer className="bg-gray-100 p-4 text-center">
        © {new Date().getFullYear()} TaskTribe
      </footer>
    </div>
  );
};

export default AdminLayout;
