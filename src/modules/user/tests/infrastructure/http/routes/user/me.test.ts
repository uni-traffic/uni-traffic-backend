import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../utils/user/seedAuthenticatedUser";

describe("GET /api/v1/user/me", () => {
  let requestAPI: TestAgent;

  beforeAll(() => {
    requestAPI = request(app);
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  it("should return a 200 status code and UserDTO", async () => {
    const authenticatedUser = await seedAuthenticatedUser({
      expiration: "1h",
      role: faker.helpers.arrayElement(["STAFF", "ADMIN", "STUDENT", "SECURITY"])
    });

    const response = await requestAPI
      .get("/api/v1/user/me")
      .set("Authorization", `Bearer ${authenticatedUser.accessToken}`)
      .send();
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.id).toBeDefined();
    expect(responseBody.username).toBeDefined();
    expect(responseBody.email).toBeDefined();
    expect(responseBody.firstName).toBeDefined();
    expect(responseBody.lastName).toBeDefined();
  });

  it("should return a 401 status code when Authorization or accessToken is not provided", async () => {
    const response = await requestAPI.get("/api/v1/user/me").send();
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe('Access token is required "Bearer {token}"');
  });

  it("should return a 401 status code when the provided Authorization is expired", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      expiration: "1s",
      role: faker.helpers.arrayElement(["STAFF", "ADMIN", "STUDENT", "SECURITY"])
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requestAPI
      .get("/api/v1/user/me")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send();
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return a 401 status code when the provided Authorization is malformed", async () => {
    const response = await requestAPI
      .get("/api/v1/user/me")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .send();
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("The provided token is invalid or malformed.");
  });
});
