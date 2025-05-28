import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";
import type { AppDispatch } from "../store/store";
import { loginUser } from "../features/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../features/adminSlice";

const loginSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
});

type loginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: loginFormData) => {
    const isAdminRoute = window.location.pathname.startsWith("/admin");
    if (isAdminRoute) {
      const resultAdmin = await dispatch(adminLogin(data));
      if (loginUser.fulfilled.match(resultAdmin)) {
        toast.success(resultAdmin.payload.message);
        navigate("/admin/dashboard");
      } else {
        toast.error(resultAdmin.payload!.message);
      }
    } else {
      const result = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(result)) {
        toast.success(result.payload.message);
        navigate("/dashboard");
      } else {
        toast.error(result.payload!.message);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md p-6 md:p-8 bg-white rounded-xl shadow-md font-['Poppins']"
    >
      <h2 className="text-xl font-semibold text-[#11154F] mb-1 text-center p-2">
        Welcome Back
      </h2>

      {/* Email Field */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="Enter your email"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-[#3BB7F4] focus:border-[#3BB7F4] outline-none transition text-sm`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="Enter your password"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-[#3BB7F4] focus:border-[#3BB7F4] outline-none transition text-sm`}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-[#11154F] hover:bg-[#0a0d3a] text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3BB7F4] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Logging in...
          </span>
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
}
