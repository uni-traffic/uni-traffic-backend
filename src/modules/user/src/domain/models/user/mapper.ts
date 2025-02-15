import type { IMapper } from "../../../../../../shared/domain/mapper";
import type { IUserDTO } from "../../../dtos/userDTO";
import type { IUser } from "./classes/user";
import type { IUserRawObject, IUserSchema } from "./constant";
import { UserFactory } from "./factory";

export interface IUserMapper extends IMapper<IUser, IUserSchema, IUserRawObject, IUserDTO> {}
export class UserMapper implements IUserMapper {
  public toPersistence(user: IUser): IUserRawObject {
    return {
      id: user.id,
      username: user.usernameValue,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailValue,
      password: user.password,
      isSuperAdmin: user.isSuperAdmin,
      role: user.role,
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
      username: user.usernameValue,
      email: user.emailValue,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
  }
}
