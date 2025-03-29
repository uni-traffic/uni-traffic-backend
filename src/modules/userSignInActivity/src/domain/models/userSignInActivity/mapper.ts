import { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import type { IUserSignInActivityDTO } from "../../../dtos/userSignInActivityDTO";
import type { UserSignInActivity } from "./classes/userSignInActivity";
import type { IUserSignInActivityRawObject, IUserSignInActivitySchema } from "./constant";
import { UserSignInActivityFactory } from "./factory";
import { defaultTo } from "rambda";

export interface IUserSignInActivityMapper {
  toPersistence(activity: UserSignInActivity): IUserSignInActivitySchema;
  toDomain(raw: IUserSignInActivityRawObject & { user?: IUserDTO | null }): UserSignInActivity;
  toDTO(activity: UserSignInActivity): IUserSignInActivityDTO;
}

export class UserSignInActivityMapper implements IUserSignInActivityMapper {
  public toPersistence(activity: UserSignInActivity): IUserSignInActivitySchema {
    return {
      id: activity.id,
      userId: activity.userId,
      time: activity.time,
    };
  }

  public toDomain(raw: IUserSignInActivityRawObject & { user?: IUserDTO | null }): UserSignInActivity {
    return UserSignInActivityFactory.create(raw).getValue();
  }

  public toDTO(activity: UserSignInActivity): IUserSignInActivityDTO {
    return {
      id: activity.id,
      userId: activity.userId,
      time: activity.time,
      user: defaultTo(null, activity.user),
    };
  }
}
