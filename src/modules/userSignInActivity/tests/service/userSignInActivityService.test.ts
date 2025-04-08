import { faker } from "@faker-js/faker";
import { UserSignInActivityService } from "../../src/service/userSignInActivityService";
import { UserSignInActivityRepository } from "../../src/repositories/userSignInActivityRepository";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { NotFoundError } from "../../../../shared/core/errors";

describe("UserSignInActivityService", () => {
  let service: UserSignInActivityService;
  let repository: UserSignInActivityRepository;

  beforeAll(() => {
    repository = new UserSignInActivityRepository();
    service = new UserSignInActivityService(repository);
  });

  beforeEach(async () => {
    await db.userSignInActivity.deleteMany();
    await db.user.deleteMany();
  });

  describe("createAndSaveUserSignInActivity", () => {
    it("should successfully create a sign-in activity", async () => {
      const user = await seedUser({});
      await expect(service.createAndSaveUserSignInActivity(user.id)).resolves.not.toThrow();

      const activities = await db.userSignInActivity.findMany({
        where: { userId: user.id }
      });
      expect(activities.length).toBe(1);
    });

    it("should throw NotFoundError when user does not exist", async () => {
      await expect(service.createAndSaveUserSignInActivity("non-existent-user-id")).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("getRecentActivities", () => {
    it("should return recent activities with user data", async () => {
      const user = await seedUser({});

      await db.userSignInActivity.createMany({
        data: Array.from({ length: 3 }).map(() => ({
          id: faker.string.uuid(),
          userId: user.id,
          time: faker.date.recent()
        }))
      });

      const activities = await service.getRecentActivities(user.id, 2);
      expect(activities.length).toBe(2);
      expect(activities[0].userId).toBe(user.id);
      expect(activities[0].user).toBeDefined();
    });

    it("should return empty array when no activities exist", async () => {
      const user = await seedUser({});
      const activities = await service.getRecentActivities(user.id, 5);
      expect(activities).toEqual([]);
    });
  });
});
