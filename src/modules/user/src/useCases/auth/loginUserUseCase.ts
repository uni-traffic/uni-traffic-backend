import { UnauthorizedError } from "../../../../../shared/core/errors";
import { BycryptPassword, type IHashAlgorithm } from "../../../../../shared/lib/bycrypt";
import { type IJSONWebToken, JSONWebToken } from "../../../../../shared/lib/jsonWebToken";
import type { IUser } from "../../domain/models/user/classes/user";
import type { LoginRequest } from "../../dtos/userRequestSchema";
import { type IUserRepository, UserRepository } from "../../repositories/userRepository";

export class LoginUserUseCase {
  private _jsonWebToken: IJSONWebToken;
  private _hashAlgorithm: IHashAlgorithm;
  private _userRepository: IUserRepository;

  public constructor(
    jsonWebToken: IJSONWebToken = new JSONWebToken(),
    hasAlgorithm: IHashAlgorithm = new BycryptPassword(),
    userRepository: IUserRepository = new UserRepository()
  ) {
    this._jsonWebToken = jsonWebToken;
    this._hashAlgorithm = hasAlgorithm;
    this._userRepository = userRepository;
  }

  public async execute({
    username,
    password
  }: LoginRequest): Promise<{ accessToken: string; role: string }> {
    const verifiedUser = await this._verifyUser(username, password);
    const accessToken = this._getSignedAccessToken(verifiedUser.id);

    return { accessToken, role: verifiedUser.role };
  }

  private async _verifyUser(username: string, password: string): Promise<IUser> {
    const userOrNull = await this._userRepository.getUserByUsername(username);
    if (!userOrNull || !(await this._isPasswordValid(password, userOrNull.password))) {
      throw new UnauthorizedError("The username or password provided is incorrect.");
    }

    return userOrNull;
  }

  private async _isPasswordValid(rawPassword: string, hashedPassword: string): Promise<boolean> {
    return await this._hashAlgorithm.verifyHash(rawPassword, hashedPassword);
  }

  private _getSignedAccessToken(userId: string): string {
    return this._jsonWebToken.sign({ id: userId });
  }
}
