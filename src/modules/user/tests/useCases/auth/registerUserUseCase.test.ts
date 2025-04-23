import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { RegisterRequest } from "../../../src/dtos/userRequestSchema";
import { RegisterUserUseCase } from "../../../src/useCases/auth/registerUserUseCase";
import { seedUser } from "../../utils/user/seedUser";

describe("RegisterUserUseCase", () => {
  let registerUserUseCase: RegisterUserUseCase;
  let newUserData: RegisterRequest;

  beforeAll(() => {
    registerUserUseCase = new RegisterUserUseCase();
  });

  beforeEach(async () => {
    await db.user.deleteMany();

    newUserData = {
      email: faker.internet.email({ provider: "neu.edu.ph" }),
      username: faker.word.sample({
        length: {
          min: 3,
          max: 15
        }
      }),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: faker.helpers.arrayElement(["SECURITY", "STUDENT", "STAFF"])
    };
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should register the user successfully", async () => {
    const registeredUser = await registerUserUseCase.execute(newUserData);

    expect(registeredUser).toBeTruthy();
    expect(registeredUser.id).toBeDefined();
    expect(registeredUser.username).toBe(newUserData.username);
    expect(registeredUser.email).toBe(newUserData.email);
    expect(registeredUser.lastName).toBe(newUserData.lastName);
    expect(registeredUser.firstName).toBe(newUserData.firstName);
    expect(registeredUser.role).toBe(newUserData.role);
  });

  it("should throw ConflictError when username is already in used", async () => {
    await seedUser({ username: newUserData.username });

    let message = "";
    try {
      await registerUserUseCase.execute(newUserData);
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toBeTruthy();
    expect(message).toEqual("The username is unavailable.");
  });

  it("should throw ConflictError when email is already in used", async () => {
    await seedUser({ email: newUserData.email });

    let message = "";
    try {
      await registerUserUseCase.execute(newUserData);
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toBeTruthy();
    expect(message).toEqual("An account with this email already exists.");
  });
});
