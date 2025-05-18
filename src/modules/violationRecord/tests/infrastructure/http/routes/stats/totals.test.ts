import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedViolationRecord } from "../../../../utils/violationRecord/seedViolationRecord";

describe("GET /api/v1/violation-record/stats/totals", () => {
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

  it("should return status 200 and return the correct total for unpaid and paid violations", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER"]),
      expiration: "1h"
    });

    const unpaidPenalty = faker.helpers.arrayElement<number>([250, 500, 1000]);
    const paidPenalty = faker.helpers.arrayElement<number>([250, 500, 1000]);

    await Promise.all([
      seedViolationRecord({ status: "PAID", penalty: paidPenalty }),
      seedViolationRecord({ status: "UNPAID", penalty: unpaidPenalty }),
      seedViolationRecord({ status: "PAID", penalty: paidPenalty }),
      seedViolationRecord({ status: "UNPAID", penalty: unpaidPenalty }),
      seedViolationRecord({ status: "PAID", penalty: paidPenalty }),
      seedViolationRecord({ status: "UNPAID", penalty: unpaidPenalty })
    ]);

    const response = await requestAPI
      .get("/api/v1/violation-record/stats/totals")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.paidTotal).toBe(paidPenalty * 3);
    expect(responseBody.unpaidTotal).toBe(unpaidPenalty * 3);
  });

  it("should return status 403 status code and message when Authorization provided lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF", "GUEST"])
    });

    const response = await requestAPI
      .get("/api/v1/violation-record/stats/totals")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`);
    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });
});
