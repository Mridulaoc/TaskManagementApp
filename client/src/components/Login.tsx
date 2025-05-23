import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";
import type { AppDispatch } from "../store/store";
import { loginUser } from "../features/userSlice";
import { toast } from "react-toast";
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
    formState: { errors },
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
      className="p-4 border rounded shadow"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
      <div>
        <label>Email:</label>
        <input {...register("email")} className="border px-2 py-1 w-full" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          {...register("password")}
          className="border px-2 py-1 w-full"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
      >
        Login
      </button>
    </form>
  );
}
