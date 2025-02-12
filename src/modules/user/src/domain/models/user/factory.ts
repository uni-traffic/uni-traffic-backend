import type { Role } from "@prisma/client";
import { User, type IUser } from "../user/classes/user";
import { UserEmail } from "../user/classes/userEmail";
import { Result } from "../../../../../../shared/core/result";
import { defaultTo } from "rambda";
import { v4 as uuid } from "uuid";

export interface IUserFactory {
  id?: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  isSuperAdmin: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserFactory {
  public static create(userFactoryProps: IUserFactory): Result<IUser> {
    const userEmailOrError = UserEmail.create(userFactoryProps.email);
    if (userEmailOrError.isFailure) {
      return Result.fail(userEmailOrError.getErrorMessage()!);
    }

    return Result.ok<IUser>(
      User.create({
        ...userFactoryProps,
        id: defaultTo(uuid(), userFactoryProps.id),
        username: userFactoryProps.username,
        email: userEmailOrError.getValue(),
      })
    );
  }
}
