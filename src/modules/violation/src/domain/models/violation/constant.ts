import type { Prisma, Violation } from "@prisma/client";

export type IViolationRawObject = Violation;
export type IViolationSchema = Prisma.ViolationUncheckedCreateInput;
