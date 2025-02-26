import { defaultTo } from "rambda";
import { v4 as uuid } from "uuid";
import { Result } from "../../../../../../shared/core/result";
import { type IUserViolation, UserViolation } from "./classes/userViolation";

export interface IUserViolationFactoryProps {
  id?: string;
  userId: string;
  reportedById: string;
  violationId: string;
  vehicleId: string;
}

export class UserViolationFactory {
  public static create(
    userViolationFactoryProps: IUserViolationFactoryProps
  ): Result<IUserViolation> {
    return Result.ok<IUserViolation>(
      UserViolation.create({
        ...userViolationFactoryProps,
        id: defaultTo(uuid(), userViolationFactoryProps.id)
      })
    );
  }
}
