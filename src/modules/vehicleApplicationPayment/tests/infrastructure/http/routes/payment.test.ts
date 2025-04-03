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

    const amountDue = faker.number.float({ min: 500, max: 5000 });

    const payload: VehicleApplicationPaymentRequest = {
      vehicleApplicationId: seededVehicleApplication.id,
      amountDue: amountDue,
      cashTendered: faker.number.float({ min: amountDue, max: 10000 })
    };

    const response = await requestAPI
      .post("/api/v1/payment/vehicle-application")
      .set("Authorization", `Bearer ${seededcashier.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.vehicleApplication.id).toBe(seededVehicleApplication.id);
    expect(responseBody.amountDue.toFixed(4)).toBe(payload.amountDue.toFixed(4));
    expect(responseBody.cashTendered.toFixed(4)).toBe(payload.cashTendered.toFixed(4));
    expect(responseBody.change.toFixed(4)).toBe(
      (payload.cashTendered - payload.amountDue).toFixed(4)
    );

    const updatedRecord = await db.vehicleApplication.findUnique({
      where: { id: seededVehicleApplication.id }
    });

    expect(updatedRecord).toBeDefined();
    expect(updatedRecord?.status).toBe("PENDING_FOR_STICKER");
  });

  it("should return status 400 and throw an error when cashTendered is less than amount due", async () => {
    const seededcashier = await seedAuthenticatedUser({ role: "CASHIER", expiration: "1h" });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });

    const amountDue = faker.number.float({ min: 500, max: 5000 });

    const payload: VehicleApplicationPaymentRequest = {
      vehicleApplicationId: seededVehicleApplication.id,
      amountDue: amountDue,
      cashTendered: faker.number.float({ min: 100, max: 499 })
    };

    const response = await requestAPI
      .post("/api/v1/payment/vehicle-application")
      .set("Authorization", `Bearer ${seededcashier.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(400);
    expect(responseBody.message).toBe("Cash tendered is less than the required amount due.");
  });

  it("should return status 404 and throw an error vehicle application id does not exist", async () => {
    const seededcashier = await seedAuthenticatedUser({ role: "CASHIER", expiration: "1h" });

    const amountDue = faker.number.float({ min: 500, max: 5000 });

    const payload: VehicleApplicationPaymentRequest = {
      vehicleApplicationId: faker.string.uuid(),
      amountDue: amountDue,
      cashTendered: faker.number.float({ min: amountDue, max: 10000 })
    };

    const response = await requestAPI
      .post("/api/v1/payment/vehicle-application")
      .set("Authorization", `Bearer ${seededcashier.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(404);
    expect(responseBody.message).toBe("Vehicle Application not found.");
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
