import type { Prisma, User } from "@prisma/client";

export type IUserRawObject = User;
export type IUserSchema = Prisma.UserUncheckedCreateInput;
