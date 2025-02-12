import { Role } from "@prisma/client";
import { UserEmail } from "../classes/userEmail";

export interface IUser {
	id: string;
	username: string;
	email: UserEmail;
	emailValue: string;
	password: string;
	isSuperAdmin: boolean;
	role: Role;
	isDeleted: boolean;
	deletedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export class User implements IUser {
	private readonly _id: string;
	private readonly _username: string;
	private readonly _email: UserEmail;
	private readonly _password: string;
	private readonly _isSuperAdmin: boolean;
	private readonly _role: Role;
	private readonly _isDeleted: boolean;
	private readonly _deletedAt: Date | null;
	private readonly _createdAt: Date;
	private readonly _updatedAt: Date;

	private constructor({
		id,
		username,
		email,
		password,
		isSuperAdmin,
		role,
		isDeleted,
		deletedAt,
		createdAt,
		updatedAt,
	}: {
		id: string;
		username: string;
		email: UserEmail;
		password: string;
		isSuperAdmin: boolean;
		role: Role;
		isDeleted: boolean;
		deletedAt: Date | null;
		createdAt: Date;
		updatedAt: Date;
	}) {
		this._id = id;
		this._username = username;
		this._email = email;
		this._password = password;
		this._isSuperAdmin = isSuperAdmin;
		this._role = role;
		this._isDeleted = isDeleted;
		this._deletedAt = deletedAt;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
	}

	get id(): string {
		return this._id;
	}

	get username(): string {
		return this._username;
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

	get isDeleted(): boolean {
		return this._isDeleted;
	}

	get deletedAt(): Date | null {
		return this._deletedAt;
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
		email,
		password,
		isSuperAdmin,
		role,
		isDeleted,
		deletedAt,
		createdAt,
		updatedAt,
	}: {
		id: string;
		username: string;
		email: UserEmail;
		password: string;
		isSuperAdmin: boolean;
		role: Role;
		isDeleted: boolean;
		deletedAt: Date | null;
		createdAt: Date;
		updatedAt: Date;
	}): IUser {
		return new User({
			id,
			username,
			email,
			password,
			isSuperAdmin,
			role,
			isDeleted,
			deletedAt,
			createdAt,
			updatedAt,
		});
	}
}
