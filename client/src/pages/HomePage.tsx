import { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const handleSignupSuccess = () => {
    setActiveTab("login");
  };

  return (
    <div className=" from-[#11154F]/5 to-[#3BB7F4]/5 font-['Poppins'] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        {/* Auth Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
          {/* Tabs */}
          <div className="flex bg-gray-50">
            <button
              className={`flex-1 py-4 px-2 text-center font-medium transition-colors ${
                activeTab === "login"
                  ? "text-[#11154F] border-b-2 border-[#11154F] bg-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 px-2 text-center font-medium transition-colors ${
                activeTab === "signup"
                  ? "text-[#11154F] border-b-2 border-[#11154F] bg-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8 transition-all duration-300">
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
