import type TestAgent from "supertest/lib/agent";
import request from "supertest";
import { VehicleApplicationRepository } from "../../../../../src/repositories/vehicleApplicationRepository";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedVehicleApplication } from "../../../../utils/seedVehicleApplication";
import { faker } from "@faker-js/faker";

describe("POST api/v1/vehicle-application/update/status", () => {
  let vehicleApplcationRepository: VehicleApplicationRepository;
  let requestAPI: TestAgent;

  beforeAll(async () => {
    requestAPI = request.agent(app);
    vehicleApplcationRepository = new VehicleApplicationRepository();
  });

  beforeEach(async () => {
    await db.vehicleApplication.deleteMany();
    await db.user.deleteMany();
  });

  it("should return status 200 and successfully update the vehicle application status(PENDING_FOR_SECURITY_APPROVAL)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_SECURITY_APPROVAL"
    });

    const payload = {
      vehicleApplicationId: seededVehicleApplication.id,
      status: "PENDING_FOR_PAYMENT"
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.status).toBe("PENDING_FOR_PAYMENT");

    const vehicleApplicationFromDatabase =
      await vehicleApplcationRepository.getVehicleApplicationById(seededVehicleApplication.id);

    expect(vehicleApplicationFromDatabase).not.toBeNull();
    expect(vehicleApplicationFromDatabase?.status.value).toBe("PENDING_FOR_PAYMENT");
  });

  it("should return status 200 and successfully update the vehicle application status(PENDING_FOR_PAYMENT)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });

    const payload = {
      vehicleApplicationId: seededVehicleApplication.id,
      status: "PENDING_FOR_STICKER"
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.status).toBe("PENDING_FOR_STICKER");

    const vehicleApplicationFromDatabase =
      await vehicleApplcationRepository.getVehicleApplicationById(seededVehicleApplication.id);

    expect(vehicleApplicationFromDatabase).not.toBeNull();
    expect(vehicleApplicationFromDatabase?.status.value).toBe("PENDING_FOR_STICKER");
  });

  it("should return status 200 and successfully update the vehicle application status(PENDING_FOR_STICKER)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });

    const payload = {
      vehicleApplicationId: seededVehicleApplication.id,
      status: "APPROVED"
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.status).toBe("APPROVED");

    const vehicleApplicationFromDatabase =
      await vehicleApplcationRepository.getVehicleApplicationById(seededVehicleApplication.id);

    expect(vehicleApplicationFromDatabase).not.toBeNull();
    expect(vehicleApplicationFromDatabase?.status.value).toBe("APPROVED");
  });

  it("should return status 400 when the status is APPROVED and vehicle application status goes backward update", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "APPROVED"
    });

    const payload = {
      vehicleApplicationId: seededVehicleApplication.id,
      status: "PENDING_FOR_SECURITY_APPROVAL"
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(400);
    expect(responseBody.message).toBe(
      `Invalid transition from ${seededVehicleApplication.status} to ${payload.status}`
    );
  });

  it("should return status 400 when the status is DENIED and vehicle application status goes backward update", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "DENIED"
    });

    const payload = {
      vehicleApplicationId: seededVehicleApplication.id,
      status: "APPROVED"
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(400);
    expect(responseBody.message).toBe(
      `Invalid transition from ${seededVehicleApplication.status} to ${payload.status}`
    );
  });

  it("should return status 400 when the status is DENIED but does not have remarks", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });

    const payload = {
      vehicleApplicationId: seededVehicleApplication.id,
      status: "DENIED"
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(400);
    expect(responseBody.message).toBe("Remarks are required when setting status to DENIED.");
  });

  it("should return status 400 if the vehicle application status goes backward update", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_PAYMENT"
    });

    const payload = {
      vehicleApplicationId: seededVehicleApplication.id,
      status: "PENDING_FOR_SECURITY_APPROVAL"
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(400);
    expect(responseBody.message).toBe(
      `Invalid transition from ${seededVehicleApplication.status} to ${payload.status}`
    );
  });

  it("should return status 404 when vehicle id provided does not exist in the database", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });

    const payload = {
      vehicleApplicationId: faker.string.uuid(),
      status: "PENDING_FOR_PAYMENT"
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(404);
    expect(responseBody.message).toBe("Vehicle Application Not Found");
  });

  it("should return status 400 when vehicle id is not provided", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });

    const payload = {
      status: "PENDING_FOR_PAYMENT"
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(400);
  });

  it("should return status 400 when status is not provided", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });

    const payload = {
      vehicleApplicationId: faker.string.uuid()
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(400);
  });

  it("should return status 400 when status is does not exist in the database", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"]),
      expiration: "1h"
    });

    const payload = {
      vehicleApplicationId: faker.string.uuid(),
      status: "Non-existing status"
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(400);
  });

  it("should return status 403 when Authorization provided lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF", "GUEST", "UNVERIFIED"]),
      expiration: "1h"
    });

    const payload = {
      vehicleApplicationId: faker.string.uuid(),
      status: "PENDING_FOR_SECURITY_APPROVAL"
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });

  it("should return status 401 when the provided Authorization expired", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF", "GUEST", "UNVERIFIED"]),
      expiration: "1s"
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const payload = {
      vehicleApplicationId: faker.string.uuid(),
      status: "PENDING_FOR_SECURITY_APPROVAL"
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/status")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return status 401 when provided Authorization is malformed", async () => {
    const payload = {
      vehicleApplicationId: faker.string.uuid(),
      status: "PENDING_FOR_SECURITY_APPROVAL"
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/status")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("The provided token is invalid or malformed.");
  });
});
