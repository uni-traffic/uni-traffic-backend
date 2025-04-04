import type { Prisma, UserSignInActivity } from "@prisma/client";
import { IUserDTO } from "../../../../../user/src/dtos/userDTO";

export interface IUserSignInActivityRawObject extends UserSignInActivity {
  user?: IUserDTO | null;
}

export type IUserSignInActivitySchema = Prisma.UserSignInActivityUncheckedCreateInput;
