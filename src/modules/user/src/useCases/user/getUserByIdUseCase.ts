import { NotFoundError } from "../../../../../shared/core/errors";
import type { IUser } from "../../domain/models/user/classes/user";
import { type IUserMapper, UserMapper } from "../../domain/models/user/mapper";
import { type IUserRepository, UserRepository } from "../../repositories/userRepository";

export class GetUserByIdUseCase {
  private _userRepository: IUserRepository;
  private _userMapper: IUserMapper;

  public constructor(
    userRepository: IUserRepository = new UserRepository(),
    userMapper: IUserMapper = new UserMapper()
  ) {
    this._userRepository = userRepository;
    this._userMapper = userMapper;
  }

  public async execute(id: string) {
    const user = await this._getUserFromData(id);

    return this._userMapper.toDTO(user);
  }

  private async _getUserFromData(id: string): Promise<IUser> {
    const user = await this._userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundError("User Not Found");
    }

    return user;
  }
}
