import type { Prisma, Role } from "@prisma/client";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IUser } from "../domain/models/user/classes/user";
import { type IUserMapper, UserMapper } from "../domain/models/user/mapper";
import type { GetUserUseCasePayload, UserWhereClauseParams } from "../dtos/userDTO";

export interface IUserRepository {
  getUserByUsername(username: string): Promise<IUser | null>;
  getUserById(userId: string): Promise<IUser | null>;
  getUsersByIds(userIds: string[]): Promise<IUser[]>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUser(params: GetUserUseCasePayload): Promise<IUser[]>;
  isUsernameAlreadyTaken(username: string): Promise<boolean>;
  isEmailAlreadyTaken(email: string): Promise<boolean>;
  createUser(user: IUser): Promise<IUser | null>;
  createUsers(users: IUser[]): Promise<IUser[]>;
  updateUser(user: IUser): Promise<IUser | null>;
  getTotalUser(params: UserWhereClauseParams): Promise<number>;
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

  public async getTotalUserCount(roles?: Role[]): Promise<number> {
    const userCount = await this._database.user.count({
      where: {
        ...(roles ? { role: { in: roles } } : {}),
        isDeleted: false
      }
    });
    return userCount;
  }

  public async getTotalUser(params: UserWhereClauseParams): Promise<number> {
    return this._database.user.count({
      where: this._generateWhereClause(params)
    });
  }

  public async getUser(params: GetUserUseCasePayload): Promise<IUser[]> {
    const userRaw = await this._database.user.findMany({
      where: this._generateWhereClause(params),
      orderBy: {
        username: params.sort === 2 ? "desc" : "asc"
      },
      skip: params.count * (params.page - 1),
      take: params.count
    });

    return userRaw.map((user) => this._userMapper.toDomain(user));
  }

  private _generateWhereClause(params: UserWhereClauseParams): Prisma.UserWhereInput {
    return params.searchKey
      ? {
          OR: [
            { id: { contains: params.searchKey, mode: "insensitive" } },
            { firstName: { contains: params.searchKey, mode: "insensitive" } },
            { lastName: { contains: params.searchKey, mode: "insensitive" } },
            { username: { contains: params.searchKey, mode: "insensitive" } },
            { email: { contains: params.searchKey, mode: "insensitive" } }
          ],
          role: params.role as Role
        }
      : {
          id: params.id,
          firstName: params.firstName,
          lastName: params.lastName,
          username: params.userName,
          email: params.email,
          role: params.role as Role
        };
  }
}
