import { User, type IUser } from "../user/classes/user";
import type {
    IUserRawObject,
    IUserSchema
} from "../user/constant";
import { UserFactory } from "../user/factory";
import type { IUserDTO } from "../../../dtos/userDTO";
import type { IMapper } from "../../../../../../shared/domain/mapper";

export class UserMapper implements IMapper<IUser, IUserSchema, IUserDTO> {
    public toPersistence(user: IUser): IUserSchema {
        return {
            id: user.id,
            username: user.username,
            email: user.emailValue,
            password: user.password,
            isSuperAdmin: user.isSuperAdmin,
            role: user.role,
            isDeleted: user.isDeleted,
            deletedAt: user.deletedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    public toDomain(raw: IUserSchema): IUser {
        const userOrError = UserFactory.create({
            id: raw.id,
            username: raw.username,
            email: raw.email,
            password: raw.password,
            isSuperAdmin: raw.isSuperAdmin,
            role: raw.role,
            isDeleted: raw.isDeleted,
            deletedAt: raw.deletedAt,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });

        return userOrError.getValue();
    }

    public toDTO(user: IUser): IUserDTO {
        return {
            id: user.id,
            username: user.username,
            email: user.emailValue,
            role: user.role,
            isSuperAdmin: user.isSuperAdmin,
        };
    }
}


