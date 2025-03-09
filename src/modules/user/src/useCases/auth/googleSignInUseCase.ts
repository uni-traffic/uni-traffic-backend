import type { TokenPayload } from "google-auth-library";
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
    const tokenPayload = await this._getTokenPayload(token, clientType);
    const user = await this._getUserFromDatabase(tokenPayload.email!);
    const finalUser = user ? user : await this._createAndSaveUserToDatabase(tokenPayload);
    const signedToken = this._getSignedAccessToken(finalUser.id);

    return this._generateResponseData(signedToken, finalUser);
  }

  private async _getTokenPayload(
    token: string,
    clientType: "WEB" | "MOBILE"
  ): Promise<TokenPayload> {
    return this._googleAuthClient.getPayloadFromToken(token, clientType);
  }

  private async _getUserFromDatabase(email: string): Promise<IUser | null> {
    return this._userRepository.getUserByEmail(email);
  }

  private async _createAndSaveUserToDatabase({
    email,
    given_name,
    family_name
  }: TokenPayload): Promise<IUser> {
    if (!email || !given_name || !family_name) throw new Error("");
    const newUser = await this._createUserDomain({ email, given_name, family_name });

    return await this._saveUserToDatabase(newUser);
  }

  private async _createUserDomain({
    email,
    given_name,
    family_name
  }: {
    email: string;
    given_name: string;
    family_name: string;
  }): Promise<IUser> {
    const userOrError = UserFactory.create({
      username: `${email}`.toLowerCase(),
      firstName: given_name,
      lastName: family_name,
      email: email,
      password: await this._hasUserPassword("ToBeRemoved")
    });
    if (userOrError.isFailure) {
      throw new BadRequest(userOrError.getErrorMessage()!);
    }

    return userOrError.getValue();
  }

  private async _hasUserPassword(rawPassword: string): Promise<string> {
    return await this._hashAlgorithm.generateHash(rawPassword);
  }

  private async _saveUserToDatabase(user: IUser): Promise<IUser> {
    const savedUserOrNull = await this._userRepository.createUser(user);
    if (!savedUserOrNull) {
      throw new UnexpectedError("Failed to save User to database");
    }

    return savedUserOrNull;
  }
  private _getSignedAccessToken(userId: string): string {
    return this._jsonWebToken.sign({ id: userId });
  }

  private _generateResponseData(accessToken: string, user: IUser): IUserLoginResponse {
    const userDTO = this._userMapper.toDTO(user);
    const plateRecognizerKey = this._appKeys.plateRecognizerKey;

    return {
      user: userDTO,
      appKey: plateRecognizerKey,
      accessToken: accessToken
    };
  }
}
