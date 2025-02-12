import type { Role } from "@prisma/client";

export type IUserRawObject = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isSuperAdmin: boolean;
  role: Role;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type IUserSchema = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isSuperAdmin: boolean;
  role: Role;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
