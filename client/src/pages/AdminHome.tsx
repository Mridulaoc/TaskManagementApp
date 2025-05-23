import { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

export default function AdminHome() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const handleSignupSuccess = () => {
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="p-4 font-semibold text-center text-2xl">Admin Login</h1>
      <div className="bg-white rounded shadow-lg w-full max-w-md">
        <div className="flex border-b">
          <button
            className={`w-1/2 py-2 text-center font-semibold ${
              activeTab === "login"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 text-center font-semibold ${
              activeTab === "signup"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Signup
          </button>
        </div>

        {/* Form content */}
        <div className="p-6">
          {activeTab === "login" ? (
            <Login />
          ) : (
            <SignUp onSignupSuccess={handleSignupSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
