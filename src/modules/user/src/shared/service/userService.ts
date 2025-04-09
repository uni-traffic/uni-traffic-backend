import { NotFoundError } from "../../../../../shared/core/errors";
import { type IUserMapper, UserMapper } from "../../domain/models/user/mapper";
import type { IUserDTO } from "../../dtos/userDTO";
import { type IUserRepository, UserRepository } from "../../repositories/userRepository";
import { UpdateUserRoleUseCase } from "../../useCases/user/updateUserRoleUseCase";

export interface IUserService {
  updateUserRole({ userId, role }: { userId: string; role: string }): Promise<IUserDTO>;
  getUserById(userId: string): Promise<IUserDTO>;
}

export class UserService implements IUserService {
  private _updateUserRoleUseCase: UpdateUserRoleUseCase;
  private _userRepository: IUserRepository;
  private _userMapper: IUserMapper;

  public constructor(
    updateUserRoleUseCase = new UpdateUserRoleUseCase(),
    userRepository: IUserRepository = new UserRepository(),
    userMapper: IUserMapper = new UserMapper()
  ) {
    this._updateUserRoleUseCase = updateUserRoleUseCase;
    this._userRepository = userRepository;
    this._userMapper = userMapper;
  }

  public async updateUserRole({
    userId,
    role
  }: { userId: string; role: string }): Promise<IUserDTO> {
    return this._updateUserRoleUseCase.execute({ userId, role });
  }

  public async getUserById(userId: string): Promise<IUserDTO> {
    const user = await this._userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found!");
    }

    return this._userMapper.toDTO(user);
  }
}
