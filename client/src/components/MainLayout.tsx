import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow p-4 md:p-6">
        <Outlet />
      </main>

      <footer className="bg-gray-100 p-4 text-center">
        © {new Date().getFullYear()} TaskTribe
      </footer>
    </div>
  );
};

export default MainLayout;
