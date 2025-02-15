import type { Role } from "@prisma/client";
import type { IUserDeletionStatus, UserDeletionStatus } from "./userDeletionStatus";
import type { UserEmail } from "./userEmail";
import type { UserName } from "./userName";

export interface IUser {
  id: string;
  username: UserName;
  usernameValue: string;
  firstName: string;
  lastName: string;
  email: UserEmail;
  emailValue: string;
  password: string;
  isSuperAdmin: boolean;
  role: Role;
  userDeletionStatus: UserDeletionStatus;
  userDeletionStatusValue: IUserDeletionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class User implements IUser {
  private readonly _id: string;
  private readonly _username: UserName;
  private readonly _firstName: string;
  private readonly _lastName: string;
  private readonly _email: UserEmail;
  private readonly _password: string;
  private readonly _isSuperAdmin: boolean;
  private readonly _role: Role;
  private readonly _userDeletionStatus: UserDeletionStatus;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor({
    id,
    username,
    firstName,
    lastName,
    email,
    password,
    isSuperAdmin,
    role,
    userDeletionStatus,
    createdAt,
    updatedAt
  }: {
    id: string;
    username: UserName;
    firstName: string;
    lastName: string;
    email: UserEmail;
    password: string;
    isSuperAdmin: boolean;
    role: Role;
    userDeletionStatus: UserDeletionStatus;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = id;
    this._username = username;
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._password = password;
    this._isSuperAdmin = isSuperAdmin;
    this._role = role;
    this._userDeletionStatus = userDeletionStatus;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string {
    return this._id;
  }

  get username(): UserName {
    return this._username;
  }

  get usernameValue(): string {
    return this._username.value;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): UserEmail {
    return this._email;
  }

  get emailValue(): string {
    return this._email.value;
  }

  get password(): string {
    return this._password;
  }

  get isSuperAdmin(): boolean {
    return this._isSuperAdmin;
  }

  get role(): Role {
    return this._role;
  }

  get userDeletionStatus(): UserDeletionStatus {
    return this._userDeletionStatus;
  }

  get userDeletionStatusValue(): IUserDeletionStatus {
    return {
      isDeleted: this._userDeletionStatus.isDeleted,
      deletedAt: this._userDeletionStatus.deletedAt
    };
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public static create({
    id,
    username,
    firstName,
    lastName,
    email,
    password,
    isSuperAdmin,
    role,
    userDeletionStatus,
    createdAt,
    updatedAt
  }: {
    id: string;
    username: UserName;
    firstName: string;
    lastName: string;
    email: UserEmail;
    password: string;
    isSuperAdmin: boolean;
    role: Role;
    userDeletionStatus: UserDeletionStatus;
    createdAt: Date;
    updatedAt: Date;
  }): IUser {
    return new User({
      id,
      username,
      firstName,
      lastName,
      email,
      password,
      isSuperAdmin,
      role,
      userDeletionStatus,
      createdAt,
      updatedAt
    });
  }
}
