import * as z from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(3, {
    message: "Name has be to minimum 3 characters",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password has be to minimum 6 characters",
  }),
});

export const SignInSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password has be to minimum 6 characters",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password has be to minimum 6 characters",
  }),
});
