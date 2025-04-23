import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../api";
import { db } from "../../../../../../shared/infrastructure/database/prisma";
import { combineDate } from "../../../../../../shared/lib/utils";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
import type {
  GetTotalFineCollectedPerDayByRangeUseCasePayload,
  GetViolationRecordPaymentAmountAndTimePaid
} from "../../../../src/dtos/violationRecordPaymentDTO";
import type { ViolationRecordPaymentGetByRangeRequest } from "../../../../src/dtos/violationRecordPaymentRequestSchema";
import { seedViolationRecordPayment } from "../../../utils/violationRecordPayment/seedViolationRecordPayment";

describe("GET /api/v1/payment/violation/total", () => {
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

  it("should return 200 and get total fine collected per day by range", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["SUPERADMIN", "ADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });

    const payload: ViolationRecordPaymentGetByRangeRequest = {
      startDate: "2023-01-01",
      endDate: "2023-01-30"
    };

    const seededViolationRecordPayment = await Promise.all([
      seedViolationRecordPayment({
        timePaid: new Date("2023-01-03T12:00:00Z"),
        amountPaid: 100
      }),
      seedViolationRecordPayment({
        timePaid: new Date("2023-01-03T10:00:00Z"),
        amountPaid: 200
      }),
      seedViolationRecordPayment({
        timePaid: new Date("2023-01-03T13:00:00Z"),
        amountPaid: 300
      }),
      seedViolationRecordPayment({
        timePaid: new Date("2023-01-06T14:00:00Z"),
        amountPaid: 150
      }),
      seedViolationRecordPayment({
        timePaid: new Date("2024-01-05T14:00:00Z"),
        amountPaid: 150
      })
    ]);

    const response = await requestAPI
      .get("/api/v1/payment/violation/total")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const combinedDate = combineDate(seededViolationRecordPayment);

    const responseBody = response.body as GetViolationRecordPaymentAmountAndTimePaid[];

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(2);
    expect(responseBody[0].timePaid).toContain(combinedDate[0]);
    expect(responseBody[1].timePaid).toContain(combinedDate[1]);
    expect(responseBody[0].amountPaid).toBe(600);
    expect(responseBody[1].amountPaid).toBe(150);
  });

  it("should return 400 if request body is invalid", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "CASHIER",
      expiration: "1h"
    });
    const response = await requestAPI
      .post("/api/v1/payment/violation")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("should return 403 if user lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "STUDENT",
      expiration: "1h"
    });

    const payload: GetTotalFineCollectedPerDayByRangeUseCasePayload = {
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-01-30")
    };

    const response = await requestAPI
      .get("/api/v1/payment/violation/total")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });

  it("should return 401 if the provided Authorization token is expired", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "CASHIER",
      expiration: "1s"
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const payload: GetTotalFineCollectedPerDayByRangeUseCasePayload = {
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-01-30")
    };

    const response = await requestAPI
      .get("/api/v1/payment/violation/total")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return 401 status code when the provided Authorization is malformed", async () => {
    const payload: GetTotalFineCollectedPerDayByRangeUseCasePayload = {
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-01-30")
    };

    const response = await requestAPI
      .get("/api/v1/payment/violation/total")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .query(payload);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("The provided token is invalid or malformed.");
  });
});
