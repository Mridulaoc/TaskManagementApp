import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ISignUpData } from "../interfaces/user";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { signupUser } from "../features/userSlice";
import { toast } from "react-toast";
import { adminSignUp } from "../features/adminSlice";

const signupSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be atleast 5 characters" })
    .max(50, { message: "Name must be less tahn 50 characters" }),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
});

export type signupFormData = z.infer<typeof signupSchema>;

interface ISignUpProps {
  onSignupSuccess: () => void;
}

export default function SignUp({ onSignupSuccess }: ISignUpProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
      className="p-4 border rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <div>
        <label>Name:</label>
        <input {...register("name")} className="border px-2 py-1 w-full" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
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
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
      >
        Signup
      </button>
    </form>
  );
}
