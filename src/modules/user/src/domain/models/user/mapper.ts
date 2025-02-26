import type { Role } from "@prisma/client";
import type { IUserDTO } from "../../../dtos/userDTO";
import type { IUser } from "./classes/user";
import type { IUserRawObject } from "./constant";
import { UserFactory } from "./factory";

export interface IUserMapper {
  toPersistence(user: IUser): IUserRawObject;
  toDomain(raw: IUserRawObject): IUser;
  toDTO(user: IUser): IUserDTO;
}

export class UserMapper {
  public toPersistence(user: IUser): IUserRawObject {
    return {
      id: user.id,
      username: user.username.value,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.value,
      password: user.password,
      isSuperAdmin: user.isSuperAdmin,
      role: user.role.value as Role,
      isDeleted: user.userDeletionStatus.isDeleted,
      deletedAt: user.userDeletionStatus.deletedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  public toDomain(raw: IUserRawObject): IUser {
    const userOrError = UserFactory.create({
      id: raw.id,
      username: raw.username,
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      password: raw.password,
      isSuperAdmin: raw.isSuperAdmin,
      role: raw.role,
      isDeleted: raw.isDeleted,
      deletedAt: raw.deletedAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    });

    return userOrError.getValue();
  }

  public toDTO(user: IUser): IUserDTO {
    return {
      id: user.id,
      username: user.username.value,
      email: user.email.value,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role.value
    };
  }
}
