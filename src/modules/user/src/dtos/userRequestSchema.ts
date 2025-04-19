import { Role } from "@prisma/client";
import z, { string } from "zod";
import { UserRole } from "../domain/models/user/classes/userRole";

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

export const GoogleSignInSchema = z.object({
  token: z.string().min(1, "Access Token"),
  clientType: z.enum(["WEB", "MOBILE"], { message: "Client Type must be provided." })
});
export type GoogleSignInRequest = z.infer<typeof GoogleSignInSchema>;

export const GetUserRequestSchema = z.object({
  count: z.string().refine(
    (val) => {
      const num = Number(val);
      return !Number.isNaN(num) && Number.isInteger(num) && num > 0;
    },
    {
      message: '"count" must be a valid positive whole number'
    }
  ),
  page: z.string().refine(
    (val) => {
      const num = Number(val);
      return !Number.isNaN(num) && Number.isInteger(num) && num > 0;
    },
    {
      message: '"page" must be a valid positive whole number'
    }
  ),
  id: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  sort: z.enum(["1", "2"]).optional(),
  searchKey: z.string().optional(),
  role: z
    .string()
    .refine((value) => UserRole.validRoles.includes(value), {
      message: `"role" must be one of: ${UserRole.validRoles.join(", ")}`
    })
    .optional()
});
export type GetUserRequest = z.infer<typeof GetUserRequestSchema>;

export const UpdateUserRoleSchema = z.object({
  userId: string({ message: '"id" of the user must be provided.' }),
  role: z.string().refine((value) => UserRole.validRoles.includes(value), {
    message: `"role" must be one of: ${UserRole.validRoles.join(", ")}`
  })
});
export type UpdateRoleRequest = z.infer<typeof UpdateUserRoleSchema>;
