import { BadRequest, NotFoundError, UnexpectedError } from "../../../../../shared/core/errors";
import type { IUser } from "../../domain/models/user/classes/user";
import { UserRole } from "../../domain/models/user/classes/userRole";
import { type IUserMapper, UserMapper } from "../../domain/models/user/mapper";
import { type IUserRepository, UserRepository } from "../../repositories/userRepository";

export class UpdateUserRoleUseCase {
  private _userRepository: IUserRepository;
  private _userMapper: IUserMapper;

  public constructor(
    userRepository: IUserRepository = new UserRepository(),
    userMapper: IUserMapper = new UserMapper()
  ) {
    this._userRepository = userRepository;
    this._userMapper = userMapper;
  }

  public async execute({ userId, role }: { userId: string; role: string }) {
    const user = await this._getUserFromDatabase(userId);
    const newUserRole = this._getNewUserRole(role);
    const updatedUser = this._updateUserRole(user, newUserRole);
    const savedUser = await this._saveUserToDatabase(updatedUser);

    return this._userMapper.toDTO(savedUser);
  }

  private async _getUserFromDatabase(userId: string): Promise<IUser> {
    const user = await this._userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found!");
    }

    return user;
  }

  private _getNewUserRole(role: string): UserRole {
    const newUserRole = UserRole.create(role);
    if (newUserRole.isFailure) {
      throw new BadRequest(newUserRole.getErrorMessage()!);
    }

    return newUserRole.getValue();
  }

  private _updateUserRole(user: IUser, userRole: UserRole): IUser {
    user.updateRole(userRole);
    if (user.role.value !== userRole.value) {
      throw new UnexpectedError("Something went wrong updating user role.");
    }

    return user;
  }

  private async _saveUserToDatabase(user: IUser): Promise<IUser> {
    const savedUser = await this._userRepository.updateUser(user);
    if (!savedUser) {
      throw new UnexpectedError("Failed to update User");
    }

    return savedUser;
  }
}
