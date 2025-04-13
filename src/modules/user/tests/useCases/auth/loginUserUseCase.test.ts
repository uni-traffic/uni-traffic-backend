import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import type { LoginRequest } from "../../../src/dtos/userRequestSchema";
import { LoginUserUseCase } from "../../../src/useCases/auth/loginUserUseCase";
import { seedUser } from "../../utils/user/seedUser";

describe("LoginUserUseCase", () => {
  let loginUserUseCase: LoginUserUseCase;
  let credentials: LoginRequest;

  beforeAll(() => {
    loginUserUseCase = new LoginUserUseCase();
  });

  beforeEach(async () => {
    await db.user.deleteMany();

    credentials = {
      username: faker.word.sample({
        length: {
          min: 3,
          max: 15
        }
      }),
      password: faker.internet.password()
    };
  });

  it("should login user successfully", async () => {
    await seedUser({
      username: credentials.username,
      password: credentials.password
    });

    const { accessToken, user, appKey } = await loginUserUseCase.execute({
      username: credentials.username,
      password: credentials.password
    });

    expect(user).toBeDefined();
    expect(accessToken).toBeDefined();
    expect(appKey).toBeDefined();

    const signInActivity = await db.userSignInActivity.findMany({ where: { userId: user.id } });

    expect(signInActivity).toHaveLength(1);
    expect(signInActivity[0]!.userId).toBe(user.id);
  });

  it("should throw UnauthorizedError when provided with wrong password", async () => {
    await seedUser({
      username: credentials.username,
      password: credentials.password
    });

    let message = "";
    try {
      await loginUserUseCase.execute({
        username: credentials.username,
        password: faker.internet.password()
      });
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toBeTruthy();
    expect(message).toEqual("The username or password provided is incorrect.");
  });

  it("should throw UnauthorizedError when credentials doesnt exist on the system", async () => {
    let message = "";
    try {
      await loginUserUseCase.execute({
        username: credentials.username,
        password: credentials.password
      });
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toBeTruthy();
    expect(message).toEqual("The username or password provided is incorrect.");
  });
});
