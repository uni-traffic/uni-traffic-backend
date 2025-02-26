import type { Prisma, UserViolation } from "@prisma/client";

export type IUserViolationRawObject = UserViolation;
export type IUserViolationSchema = Prisma.UserViolationUncheckedCreateInput;