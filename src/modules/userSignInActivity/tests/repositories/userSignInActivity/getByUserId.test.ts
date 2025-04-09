import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import { UserSignInActivityRepository } from "../../../src/repositories/userSignInActivityRepository";

describe("UserSignInActivityRepository.getRecentByUserId", () => {
  let repository: UserSignInActivityRepository;

  beforeAll(() => {
    repository = new UserSignInActivityRepository();
  });

  beforeEach(async () => {
    await db.userSignInActivity.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return recent activities limited by count", async () => {
    const user = await seedUser({});

    await db.userSignInActivity.createMany({
      data: Array.from({ length: 5 }).map((_, i) => ({
        id: faker.string.uuid(),
        userId: user.id,
        time: new Date(Date.now() - i * 1000)
      }))
    });

    const activities = await repository.getRecentByUserId(user.id, 3);
    expect(activities.length).toBe(3);
    expect(activities[0].time.getTime()).toBeGreaterThan(activities[1].time.getTime());
    expect(activities[1].time.getTime()).toBeGreaterThan(activities[2].time.getTime());
  });

  it("should include user data when requested", async () => {
    const user = await seedUser({});
    await db.userSignInActivity.create({
      data: {
        id: faker.string.uuid(),
        userId: user.id,
        time: new Date()
      }
    });

    const activities = await repository.getRecentByUserId(user.id, 1, { user: true });
    expect(activities[0].user).toBeDefined();
    expect(activities[0].user?.id).toBe(user.id);
  });
});
