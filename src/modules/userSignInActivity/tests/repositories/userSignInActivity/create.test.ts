import { faker } from "@faker-js/faker";
import type { Result } from "../../../../../shared/core/result";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import type { UserSignInActivity } from "../../../src/domain/models/userSignInActivity/classes/userSignInActivity";
import { UserSignInActivityFactory } from "../../../src/domain/models/userSignInActivity/factory";
import { UserSignInActivityRepository } from "../../../src/repositories/userSignInActivityRepository";
import { createUserSignInActivityDomainObject } from "../../utils/createUserSignInActivityDomainObject";

describe("UserSignInActivityRepository.create", () => {
  let repository: UserSignInActivityRepository;

  beforeAll(() => {
    repository = new UserSignInActivityRepository();
  });

  beforeEach(async () => {
    await db.userSignInActivity.deleteMany();
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should create a new sign-in activity with hydrated user", async () => {
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
    expect(createdActivity?.id).toBe(activity.id);
    expect(createdActivity?.userId).toBe(user.id);
    expect(createdActivity?.time).toEqual(activity.time);
    expect(createdActivity?.user).toBeDefined();
    expect(createdActivity?.user?.id).toBe(user.id);

    const dbActivity = await db.userSignInActivity.findUnique({
      where: { id: createdActivity!.id }
    });
    expect(dbActivity).toBeTruthy();
  });

  it("should return null when user does not exist", async () => {
    const userSignInActivityDomainObject = createUserSignInActivityDomainObject({
      id: faker.string.uuid()
    });

    const result = await repository.create(userSignInActivityDomainObject);

    expect(result).toBeNull();
  });
});
