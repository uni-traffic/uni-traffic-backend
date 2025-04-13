import { v4 as uuid } from "uuid";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import type { IUserSignInActivityRawObject } from "../../src/domain/models/userSignInActivity/constant";

export const seedUserSignInActivity = async ({
  id = uuid(),
  userId,
  time = new Date()
}: Partial<IUserSignInActivityRawObject>) => {
  return db.userSignInActivity.create({
    data: {
      id,
      time,
      userId: userId ? userId : (await seedUser({})).id
    }
  });
};
