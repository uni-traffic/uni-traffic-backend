import { db } from "../../../../../shared/infrastructure/database/prisma";
import { UserSignInActivityRepository } from "../../../src/repositories/userSignInActivityRepository";
import { UserSignInActivityFactory } from "../../../src/domain/models/userSignInActivity/factory";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import { faker } from "@faker-js/faker";
import type { Result } from "../../../../../shared/core/result";
import type { UserSignInActivity } from "../../../src/domain/models/userSignInActivity/classes/userSignInActivity";

describe("UserSignInActivityRepository.create", () => {
  let repository: UserSignInActivityRepository;

  beforeAll(() => {
    repository = new UserSignInActivityRepository();
  });

  beforeEach(async () => {
    await db.userSignInActivity.deleteMany();
    await db.user.deleteMany();
  });

  it("should create a new sign-in activity", async () => {
    const user = await seedUser({});

    const activityOrError: Result<UserSignInActivity> = UserSignInActivityFactory.create({
      id: faker.string.uuid(),
      userId: user.id,
      time: new Date()
    });

    if (activityOrError.isFailure) {
      throw new Error("Failed to create test activity");
    }

    const activity = activityOrError.getValue();
    const createdActivity = await repository.create(activity);

    expect(createdActivity).toBeDefined();
    expect(createdActivity.userId).toBe(user.id);

    const dbActivity = await db.userSignInActivity.findUnique({
      where: { id: createdActivity.id }
    });
    expect(dbActivity).toBeTruthy();
  });
});
