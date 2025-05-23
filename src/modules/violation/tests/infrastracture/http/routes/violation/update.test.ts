import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { ViolationRepository } from "../../../../../src/repositories/violationRepository";
import { seedViolation } from "../../../../utils/violation/seedViolation";

describe("POST /api/v1/violation/update", () => {
  let violationRepository: ViolationRepository;
  let requestAPI: TestAgent;

  beforeAll(async () => {
    requestAPI = request.agent(app);
    violationRepository = new ViolationRepository();
  });

  beforeEach(async () => {
    await db.violation.deleteMany();
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return status 200 and update violation successfully", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY"]),
      expiration: "1h"
    });
    const seededViolation = await seedViolation({});

    const payload = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    const response = await requestAPI
      .post("/api/v1/violation/update")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).not.toBeNull();
    expect(responseBody.violationName).toBe("Over-speeding");
    expect(responseBody.penalty).toBe(payload.penalty);
    expect(responseBody.category).toBe("Speeding");

    const updatedRecord = await violationRepository.getViolationById(seededViolation.id);

    expect(updatedRecord).not.toBeNull();
    expect(updatedRecord?.violationName).toBe("Over-speeding");
    expect(updatedRecord?.penalty).toBe(payload.penalty);
    expect(updatedRecord?.category).toBe("Speeding");
  });

  it("should return status 200 and update violation successfully with partial payload (category)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY"]),
      expiration: "1h"
    });
    const seededViolation = await seedViolation({});

    const payload = {
      id: seededViolation.id,
      category: "Speeding"
    };

    const response = await requestAPI
      .post("/api/v1/violation/update")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).not.toBeNull();
    expect(responseBody.violationName).toBe(seededViolation.violationName);
    expect(responseBody.penalty).toBe(seededViolation.penalty);
    expect(responseBody.category).toBe("Speeding");

    const updatedRecord = await violationRepository.getViolationById(seededViolation.id);

    expect(updatedRecord).not.toBeNull();
    expect(updatedRecord?.violationName).toBe(seededViolation.violationName);
    expect(updatedRecord?.penalty).toBe(seededViolation.penalty);
    expect(updatedRecord?.category).toBe("Speeding");
  });

  it("should return status 200 and update violation successfully with partial payload (violationName)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY"]),
      expiration: "1h"
    });
    const seededViolation = await seedViolation({});

    const payload = {
      id: seededViolation.id,
      violationName: "Over-speeding"
    };

    const response = await requestAPI
      .post("/api/v1/violation/update")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).not.toBeNull();
    expect(responseBody.violationName).toBe("Over-speeding");
    expect(responseBody.penalty).toBe(seededViolation.penalty);
    expect(responseBody.category).toBe(seededViolation.category);

    const updatedRecord = await violationRepository.getViolationById(seededViolation.id);

    expect(updatedRecord).not.toBeNull();
    expect(updatedRecord?.violationName).toBe("Over-speeding");
    expect(updatedRecord?.penalty).toBe(seededViolation.penalty);
    expect(updatedRecord?.category).toBe(seededViolation.category);
  });

  it("should return status 200 and update violation successfully with partial payload (penalty)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY"]),
      expiration: "1h"
    });
    const seededViolation = await seedViolation({});

    const payload = {
      id: seededViolation.id,
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    const response = await requestAPI
      .post("/api/v1/violation/update")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).not.toBeNull();
    expect(responseBody.violationName).toBe(seededViolation.violationName);
    expect(responseBody.penalty).toBe(payload.penalty);
    expect(responseBody.category).toBe(seededViolation.category);

    const updatedRecord = await violationRepository.getViolationById(seededViolation.id);

    expect(updatedRecord).not.toBeNull();
    expect(updatedRecord?.violationName).toBe(seededViolation.violationName);
    expect(updatedRecord?.penalty).toBe(payload.penalty);
    expect(updatedRecord?.category).toBe(seededViolation.category);
  });
  it("should return status 400 and fail to update the violation when payload category is empty string", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY"]),
      expiration: "1h"
    });
    const seededViolation = await seedViolation({});

    const payload = {
      id: seededViolation.id,
      category: "",
      violationName: "Over-speeding",
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    const response = await requestAPI
      .post("/api/v1/violation/update")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(400);
    expect(responseBody.message).toBe("Category cannot be an empty string.");
  });

  it("should return status 400 and fail to update the violation when payload violationName is empty string", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY"]),
      expiration: "1h"
    });
    const seededViolation = await seedViolation({});

    const payload = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "",
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    const response = await requestAPI
      .post("/api/v1/violation/update")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(400);
    expect(responseBody.message).toBe("Violation name cannot be an empty string.");
  });

  it("should return status 404 and does not corrupt other data", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY"]),
      expiration: "1h"
    });
    const seededViolation = await seedViolation({});

    const payload = {
      id: "non-existing-id",
      category: "Speeding"
    };

    const response = await requestAPI
      .post("/api/v1/violation/update")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(404);
    expect(responseBody.message).toBe("Violation not found!");
  });

  it("should return status 400 and fail to update the violation when payload penalty is negative", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY"]),
      expiration: "1h"
    });
    const seededViolation = await seedViolation({});

    const payload = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: faker.number.int({ max: -1, min: -1000 })
    };

    const response = await requestAPI
      .post("/api/v1/violation/update")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(400);
    expect(responseBody.message).toBe("Penalty cannot be negative.");
  });

  it("should return status 400 and fail to update the violation when payload penalty is not a whole number", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY"]),
      expiration: "1h"
    });
    const seededViolation = await seedViolation({});

    const payload = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: faker.number.float({ max: 1000, min: 0 })
    };

    const response = await requestAPI
      .post("/api/v1/violation/update")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(400);
    expect(responseBody.message).toBe("Penalty must be a whole number.");
  });

  it("should return status 400 and fail to update the violation when payload id does not exist in the system", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY"]),
      expiration: "1h"
    });

    const payload = {
      id: faker.string.uuid(),
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    const response = await requestAPI
      .post("/api/v1/violation/update")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(404);
    expect(responseBody.message).toBe("Violation not found!");
  });

  it("should return status 403 and message when Authorization provided lacks permission", async () => {
    const authenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["CASHIER", "STUDENT", "STAFF", "GUEST"])
    });

    const seededViolation = await seedViolation({});

    const payload = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    const response = await requestAPI
      .post("/api/v1/violation/update")
      .set("Authorization", `Bearer ${authenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });

  it("should return status 401 when token is expired", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY"]),
      expiration: "1s"
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const seededViolation = await seedViolation({});

    const payload = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    const response = await requestAPI
      .post("/api/v1/violation/update")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(401);
  });

  it("should return status 401 when token is expired", async () => {
    const seededViolation = await seedViolation({});

    const payload = {
      id: seededViolation.id,
      category: "Speeding",
      violationName: "Over-speeding",
      penalty: faker.number.int({ max: 1000, min: 0 })
    };

    const response = await requestAPI
      .post("/api/v1/violation/update")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .send(payload);

    expect(response.status).toBe(401);
  });
});
