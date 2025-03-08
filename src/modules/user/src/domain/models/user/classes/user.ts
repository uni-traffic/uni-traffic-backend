import type { UserDeletionStatus } from "./userDeletionStatus";
import type { UserEmail } from "./userEmail";
import type { UserName } from "./userName";
import type { UserRole } from "./userRole";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  isSuperAdmin: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  email: UserEmail;
  username: UserName;
  userDeletionStatus: UserDeletionStatus;
  updateRole(newRole: UserRole): void;
}

export class User implements IUser {
  private readonly _id: string;
  private readonly _firstName: string;
  private readonly _lastName: string;
  private readonly _password: string;
  private readonly _isSuperAdmin: boolean;
  private _role: UserRole;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;
  private readonly _email: UserEmail;
  private readonly _username: UserName;
  private readonly _userDeletionStatus: UserDeletionStatus;

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
    role: UserRole;
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

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): UserEmail {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get isSuperAdmin(): boolean {
    return this._isSuperAdmin;
  }

  get role(): UserRole {
    return this._role;
  }

  get userDeletionStatus(): UserDeletionStatus {
    return this._userDeletionStatus;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public updateRole(newRole: UserRole): void {
    this._role = newRole;
  }

  public static create(props: {
    id: string;
    username: UserName;
    firstName: string;
    lastName: string;
    email: UserEmail;
    password: string;
    isSuperAdmin: boolean;
    role: UserRole;
    userDeletionStatus: UserDeletionStatus;
    createdAt: Date;
    updatedAt: Date;
  }): IUser {
    return new User(props);
  }
}
