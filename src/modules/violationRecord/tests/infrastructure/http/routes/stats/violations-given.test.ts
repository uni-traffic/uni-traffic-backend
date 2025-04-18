import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedViolationRecord } from "../../../../utils/violationRecord/seedViolationRecord";

describe("GET /api/v1/violation-record/stats/violations-given", () => {
  let requestAPI: TestAgent;

  beforeAll(async () => {
    requestAPI = request.agent(app);
  });

  beforeEach(async () => {
    await db.user.deleteMany();
    await db.violation.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return status 200 and return the correct count per DAY on given range", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });

    await Promise.all([
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-01T01:15:30.123Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-01T03:45:10.456Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-01T12:00:00.789Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-02T12:00:00.789Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-02T12:00:00.789Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-03T13:00:00.789Z") })
    ]);
    const response = await requestAPI
      .get("/api/v1/violation-record/stats/violations-given")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        startDate: "2024-01-01",
        endDate: "2025-12-31",
        type: "DAY"
      });
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).toContainEqual({ date: "2024-05-01", count: 3 });
    expect(responseBody).toContainEqual({ date: "2024-05-02", count: 2 });
    expect(responseBody).toContainEqual({ date: "2024-05-03", count: 1 });
  });

  it("should return status 200 and return the correct count per MONTH on given range", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });

    await Promise.all([
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-02-01T01:15:30.123Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-02-01T03:45:10.456Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-01T12:00:00.789Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-02T12:00:00.789Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-02T12:00:00.789Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-08-03T13:00:00.789Z") })
    ]);
    const response = await requestAPI
      .get("/api/v1/violation-record/stats/violations-given")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        startDate: "2024-01-01",
        endDate: "2025-12-31",
        type: "MONTH"
      });
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).toContainEqual({ date: "2024-02", count: 2 });
    expect(responseBody).toContainEqual({ date: "2024-05", count: 3 });
    expect(responseBody).toContainEqual({ date: "2024-08", count: 1 });
  });

  it("should return status 200 and return the correct count per YEAR on given range", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });

    await Promise.all([
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2021") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2022") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2022") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2022") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2023") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2023") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024") })
    ]);
    const response = await requestAPI
      .get("/api/v1/violation-record/stats/violations-given")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        startDate: "2020-01-01",
        endDate: "2025-12-31",
        type: "YEAR"
      });
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).toContainEqual({ date: "2021", count: 1 });
    expect(responseBody).toContainEqual({ date: "2022", count: 3 });
    expect(responseBody).toContainEqual({ date: "2023", count: 2 });
    expect(responseBody).toContainEqual({ date: "2024", count: 3 });
  });

  it("should return status 403 status code and message when Authorization provided lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF", "GUEST"])
    });

    const response = await requestAPI
      .get("/api/v1/violation-record/stats/totals")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        startDate: "2024-01-01",
        endDate: "2025-12-31",
        type: "DAY"
      });
    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });
});
