import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { UserRepository } from "../../../src/repositories/userRepository";
import { seedUser } from "../../utils/user/seedUser";

describe("UserRepository.isUsernameAlreadyTaken", () => {
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

  it("should return true when username already registered in the system", async () => {
    const username = faker.word.verb({ length: 10 });
    const seededUser = await seedUser({ username });

    const isUsernameTaken = await userRepository.isUsernameAlreadyTaken(seededUser.username);

    expect(isUsernameTaken).toBe(true);
  });

  it("should return false when username is not registered in the system", async () => {
    const seededUser = await seedUser({});

    const isUsernameTaken = await userRepository.isUsernameAlreadyTaken(seededUser.username);

    expect(isUsernameTaken).toBe(true);
  });
});
