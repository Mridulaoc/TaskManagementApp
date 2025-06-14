import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
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
