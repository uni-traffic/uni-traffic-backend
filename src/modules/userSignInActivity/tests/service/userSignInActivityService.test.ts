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
    it("should successfully create and return a sign-in activity DTO", async () => {
      const user = await seedUser({});
      const result = await service.createAndSaveUserSignInActivity(user.id);

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("userId", user.id);
      expect(result).toHaveProperty("time");
      expect(result).toHaveProperty("user");
      expect(result.user).not.toBeNull();

      const dbRecord = await db.userSignInActivity.findFirst({
        where: { userId: user.id }
      });

      expect(dbRecord).not.toBeNull();
      expect(dbRecord?.userId).toBe(user.id);
    });

    it("should throw NotFoundError when user does not exist", async () => {
      await expect(service.createAndSaveUserSignInActivity("non-existent-user-id")).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
