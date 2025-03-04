import { NotFoundError } from "../../../../../shared/core/errors";
import type { IUser } from "../../domain/models/user/classes/user";
import { type IUserMapper, UserMapper } from "../../domain/models/user/mapper";
import type { IUserDTO } from "../../dtos/userDTO";
import type { GetUserRequestSchema } from "../../dtos/userRequestSchema";
import { type IUserRepository, UserRepository } from "../../repositories/userRepository";

export class GetUserByPropertyUseCase {
  private _userRepository: IUserRepository;
  private _userMapper: IUserMapper;

  public constructor(
    userRepository: IUserRepository = new UserRepository(),
    userMapper: IUserMapper = new UserMapper()
  ) {
    this._userRepository = userRepository;
    this._userMapper = userMapper;
  }

  public async execute(payload: GetUserRequestSchema): Promise<IUserDTO[]> {
    const userDetails = await this._getUserByPropertyDetails(payload);

    return userDetails.map((user) => this._userMapper.toDTO(user));
  }

  public async _getUserByPropertyDetails(payload: GetUserRequestSchema): Promise<IUser[]> {
    const userDetails = await this._userRepository.getUserByProperty(payload);

    if (!userDetails || userDetails.length === 0) {
      throw new NotFoundError("User Not Found");
    }

    return userDetails;
  }
}
