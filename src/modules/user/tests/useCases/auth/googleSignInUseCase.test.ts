import { beforeEach } from "node:test";
import { faker } from "@faker-js/faker";
import type { TokenPayload } from "google-auth-library";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { GoogleOAuth } from "../../../../../shared/lib/googleOAuth";
import { GoogleSignInUseCase } from "../../../src/useCases/auth/googleSignInUseCase";
import { seedUser } from "../../utils/user/seedUser";

describe("GoogleSignInUseCase", () => {
  let useCase: GoogleSignInUseCase;
  let tokenPayload: TokenPayload;

  beforeAll(() => {
    useCase = new GoogleSignInUseCase();
    tokenPayload = {
      iss: "https://accounts.google.com",
      sub: faker.string.uuid(),
      aud: "your-client-id.apps.googleusercontent.com",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000)
    };
  });

  beforeEach(async () => {
    await db.user.deleteMany({});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should successfully return sign in credentials when user exist on the system", async () => {
    const seededUser = await seedUser({ email: faker.internet.email() });

    jest.spyOn(GoogleOAuth.prototype, "getPayloadFromToken").mockResolvedValue({
      email: seededUser.email,
      ...tokenPayload
    });

    const result = await useCase.execute({
      token: faker.internet.jwt(),
      clientType: faker.helpers.arrayElement(["WEB", "MOBILE"])
    });

    expect(result.user.email).toBe(seededUser.email);
    expect(result.accessToken).toBeDefined();
    expect(result.appKey).toBeDefined();

    const signInActivity = await db.userSignInActivity.findMany({
      where: { userId: result.user.id }
    });

    expect(signInActivity).toHaveLength(1);
    expect(signInActivity[0]!.userId).toBe(result.user.id);
  });

  it("should return auth credentials and create a user if the user doesn't exist", async () => {
    const newUser = {
      email: faker.internet.email(),
      given_name: faker.person.firstName(),
      family_name: faker.person.lastName()
    };
    jest.spyOn(GoogleOAuth.prototype, "getPayloadFromToken").mockResolvedValue({
      ...newUser,
      ...tokenPayload
    });

    const result = await useCase.execute({
      token: faker.internet.jwt(),
      clientType: faker.helpers.arrayElement(["WEB", "MOBILE"])
    });

    expect(result.user.email).toBe(newUser.email);
    expect(result.user.firstName).toBe(newUser.given_name);
    expect(result.user.lastName).toBe(newUser.family_name);
    expect(result.accessToken).toBeDefined();
    expect(result.appKey).toBeDefined();

    const signInActivity = await db.userSignInActivity.findMany({
      where: { userId: result.user.id }
    });

    expect(signInActivity).toHaveLength(1);
    expect(signInActivity[0]!.userId).toBe(result.user.id);
  });

  it("should create a user when the user doesn't exist and Google TokenPayload lacks family_name", async () => {
    const newUser = {
      email: faker.internet.email(),
      given_name: faker.person.firstName()
    };
    jest.spyOn(GoogleOAuth.prototype, "getPayloadFromToken").mockResolvedValue({
      ...newUser,
      ...tokenPayload
    });

    const result = await useCase.execute({
      token: faker.internet.jwt(),
      clientType: faker.helpers.arrayElement(["WEB", "MOBILE"])
    });

    expect(result.user.email).toBe(newUser.email);
    expect(result.user.firstName).toBe(newUser.given_name);
    expect(result.accessToken).toBeDefined();
    expect(result.appKey).toBeDefined();
  });

  it("should create a user when the user doesn't exist and Google TokenPayload lacks names", async () => {
    const newUser = {
      email: faker.internet.email()
    };
    jest.spyOn(GoogleOAuth.prototype, "getPayloadFromToken").mockResolvedValue({
      ...newUser,
      ...tokenPayload
    });

    const result = await useCase.execute({
      token: faker.internet.jwt(),
      clientType: faker.helpers.arrayElement(["WEB", "MOBILE"])
    });

    expect(result.user.email).toBe(newUser.email);
    expect(result.user.firstName).toBe(newUser.email.split("@")[0]);
    expect(result.accessToken).toBeDefined();
    expect(result.appKey).toBeDefined();
  });
});
