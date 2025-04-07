import { v4 as uuid } from "uuid";
import { Result } from "../../../../../../shared/core/result";
import { UserSignInActivity } from "./classes/userSignInActivity";
import type { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import { defaultTo } from "rambda";

export interface IUserSignInActivityFactoryProps {
  id?: string;
  userId: string;
  time?: Date;
  user?: IUserDTO | null; 
}

export class UserSignInActivityFactory {
  public static create(props: IUserSignInActivityFactoryProps): Result<UserSignInActivity> {
    return Result.ok<UserSignInActivity>(
      UserSignInActivity.create({
        id: defaultTo(uuid(), props.id),
        userId: props.userId,
        time: defaultTo(new Date(), props.time),
        user: props.user ?? null,
      })
    );
  }
}
