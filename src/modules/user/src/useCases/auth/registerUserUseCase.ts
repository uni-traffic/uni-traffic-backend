import { BadRequest, ConflictError, UnexpectedError } from "../../../../../shared/core/errors";
import { BycryptPassword, type IHashAlgorithm } from "../../../../../shared/lib/bycrypt";
import type { IUser } from "../../domain/models/user/classes/user";
import { type IUserFactoryProps, UserFactory } from "../../domain/models/user/factory";
import { type IUserMapper, UserMapper } from "../../domain/models/user/mapper";
import type { IUserDTO } from "../../dtos/userDTO";
import type { RegisterRequest } from "../../dtos/userRequestSchema";
import { type IUserRepository, UserRepository } from "../../repositories/userRepository";

export class RegisterUserUseCase {
  private _userMapper: IUserMapper;
  private _hashAlgorithm: IHashAlgorithm;
  private _userRepository: IUserRepository;

  public constructor(
    userMapper: IUserMapper = new UserMapper(),
    hashAlgorithm: IHashAlgorithm = new BycryptPassword(),
    userRepository: IUserRepository = new UserRepository()
  ) {
    this._userMapper = userMapper;
    this._hashAlgorithm = hashAlgorithm;
    this._userRepository = userRepository;
  }

  public async execute({
    username,
    password,
    email,
    firstName,
    lastName,
    role
  }: RegisterRequest): Promise<IUserDTO> {
    await this._ensureCredentialsAreUnique(username, email);

    const hashedPassword = await this._hasUserPassword(password);
    const user = this._createUserDomain({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      role
    });
    const savedUser = await this._saveUserToDatabase(user);

    return this._userMapper.toDTO(savedUser);
  }

  private async _ensureCredentialsAreUnique(username: string, email: string): Promise<void> {
    const isUsernameAlreadyTaken = await this._userRepository.isUsernameAlreadyTaken(username);
    if (isUsernameAlreadyTaken) {
      throw new ConflictError("The username is unavailable.");
    }

    const isEmailAlreadyTaken = await this._userRepository.isEmailAlreadyTaken(email);
    if (isEmailAlreadyTaken) {
      throw new ConflictError("An account with this email already exists.");
    }
  }

  private async _hasUserPassword(rawPassword: string): Promise<string> {
    return await this._hashAlgorithm.generateHash(rawPassword);
  }

  private _createUserDomain({
    username,
    firstName,
    lastName,
    email,
    password,
    role
  }: IUserFactoryProps): IUser {
    const userOrError = UserFactory.create({
      username,
      firstName,
      lastName,
      email,
      password,
      role
    });
    if (userOrError.isFailure) {
      throw new BadRequest(userOrError.getErrorMessage()!);
    }

    return userOrError.getValue();
  }

  private async _saveUserToDatabase(user: IUser): Promise<IUser> {
    const savedUserOrNull = await this._userRepository.createUser(user);
    if (!savedUserOrNull) {
      throw new UnexpectedError("Failed to save User to database");
    }

    return savedUserOrNull;
  }
}
