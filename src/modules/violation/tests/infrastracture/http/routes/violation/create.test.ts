import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import type { ViolationCreateRequest } from "../../../../../src/dtos/violationRequestSchema";

describe("POST /api/v1/violation/create", () => {
  let requestAPI: TestAgent;
  let violationRequest: ViolationCreateRequest;

  beforeAll(() => {
    requestAPI = request(app);
  });

  beforeEach(async () => {
    await db.violation.deleteMany();
    violationRequest = {
      category: faker.word.sample(),
      violationName: faker.word.sample(),
      penalty: faker.number.int({ min: 1, max: 1000 })
    };
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return a 201 status code and ViolationDTO", async () => {
    const authenticatedUser = await seedAuthenticatedUser({ role: "SECURITY" });

    const response = await requestAPI
      .post("/api/v1/violation/create")
      .set("Authorization", `Bearer ${authenticatedUser.accessToken}`)
      .send(violationRequest);

    const responseBody = response.body;

    expect(response.status).toBe(201);
    expect(responseBody.id).toBeDefined();
    expect(responseBody.category).toBe(violationRequest.category);
    expect(responseBody.violationName).toBe(violationRequest.violationName);
    expect(responseBody.penalty).toBe(violationRequest.penalty);
    expect(responseBody.message).toBe("Violation created successfully");
  });

  it("should return a 403 status code and message when Authorization provided lacks permission", async () => {
    const authenticatedUser = await seedAuthenticatedUser({
      role: "STUDENT"
    });

    const response = await requestAPI
      .post("/api/v1/violation/create")
      .set("Authorization", `Bearer ${authenticatedUser.accessToken}`)
      .send(violationRequest);
    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have required permission to perform this action."
    );
  });

  it("should return a 401 status code when Authorization or accessToken is not provided", async () => {
    const response = await requestAPI.post("/api/v1/violation/create").send(violationRequest);
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe('Access token is required "Bearer {token}"');
  });

  it("should return a 401 status code when the provided Authorization is expired", async () => {
    const expiredAuthenticatedUser = await seedAuthenticatedUser({
      expiration: "1s",
      role: "SECURITY"
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requestAPI
      .post("/api/v1/violation/create")
      .set("Authorization", `Bearer ${expiredAuthenticatedUser.accessToken}`)
      .send(violationRequest);
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return a 401 status code when the provided Authorization is malformed", async () => {
    const response = await requestAPI
      .post("/api/v1/violation/create")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .send(violationRequest);
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("The provided token is invalid or malformed.");
  });
});
