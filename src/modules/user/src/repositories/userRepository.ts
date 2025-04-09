import type { Role } from "@prisma/client";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IUser } from "../domain/models/user/classes/user";
import { type IUserMapper, UserMapper } from "../domain/models/user/mapper";
import type { GetUserByPropertyUseCasePayload } from "../dtos/userDTO";

export interface IUserRepository {
  getUserByUsername(username: string): Promise<IUser | null>;
  getUserById(userId: string): Promise<IUser | null>;
  getUsersByIds(userIds: string[]): Promise<IUser[]>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByProperty(params: GetUserByPropertyUseCasePayload): Promise<IUser[]>;
  isUsernameAlreadyTaken(username: string): Promise<boolean>;
  isEmailAlreadyTaken(email: string): Promise<boolean>;
  createUser(user: IUser): Promise<IUser | null>;
  createUsers(users: IUser[]): Promise<IUser[]>;
  updateUser(user: IUser): Promise<IUser | null>;
  getTotalUserCount(roles?: Role[]): Promise<number>; 
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

  public async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const usersRaw = await this._database.user.findUniqueOrThrow({
        where: {
          email: email,
          isDeleted: false
        }
      });

      return this._userMapper.toDomain(usersRaw);
    } catch {
      return null;
    }
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

  public async updateUser(user: IUser): Promise<IUser | null> {
    try {
      const userPersistence = this._userMapper.toPersistence(user);
      const savedUser = await this._database.user.update({
        where: {
          id: userPersistence.id
        },
        data: userPersistence
      });

      return this._userMapper.toDomain(savedUser);
    } catch {
      return null;
    }
  }

  /** TODO:
   * Implement a search that matches records where:
   * - The given id, firstName, lastName, username, or email
   *   matches any record containing the provided value in the corresponding property.
   */
  public async getUserByProperty(params: GetUserByPropertyUseCasePayload): Promise<IUser[]> {
    const { id, firstName, lastName, username, email, role, count, page } = params;

    try {
      const userPropertyDetails = await this._database.user.findMany({
        skip: count * (page - 1),
        take: count * page,
        where: {
          ...{ id: id || undefined },
          ...{ firstName: firstName || undefined },
          ...{ lastName: lastName || undefined },
          ...{ username: username || undefined },
          ...{ email: email || undefined },
          ...{ role: (role as Role) || undefined }
        }
      });
      return userPropertyDetails.map((userDetails) => this._userMapper.toDomain(userDetails));
    } catch {
      return [];
    }
  }

  public async getTotalUserCount(roles?: Role[]): Promise<number> {
    const userCount = await this._database.user.count({
        where: {
            ...(roles ? { role: { in: roles } } : {}),
            isDeleted: false 
        }
    });
    return userCount;
  }
}
