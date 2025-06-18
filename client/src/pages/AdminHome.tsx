import { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

export default function AdminHome() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const handleSignupSuccess = () => {
    setActiveTab("login");
  };

  return (
    <div className="  from-primary/5 to-secondary/5 font-['Poppins'] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-gray-600">Admin Login</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex">
            <button
              className={`flex-1 py-4 px-2 text-center font-medium transition-colors ${
                activeTab === "login"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === "login" ? (
              <Login />
            ) : (
              <SignUp onSignupSuccess={handleSignupSuccess} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
