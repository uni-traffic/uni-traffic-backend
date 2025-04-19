import { NotFoundError } from "../../../../../shared/core/errors";
import type { IUser } from "../../domain/models/user/classes/user";
import { type IUserMapper, UserMapper } from "../../domain/models/user/mapper";
import type { GetUserResponse, GetUserUseCasePayload } from "../../dtos/userDTO";
import type { GetUserRequest } from "../../dtos/userRequestSchema";
import { type IUserRepository, UserRepository } from "../../repositories/userRepository";

export class GetUserUseCase {
  private _userRepository: IUserRepository;
  private _userMapper: IUserMapper;

  public constructor(
    userRepository: IUserRepository = new UserRepository(),
    userMapper: IUserMapper = new UserMapper()
  ) {
    this._userRepository = userRepository;
    this._userMapper = userMapper;
  }

  public async execute(payload: GetUserRequest): Promise<GetUserResponse> {
    const refinedParams = this._refineParams(payload);
    const users = await this._getUser(refinedParams);
    const totalUserCount = await this._getTotalCount(refinedParams);
    const totalPages = this._getTotalPages(refinedParams.count, totalUserCount);
    const hasNextPage = this._hasNextPage(refinedParams.count, refinedParams.page, totalUserCount);

    return {
      user: users.map((user) => this._userMapper.toDTO(user)),
      hasNextPage,
      hasPreviousPage: refinedParams.page > 1,
      totalPages
    };
  }

  private _refineParams(params: GetUserRequest): GetUserUseCasePayload {
    return {
      ...params,
      sort: params.sort ? (params.sort === "2" ? 2 : 1) : params.sort,
      count: Number(params.count),
      page: Number(params.page)
    };
  }

  private async _getUser(params: GetUserUseCasePayload): Promise<IUser[]> {
    const user = await this._userRepository.getUser(params);
    if (user.length === 0) {
      throw new NotFoundError("User Not Found.");
    }

    return user;
  }

  private _getTotalCount(params: GetUserUseCasePayload): Promise<number> {
    return this._userRepository.getTotalUser(params);
  }

  private _hasNextPage(count: number, page: number, totalUserCount: number): boolean {
    return page * count < totalUserCount;
  }

  private _getTotalPages(countPerPage: number, totalUser: number): number {
    return Math.ceil(totalUser / countPerPage);
  }
}
