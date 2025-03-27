import { v4 as uuid } from "uuid";
import type { IUserSignInActivityRawObject } from "../../src/domain/models/userSignInActivity/constant";
import { createUserPersistenceData } from "../../../user/tests/utils/user/createUserPersistenceData";

export const createUserSignInActivityPersistenceData = ({
  id = uuid(),
  userId = uuid(),
  time = new Date(),
  user = createUserPersistenceData({}),
}: Partial<IUserSignInActivityRawObject>): IUserSignInActivityRawObject => {
  return {
    id,
    userId,
    time,
    user,
  };
};
