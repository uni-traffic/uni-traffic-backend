import z from "zod";
import { Role } from "@prisma/client";

export const LoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});
export type LoginRequest = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().min(1, "Email is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum([Role.ADMIN, Role.SECURITY, Role.STAFF, Role.STUDENT])
});
export type RegisterRequest = z.infer<typeof RegisterSchema>;

export const GetUserSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  userName: z.string().optional(),
  email: z.string().optional(),
  role: z.enum([Role.ADMIN, Role.SECURITY, Role.STAFF, Role.STUDENT]).optional()
});
export type GetUserRequestSchema = z.infer<typeof GetUserSchema>;
