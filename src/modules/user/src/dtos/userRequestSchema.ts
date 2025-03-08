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

export const GetUserRequestSchema = z
  .object({
    id: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    username: z.string().optional(),
    email: z.string().optional(),
    role: z.enum([Role.ADMIN, Role.SECURITY, Role.STAFF, Role.STUDENT]).optional()
  })
  .refine(
    (data) =>
      data.id ||
      data.firstName ||
      data.lastName ||
      data.username ||
      data.email ||
      data.role,
    {
      message:
        "At least one of 'firstName', 'lastName', 'username', 'email', or 'role' must be provided."
    }
  );
export type GetUserRequest = z.infer<typeof GetUserRequestSchema>;

export const UpdateUserRoleSchema = z.object({
  userId: string({ message: '"id" of the user must be provided.' }),
  role: z.string().refine((value) => UserRole.validRoles.includes(value), {
    message: `"role" must be one of: ${UserRole.validRoles.join(", ")}`
  })
});
export type UpdateRoleRequest = z.infer<typeof UpdateUserRoleSchema>;
