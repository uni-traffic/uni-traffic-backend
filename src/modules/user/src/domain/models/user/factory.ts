import { defaultTo } from "rambda";
import { v4 as uuid } from "uuid";
import { Result } from "../../../../../../shared/core/result";
import { type IUser, User } from "./classes/user";
import { UserDeletionStatus } from "./classes/userDeletionStatus";
import { UserEmail } from "./classes/userEmail";
import { UserName } from "./classes/userName";
import { UserRole } from "./classes/userRole";

export interface IUserFactoryProps {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  isSuperAdmin?: boolean;
  isDeleted?: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserFactory {
  public static create(userFactoryProps: IUserFactoryProps): Result<IUser> {
    const userEmailOrError = UserEmail.create(userFactoryProps.email);
    if (userEmailOrError.isFailure) {
      return Result.fail(userEmailOrError.getErrorMessage()!);
    }

    const userNameOrError = UserName.create(userFactoryProps.username);
    if (userNameOrError.isFailure) {
      return Result.fail(userNameOrError.getErrorMessage()!);
    }

    const userRoleOrError = UserRole.create(defaultTo("GUEST", userFactoryProps.role));
    if (userRoleOrError.isFailure) {
      return Result.fail(userRoleOrError.getErrorMessage()!);
    }

    const userDeletionStatusOrError = UserDeletionStatus.create(
      defaultTo<boolean>(false, userFactoryProps.isDeleted),
      defaultTo<Date | null>(null, userFactoryProps.deletedAt)
    );
    if (userDeletionStatusOrError.isFailure) {
      return Result.fail(userDeletionStatusOrError.getErrorMessage()!);
    }

    return Result.ok<IUser>(
      User.create({
        ...userFactoryProps,
        id: defaultTo(uuid(), userFactoryProps.id),
        username: userNameOrError.getValue(),
        email: userEmailOrError.getValue(),
        role: userRoleOrError.getValue(),
        isSuperAdmin: defaultTo<boolean>(false, userFactoryProps.isSuperAdmin),
        userDeletionStatus: userDeletionStatusOrError.getValue(),
        createdAt: defaultTo<Date>(new Date(), userFactoryProps.createdAt),
        updatedAt: defaultTo<Date>(new Date(), userFactoryProps.updatedAt)
      })
    );
  }
}
