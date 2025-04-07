import { v4 as uuid } from "uuid";
import { UserSignInActivity } from "../../src/domain/models/userSignInActivity/classes/userSignInActivity";
import { UserSignInActivityFactory } from "../../src/domain/models/userSignInActivity/factory";
import type { IUserSignInActivityRawObject } from "../../src/domain/models/userSignInActivity/constant";
import { createUserPersistenceData } from "../../../user/tests/utils/user/createUserPersistenceData";

export const createUserSignInActivityDomainObject = ({
  id = uuid(),
  userId = uuid(),
  time = new Date(),
  user = createUserPersistenceData({}),
}: Partial<IUserSignInActivityRawObject>): UserSignInActivity => {
  const userSignInActivityOrError = UserSignInActivityFactory.create({
    id,
    userId,
    time,
    user,
  });

  if (userSignInActivityOrError.isFailure) {
    throw new Error(userSignInActivityOrError.getErrorMessage()!);
  }

  return userSignInActivityOrError.getValue();
};
