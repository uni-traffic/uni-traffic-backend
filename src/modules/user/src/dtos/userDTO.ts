import type { Role } from "@prisma/client";

export interface IUserDTO {
  id: string;
  username: string;
  email: string;
  role: Role;
  isSuperAdmin: boolean;
}
