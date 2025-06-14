import { signupFormData, signupSchema } from "../validations.ts/signupSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ISignUpData } from "../interfaces/user";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { signupUser } from "../features/userSlice";
import { toast } from "react-toastify";
import { adminSignUp } from "../features/adminSlice";

interface ISignUpProps {
  onSignupSuccess: () => void;
}

export default function SignUp({ onSignupSuccess }: ISignUpProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<signupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: signupFormData) => {
    const isAdminRoute = window.location.pathname.startsWith("/admin");
    try {
      const submissionData: ISignUpData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      if (isAdminRoute) {
        const resultAdmin = await dispatch(adminSignUp(submissionData));
        if (adminSignUp.fulfilled.match(resultAdmin)) {
          toast.success("Admin signed up successfully");
          reset();
          onSignupSuccess();
        } else {
          const errorMessage = resultAdmin.payload?.message;
          toast.error(errorMessage || "Could not sign up");
        }
      } else {
        const result = await dispatch(signupUser(submissionData));
        if (signupUser.fulfilled.match(result)) {
          toast.success("User signed up successfully");
          reset();
          onSignupSuccess();
        } else {
          const errorMessage = result.payload?.message;
          toast.error(errorMessage || "Could not sign up");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md p-6 md:p-8 bg-white rounded-xl shadow-md font-['Poppins']"
    >
      <h2 className="text-xl font-semibold text-primary mb-2 text-center">
        Create Your Account
      </h2>
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name")}
          type="text"
          placeholder="Enter your full name"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition text-sm`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="Enter your email"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition text-sm`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          {...register("password")}
          type="password"
          placeholder="Create a password"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition text-sm`}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-primary hover:bg-[#0a0d3a] text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-70 disabled:cursor-not-allowed"
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
            Creating account...
          </span>
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
}
