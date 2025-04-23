import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { UserRepository } from "../../../src/repositories/userRepository";
import { seedUser } from "../../utils/user/seedUser";

describe("UserRepository.isEmailAlreadyTaken", () => {
  let userRepository: UserRepository;

  beforeAll(() => {
    userRepository = new UserRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return true when email already registered in the system", async () => {
    const email = faker.internet.email({ provider: "neu.edu.ph" });
    const seededUser = await seedUser({ email });

    const isEmailTaken = await userRepository.isEmailAlreadyTaken(seededUser.email);

    expect(isEmailTaken).toBe(true);
  });

  it("should return false when email is not registered in the system", async () => {
    const seededUser = await seedUser({});

    const isEmailTaken = await userRepository.isEmailAlreadyTaken(seededUser.username);

    expect(isEmailTaken).toBe(false);
  });
});
