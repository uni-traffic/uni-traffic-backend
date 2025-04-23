import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedViolation } from "../../../../utils/violation/seedViolation";
import { ViolationRepository } from "../../../../../src/repositories/violationRepository";

describe("POST /api/v1/violation/delete", () => {
  let requestAPI: TestAgent;
  let repository: ViolationRepository;

  beforeAll(() => {
    requestAPI = request(app);
    repository = new ViolationRepository();
  });

  beforeEach(async () => {
    await db.violation.deleteMany();
    await db.user.deleteMany();
  });

  it("should return 200 and successfully soft delete a violation", async () => {
    const adminUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"]),
      expiration: "1h"
    });
    const seededViolation = await seedViolation({});

    const response = await requestAPI
      .post("/api/v1/violation/delete")
      .set("Authorization", `Bearer ${adminUser.accessToken}`)
      .send({ id: seededViolation.id });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(seededViolation.id);
    expect(response.body.isDeleted).toBe(true);

    const deletedRecord = await repository.getViolationById(seededViolation.id);
    expect(deletedRecord).toBeNull();

    const rawRecord = await db.violation.findUnique({
      where: { id: seededViolation.id }
    });
    expect(rawRecord?.isDeleted).toBe(true);
  });

  it("should return 404 when violation does not exist", async () => {
    const adminUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"]),
      expiration: "1h"
    });
    const nonExistentId = faker.string.uuid();

    const response = await requestAPI
      .post("/api/v1/violation/delete")
      .set("Authorization", `Bearer ${adminUser.accessToken}`)
      .send({ id: nonExistentId });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Violation not found");
  });

  it("should maintain all other violation data after deletion", async () => {
    const adminUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"]),
      expiration: "1h"
    });
    const seededViolation = await seedViolation({});
    const originalData = { ...seededViolation };

    await requestAPI
      .post("/api/v1/violation/delete")
      .set("Authorization", `Bearer ${adminUser.accessToken}`)
      .send({ id: seededViolation.id });

    const rawRecord = await db.violation.findUnique({
      where: { id: seededViolation.id }
    });

    expect(rawRecord).toBeTruthy();
    expect(rawRecord?.category).toBe(originalData.category);
    expect(rawRecord?.violationName).toBe(originalData.violationName);
    expect(rawRecord?.penalty).toBe(originalData.penalty);
    expect(rawRecord?.isDeleted).toBe(true);
  });

  it("should return 403 when user lacks required roles", async () => {
    const unauthorizedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["SECURITY", "STAFF", "STUDENT"]),
      expiration: "1h"
    });
    const seededViolation = await seedViolation({});

    const response = await requestAPI
      .post("/api/v1/violation/delete")
      .set("Authorization", `Bearer ${unauthorizedUser.accessToken}`)
      .send({ id: seededViolation.id });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });

  it("should return 401 when Authorization header is missing", async () => {
    const seededViolation = await seedViolation({});

    const response = await requestAPI
      .post("/api/v1/violation/delete")
      .send({ id: seededViolation.id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token is required "Bearer {token}"');
  });

  it("should return 401 when token is expired", async () => {
    const adminUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"]),
      expiration: "1s"
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const seededViolation = await seedViolation({});

    const response = await requestAPI
      .post("/api/v1/violation/delete")
      .set("Authorization", `Bearer ${adminUser.accessToken}`)
      .send({ id: seededViolation.id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return 401 when token is malformed", async () => {
    const seededViolation = await seedViolation({});

    const response = await requestAPI
      .post("/api/v1/violation/delete")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .send({ id: seededViolation.id });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("The provided token is invalid or malformed.");
  });
});
