import { db } from "../../../../../shared/infrastructure/database/prisma";
import { type IUserRepository, UserRepository } from "../../../src/repositories/userRepository";
import { seedUser } from "../../utils/user/seedUser";

describe("UserRepository.getTotalUserCount", () => {
  let userRepository: IUserRepository;

  beforeAll(async () => {
    userRepository = new UserRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return total user count for a specific role", async () => {
    await seedUser({ role: "ADMIN" });
    await seedUser({ role: "ADMIN" });
    await seedUser({ role: "STAFF" });

    const result = await userRepository.getTotalUserCount(["ADMIN"]);

    expect(result).toBe(2);
  });

  it("should return 0 when no users match the given role", async () => {
    await seedUser({ role: "STAFF" });

    const result = await userRepository.getTotalUserCount(["ADMIN"]);

    expect(result).toBe(0);
  });

  it("should return total count excluding deleted users", async () => {
    await seedUser({ isDeleted: false });
    await seedUser({ isDeleted: true });

    const result = await userRepository.getTotalUserCount();

    expect(result).toBe(1);
  });
});
