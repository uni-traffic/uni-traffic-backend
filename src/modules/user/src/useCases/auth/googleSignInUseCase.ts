import type { TokenPayload } from "google-auth-library";
import { defaultTo } from "rambda";
import { BadRequest, UnexpectedError } from "../../../../../shared/core/errors";
import { AppKeys, type IAppKeys } from "../../../../../shared/lib/appKey";
import { BycryptPassword, type IHashAlgorithm } from "../../../../../shared/lib/bycrypt";
import { GoogleOAuth } from "../../../../../shared/lib/googleOAuth";
import { type IJSONWebToken, JSONWebToken } from "../../../../../shared/lib/jsonWebToken";
import type { IUser } from "../../domain/models/user/classes/user";
import { UserFactory } from "../../domain/models/user/factory";
import { type IUserMapper, UserMapper } from "../../domain/models/user/mapper";
import type { IUserLoginResponse } from "../../dtos/userDTO";
import type { GoogleSignInRequest } from "../../dtos/userRequestSchema";
import { type IUserRepository, UserRepository } from "../../repositories/userRepository";

export class GoogleSignInUseCase {
  private _userRepository: IUserRepository;
  private _hashAlgorithm: IHashAlgorithm;
  private _jsonWebToken: IJSONWebToken;
  private _userMapper: IUserMapper;
  private _appKeys: IAppKeys;
  private _googleAuthClient: GoogleOAuth;

  public constructor(
    userRepository: IUserRepository = new UserRepository(),
    jsonWebToken: IJSONWebToken = new JSONWebToken(),
    userMapper: IUserMapper = new UserMapper(),
    appKeys: IAppKeys = new AppKeys(),
    googleAuthClient: GoogleOAuth = new GoogleOAuth(),
    hashAlgorithm: IHashAlgorithm = new BycryptPassword()
  ) {
    this._userRepository = userRepository;
    this._jsonWebToken = jsonWebToken;
    this._userMapper = userMapper;
    this._appKeys = appKeys;
    this._googleAuthClient = googleAuthClient;
    this._hashAlgorithm = hashAlgorithm;
  }

  public async execute({ token, clientType }: GoogleSignInRequest): Promise<IUserLoginResponse> {
    const payload = await this._verifyToken(token, clientType);
    const user =
      (await this._findUserByEmail(payload.email)) ?? (await this._registerNewUser(payload));
    const accessToken = this._generateToken(user.id);

    return this._buildResponse(accessToken, user);
  }

  private async _verifyToken(token: string, clientType: "WEB" | "MOBILE"): Promise<TokenPayload> {
    return this._googleAuthClient.getPayloadFromToken(token, clientType);
  }

  private async _findUserByEmail(email?: string): Promise<IUser | null> {
    if (!email) throw new UnexpectedError("No email address found in token payload");

    return this._userRepository.getUserByEmail(email);
  }

  private async _registerNewUser(payload: TokenPayload): Promise<IUser> {
    if (!payload.email) throw new UnexpectedError("No email address found in token payload");

    const accountFirstName = payload.given_name || payload.name || payload.email.split("@")[0];
    const userOrError = UserFactory.create({
      username: payload.email.toLowerCase(),
      firstName: defaultTo("", accountFirstName),
      lastName: defaultTo("", payload.family_name),
      email: payload.email,
      password: await this._hashAlgorithm.generateHash("ToBeRemoved")
    });
    if (userOrError.isFailure) {
      throw new BadRequest(userOrError.getErrorMessage()!);
    }

    const savedUser = await this._userRepository.createUser(userOrError.getValue());
    if (!savedUser) {
      throw new UnexpectedError("Failed to save user");
    }

    return savedUser;
  }

  private _generateToken(userId: string): string {
    return this._jsonWebToken.sign({ id: userId });
  }

  private _buildResponse(accessToken: string, user: IUser): IUserLoginResponse {
    return {
      user: this._userMapper.toDTO(user),
      appKey: this._appKeys.plateRecognizerKey,
      accessToken
    };
  }
}
