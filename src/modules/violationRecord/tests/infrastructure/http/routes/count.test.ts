import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../api";
import { db } from "../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedViolationRecord } from "../../../utils/violationRecord/seedViolationRecord";

describe("GET /api/v1/violation-record/count", () => {
  let requestAPI: TestAgent;

  beforeAll(async () => {
    requestAPI = request.agent(app);
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return status 200 and total violations per day within a given date range", async () => {
    const date1 = new Date("2025-04-01T08:30:00Z");
    const date2 = new Date("2025-04-02T14:45:00Z");
    const date3 = new Date("2025-04-03T20:15:00Z");
    const date4 = new Date("2025-04-23T05:00:00Z");

    await seedViolationRecord({ createdAt: date1 });
    await seedViolationRecord({ createdAt: new Date("2025-04-01T09:15:00Z") });
    await seedViolationRecord({ createdAt: date2 });
    await seedViolationRecord({ createdAt: new Date("2025-04-02T16:00:00Z") });
    await seedViolationRecord({ createdAt: date3 });
    await seedViolationRecord({ createdAt: date4 });

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload = {
      startDate: "2025-04-01",
      endDate: "2025-04-15"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).toEqual(
      expect.arrayContaining([
        { date: "2025-04-01", violationsIssued: 2 },
        { date: "2025-04-02", violationsIssued: 2 },
        { date: "2025-04-03", violationsIssued: 1 }
      ])
    );
  });

  it("should return status 200 and total violations for a single day when startDate and endDate dates are the same", async () => {
    const date1 = new Date("2025-04-05");
    await seedViolationRecord({ createdAt: date1 });
    await seedViolationRecord({ createdAt: date1 });
    await seedViolationRecord({ createdAt: date1 });

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload = {
      startDate: "2025-04-05",
      endDate: "2025-04-05"
    };
    const response = await requestAPI
      .get("/api/v1/violation-record/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).toEqual([{ date: "2025-04-05", violationsIssued: 3 }]);
  });

  it("should return status 400 when the startDate date is after the endDate date", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload = {
      startDate: "2025-04-03",
      endDate: "2025-04-01"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body;

    expect(response.status).toBe(400);
    expect(responseBody.message).toBe(
      "Invalid date range. startDate date cannot be after endDate date."
    );
  });

  it("should return an empty array when no violations exist in the given date range", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h"
    });

    const payload = {
      startDate: "2025-05-01",
      endDate: "2025-05-05"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).toEqual([]);
  });

  it("should return status 403 status code and message when Authorization provided lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["GUEST", "STUDENT", "STAFF"])
    });

    const payload = {
      startDate: "2025-05-01",
      endDate: "2025-05-05"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/count")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });
});
