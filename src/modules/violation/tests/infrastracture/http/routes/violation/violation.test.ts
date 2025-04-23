import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { seedViolations } from "../../../../../../../../scripts/seedViolation";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import type { IViolationDTO } from "../../../../../src/dtos/violationDTO";

describe("GET /api/v1/violation", () => {
  let requestAPI: TestAgent;

  beforeAll(async () => {
    requestAPI = request(app);
    await seedViolations();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return status 200 with all violations", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const seededViolations = await db.violation.findMany();

    const response = await requestAPI
      .get("/api/v1/violation")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(seededViolations.length);
    expect(response.body).toEqual(
      seededViolations.map((v: IViolationDTO) => ({
        id: v.id,
        category: v.category,
        violationName: v.violationName,
        penalty: v.penalty
      }))
    );
  });

  it("should return status 403 if the user lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "STUDENT",
      expiration: "1h"
    });

    const response = await requestAPI
      .get("/api/v1/violation")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });

  it("should return status 401 if no access token is provided", async () => {
    const response = await requestAPI.get("/api/v1/violation");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token is required "Bearer {token}"');
  });

  it("should return status 401 if the token is expired", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      expiration: "1s",
      role: "SECURITY"
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requestAPI
      .get("/api/v1/violation")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return status 401 if the token is invalid or malformed", async () => {
    const response = await requestAPI
      .get("/api/v1/violation")
      .set("Authorization", "Bearer invalid_token_example");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("The provided token is invalid or malformed.");
  });

  it("should return an empty array if no violations exist", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    await db.violation.deleteMany();

    const response = await requestAPI
      .get("/api/v1/violation")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
