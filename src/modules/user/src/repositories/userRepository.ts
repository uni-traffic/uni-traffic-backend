import type { IUser } from "../domain/models/user/classes/user";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { type IUserMapper, UserMapper } from "../domain/models/user/mapper";
import type { GetUserRequest } from "../dtos/userRequestSchema";

export interface IUserRepository {
  getUserByUsername(username: string): Promise<IUser | null>;
  getUserById(userId: string): Promise<IUser | null>;
  getUsersByIds(userIds: string[]): Promise<IUser[]>;
  getUserByProperty(params: GetUserRequest): Promise<IUser[]>;
  isUsernameAlreadyTaken(username: string): Promise<boolean>;
  isEmailAlreadyTaken(email: string): Promise<boolean>;
  createUser(user: IUser): Promise<IUser | null>;
  createUsers(users: IUser[]): Promise<IUser[]>;
}

export class UserRepository implements IUserRepository {
  private _database;
  private _userMapper: IUserMapper;

  public constructor(database = db, userMapper = new UserMapper()) {
    this._database = database;
    this._userMapper = userMapper;
  }

  public async getUserByUsername(username: string): Promise<IUser | null> {
    try {
      const userRaw = await this._database.user.findUniqueOrThrow({
        where: {
          username: username
        }
      });

      return this._userMapper.toDomain(userRaw);
    } catch {
      return null;
    }
  }

  public async getUserById(userId: string): Promise<IUser | null> {
    const users = await this.getUsersByIds([userId]);

    if (users.length === 0) {
      return null;
    }

    return users[0];
  }

  public async getUsersByIds(userIds: string[]): Promise<IUser[]> {
    const usersRaw = await this._database.user.findMany({
      where: {
        id: {
          in: userIds
        },
        isDeleted: false
      }
    });

    return usersRaw.map((user) => this._userMapper.toDomain(user));
  }

  public async isUsernameAlreadyTaken(username: string): Promise<boolean> {
    const foundUser = await this._database.user.findUnique({
      where: {
        username: username
      }
    });

    return !!foundUser;
  }

  public async isEmailAlreadyTaken(email: string): Promise<boolean> {
    const foundUser = await this._database.user.findUnique({
      where: {
        email: email
      }
    });

    return !!foundUser;
  }

  public async createUser(role: IUser): Promise<IUser | null> {
    const userDomain = await this.createUsers([role]);

    if (userDomain.length === 0) {
      return null;
    }

    return userDomain[0];
  }

  public async createUsers(roles: IUser[]): Promise<IUser[]> {
    try {
      const userPersistence = await this._database.$transaction(
        roles.map((role) => {
          return this._database.user.create({
            data: this._userMapper.toPersistence(role)
          });
        })
      );

      return userPersistence.map((role) => this._userMapper.toDomain(role));
    } catch {
      return [];
    }
  }

  public async getUserByProperty(params: GetUserRequest): Promise<IUser[]> {
    const { id, firstName, lastName, username, email, role } = params;
    if (!id && !firstName && !lastName && !username && !email && !role) {
      return [];
    }

    try {
      const userPropertyDetails = await this._database.user.findMany({
        where: {
          ...{ id: id || undefined },
          ...{ firstName: firstName || undefined },
          ...{ lastName: lastName || undefined },
          ...{ username: username || undefined },
          ...{ email: email || undefined },
          ...{ role: role || undefined }
        }
      });
      return userPropertyDetails.map((userDetails) => this._userMapper.toDomain(userDetails));
    } catch {
      return [];
    }
  }
}
