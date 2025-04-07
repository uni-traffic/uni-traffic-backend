import type { IUserDTO } from "../../../../../../user/src/dtos/userDTO";

export interface IUserSignInActivity {
  id: string;
  userId: string;
  time: Date;
  user: IUserDTO | null;
}

export class UserSignInActivity implements IUserSignInActivity {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _time: Date;
  private readonly _user: IUserDTO | null;

  private constructor({ id, userId, time, user }: IUserSignInActivity) {
    this._id = id;
    this._userId = userId;
    this._time = time;
    this._user = user ?? null;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get time(): Date {
    return this._time;
  }

  get user(): IUserDTO | null {
    return this._user;
  }

  public static create(props: IUserSignInActivity): UserSignInActivity {
    return new UserSignInActivity(props);
  }
}
