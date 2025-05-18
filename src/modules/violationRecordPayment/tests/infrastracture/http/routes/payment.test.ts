import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../api";
import { db } from "../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedViolationRecord } from "../../../../../violationRecord/tests/utils/violationRecord/seedViolationRecord";

describe("POST /api/v1/payment/violation", () => {
  let requestAPI: TestAgent;

  beforeAll(() => {
    requestAPI = request.agent(app);
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return 200 and create a violation record payment", async () => {
    const cashier = await seedAuthenticatedUser({ role: "CASHIER", expiration: "1h" });
    const violationRecord = await seedViolationRecord({ status: "UNPAID" });

    if (!violationRecord.violation) {
      throw new Error("ViolationRecord.violation is undefined. Check seeding function.");
    }

    const payload = {
      violationRecordId: violationRecord.id,
      cashTendered: violationRecord.violation.penalty
    };

    const response = await requestAPI
      .post("/api/v1/payment/violation")
      .set("Authorization", `Bearer ${cashier.accessToken}`)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.violationRecordId).toBe(violationRecord.id);
  });

  it("should return 400 if request body is invalid", async () => {
    const cashier = await seedAuthenticatedUser({ role: "CASHIER", expiration: "1h" });
    const response = await requestAPI
      .post("/api/v1/payment/violation")
      .set("Authorization", `Bearer ${cashier.accessToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("should return 403 if user lacks permission", async () => {
    const unauthorizedUser = await seedAuthenticatedUser({ role: "STUDENT", expiration: "1h" });
    const violationRecord = await seedViolationRecord({ status: "UNPAID" });

    const payload = {
      violationRecordId: violationRecord.id,
      cashTendered: violationRecord.violation.penalty
    };

    const response = await requestAPI
      .post("/api/v1/payment/violation")
      .set("Authorization", `Bearer ${unauthorizedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });

  it("should return 401 if the provided Authorization token is expired", async () => {
    const cashier = await seedAuthenticatedUser({ role: "CASHIER", expiration: "1s" });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const payload = {
      violationRecordId: "some-id",
      cashTendered: 1000
    };

    const response = await requestAPI
      .post("/api/v1/payment/violation")
      .set("Authorization", `Bearer ${cashier.accessToken}`)
      .send(payload);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Your session has expired. Please log in again.");
  });
});
