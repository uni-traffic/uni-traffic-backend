import { v4 as uuid } from "uuid";
import type { IUserViolation } from "../../../src/domain/models/userViolation/classes/userViolation";
import type { IUserViolationRawObject } from "../../../src/domain/models/userViolation/constant";
import { UserViolationFactory } from "../../../src/domain/models/userViolation/factory";

export const createUserViolationDomainObject = ({
  id = uuid(),
  userId = uuid(),
  reportedById = uuid(),
  violationId = uuid(),
  vehicleId = uuid()
}: Partial<IUserViolationRawObject>): IUserViolation => {
  const userViolationOrError = UserViolationFactory.create({
    id,
    userId,
    reportedById,
    violationId,
    vehicleId
  });

  return userViolationOrError.getValue();
};
