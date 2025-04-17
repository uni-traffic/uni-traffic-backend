import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedVehicleApplication } from "../../../../utils/seedVehicleApplication";

describe("GET /api/v1/vehicle-application/stats/count-by-status", () => {
  let requestAPI: TestAgent;

  beforeEach(async () => {
    await db.vehicleApplication.deleteMany();
    await db.user.deleteMany();
  });

  beforeAll(() => {
    requestAPI = request.agent(app);
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return the correct count for every status of vehicle application", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });
    await Promise.all([
      seedVehicleApplication({ status: "APPROVED" }),
      seedVehicleApplication({ status: "APPROVED" }),
      seedVehicleApplication({ status: "PENDING_FOR_STICKER" }),
      seedVehicleApplication({ status: "PENDING_FOR_STICKER" }),
      seedVehicleApplication({ status: "PENDING_FOR_STICKER" }),
      seedVehicleApplication({ status: "PENDING_FOR_PAYMENT" }),
      seedVehicleApplication({ status: "PENDING_FOR_PAYMENT" }),
      seedVehicleApplication({ status: "PENDING_FOR_SECURITY_APPROVAL" }),
      seedVehicleApplication({ status: "REJECTED" }),
      seedVehicleApplication({ status: "REJECTED" }),
      seedVehicleApplication({ status: "REJECTED" }),
      seedVehicleApplication({ status: "REJECTED" }),
      seedVehicleApplication({ status: "REJECTED" })
    ]);

    const response = await requestAPI
      .get("/api/v1/vehicle-application/stats/count-by-status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).toBeDefined();
    expect(responseBody).toContainEqual({ status: "APPROVED", count: 2 });
    expect(responseBody).toContainEqual({ status: "PENDING_FOR_STICKER", count: 3 });
    expect(responseBody).toContainEqual({ status: "PENDING_FOR_PAYMENT", count: 2 });
    expect(responseBody).toContainEqual({ status: "PENDING_FOR_SECURITY_APPROVAL", count: 1 });
    expect(responseBody).toContainEqual({ status: "REJECTED", count: 5 });
  });

  it("should return the correct count for the given status", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "SECURITY", "CASHIER"])
    });
    const status = faker.helpers.arrayElement([
      "APPROVED",
      "PENDING_FOR_STICKER",
      "PENDING_FOR_PAYMENT",
      "PENDING_FOR_SECURITY_APPROVAL",
      "REJECTED"
    ]);
    await Promise.all([
      seedVehicleApplication({ status: status }),
      seedVehicleApplication({ status: status }),
      seedVehicleApplication({ status: status }),
      seedVehicleApplication({ status: status }),
      seedVehicleApplication({ status: status }),
      seedVehicleApplication({ status: status })
    ]);

    const response = await requestAPI
      .get("/api/v1/vehicle-application/stats/count-by-status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        status: status
      });
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody).toBeDefined();
    expect(responseBody).toContainEqual({ status: status, count: 6 });
  });

  it("should return 400 status code when provided with invalid status", async () => {
    const status = faker.helpers.arrayElement(["CONFIRMED", "DENIED", "PENDING"]);

    const response = await requestAPI
      .get("/api/v1/vehicle-application/stats/count-by-status")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .query({
        status: status
      });

    expect(response.status).toBe(400);
  });

  it("should return 403 status code when user lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["GUEST", "STUDENT", "STAFF"])
    });
    const status = faker.helpers.arrayElement([
      "APPROVED",
      "PENDING_FOR_STICKER",
      "PENDING_FOR_PAYMENT",
      "PENDING_FOR_SECURITY_APPROVAL",
      "REJECTED"
    ]);

    const response = await requestAPI
      .get("/api/v1/vehicle-application/stats/count-by-status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        status: status
      });

    expect(response.status).toBe(403);
  });
});
