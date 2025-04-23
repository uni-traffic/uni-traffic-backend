import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import type { RegisterRequest } from "../../../../../src/dtos/userRequestSchema";
import { seedAuthenticatedUser } from "../../../../utils/user/seedAuthenticatedUser";

describe("POST /api/v1/auth/login", () => {
  let requestAPI: TestAgent;
  let requestCredential: RegisterRequest;

  beforeAll(() => {
    requestAPI = request(app);
  });

  beforeEach(async () => {
    await db.user.deleteMany();

    requestCredential = {
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

  it("should return a 201 status code and UserDTO", async () => {
    const authenticatedUser = await seedAuthenticatedUser({ role: "ADMIN" });

    const response = await requestAPI
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${authenticatedUser.accessToken}`)
      .send(requestCredential);
    const responseBody = response.body;

    expect(response.status).toBe(201);
    expect(responseBody.id).toBeDefined();
    expect(responseBody.username).toBeDefined();
    expect(responseBody.email).toBeDefined();
    expect(responseBody.firstName).toBeDefined();
    expect(responseBody.lastName).toBeDefined();
    expect(responseBody.message).toBe("User successfully created.");
  });

  it("should return a 403 status code and message when Authorization provided lacks permission", async () => {
    const authenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["SECURITY", "STUDENT", "STAFF"])
    });

    const response = await requestAPI
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${authenticatedUser.accessToken}`)
      .send(requestCredential);
    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });

  it("should return a 401 status code when Authorization or accessToken is not provided", async () => {
    const response = await requestAPI.post("/api/v1/auth/register").send(requestCredential);
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe('Access token is required "Bearer {token}"');
  });

  it("should return a 401 status code when the provided Authorization is expired", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      expiration: "1s",
      role: faker.helpers.arrayElement(["SECURITY", "STUDENT", "STAFF"])
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requestAPI
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(requestCredential);
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return a 401 status code when the provided Authorization is malformed", async () => {
    const response = await requestAPI
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .send(requestCredential);
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("The provided token is invalid or malformed.");
  });
});
