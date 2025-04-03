import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../api";
import { db } from "../../../../../../shared/infrastructure/database/prisma";
import { seedVehicleApplication } from "../../../../../vehicleApplication/tests/utils/seedVehicleApplication";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
import type { VehicleApplicationPaymentRequest } from "../../../../src/dtos/vehicleApplicationPaymentRequestSchema";
import { faker } from "@faker-js/faker";

describe("POST /api/v1/payment/vehicle-application", () => {
  let requestAPI: TestAgent;

  beforeAll(() => {
    requestAPI = request.agent(app);
  });

  beforeEach(async () => {
    await db.vehicleApplicationPayment.deleteMany();
    await db.vehicleApplication.deleteMany();
    await db.user.deleteMany();
  });

  it("should return status 200 and create a vehicle application payment", async () => {
    const seededcashier = await seedAuthenticatedUser({ role: "CASHIER", expiration: "1h" });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });

    const payload: VehicleApplicationPaymentRequest = {
      vehicleApplicationId: seededVehicleApplication.id,
      amountDue: 500,
      cashTendered: 501
    };

    const response = await requestAPI
      .post("/api/v1/payment/vehicle-application")
      .set("Authorization", `Bearer ${seededcashier.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication.id).toBe(seededVehicleApplication.id);

    const updatedRecord = await db.vehicleApplication.findUnique({
      where: { id: seededVehicleApplication.id }
    });

    expect(updatedRecord).toBeDefined();
    expect(updatedRecord?.status).toBe("PENDING_FOR_STICKER");
  });

  it("should return status 400 when no parameters passed", async () => {
    const seededcashier = await seedAuthenticatedUser({ role: "CASHIER", expiration: "1h" });

    const response = await requestAPI
      .post("/api/v1/payment/vehicle-application")
      .set("Authorization", `Bearer ${seededcashier.accessToken}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("should return status 403 if user lacks permission", async () => {
    const seededcashier = await seedAuthenticatedUser({ role: "STUDENT", expiration: "1h" });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });

    const payload: VehicleApplicationPaymentRequest = {
      vehicleApplicationId: seededVehicleApplication.id,
      amountDue: 500,
      cashTendered: 501
    };

    const response = await requestAPI
      .post("/api/v1/payment/vehicle-application")
      .set("Authorization", `Bearer ${seededcashier.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });

  it("should return status 401 if the provided Authorization token is expired", async () => {
    const seededcashier = await seedAuthenticatedUser({ role: "CASHIER", expiration: "1s" });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requestAPI
      .post("/api/v1/payment/vehicle-application")
      .set("Authorization", `Bearer ${seededcashier.accessToken}`)
      .send({
        vehicleApplicationId: faker.string.uuid(),
        amountDue: 500,
        cashTendered: 501
      });
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return status 401 if the provided Authorization is malformed", async () => {
    const response = await requestAPI
      .post("/api/v1/payment/vehicle-application")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .send({
        vehicleApplicationId: faker.string.uuid(),
        amountDue: 500,
        cashTendered: 501
      });
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("The provided token is invalid or malformed.");
  });
});
