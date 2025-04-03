import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { VehicleApplicationRepository } from "../../../../../src/repositories/vehicleApplicationRepository";
import { seedVehicleApplication } from "../../../../utils/seedVehicleApplication";

describe("POST api/v1/vehicle-application/update/sticker", () => {
  let vehicleApplicationRepository: VehicleApplicationRepository;
  let requestAPI: TestAgent;

  beforeAll(async () => {
    requestAPI = request.agent(app);
    vehicleApplicationRepository = new VehicleApplicationRepository();
  });

  beforeEach(async () => {
    await db.vehicleApplication.deleteMany();
    await db.user.deleteMany();
  });

  it("should return status 200 and successfully update the sticker number and status to APPROVED", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER"]),
      expiration: "1h"
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });

    const payload = {
      vehicleApplicationId: seededVehicleApplication.id,
      stickerNumber: `STICKER-${faker.string.alphanumeric(6)}`
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/sticker")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.stickerNumber).toBe(payload.stickerNumber);
    expect(responseBody.status).toBe("APPROVED");

    const vehicleApplicationFromDatabase =
      await vehicleApplicationRepository.getVehicleApplicationById(seededVehicleApplication.id);

    expect(vehicleApplicationFromDatabase).not.toBeNull();
    expect(vehicleApplicationFromDatabase?.stickerNumber).toBe(payload.stickerNumber);
    expect(vehicleApplicationFromDatabase?.status.value).toBe("APPROVED");
  });

  it("should return status 400 when sticker number is not provided", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER"]),
      expiration: "1h"
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });

    const payload = {
      vehicleApplicationId: seededVehicleApplication.id
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/sticker")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(400);
  });

  it("should return status 400 when sticker number is empty", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER"]),
      expiration: "1h"
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });

    const payload = {
      vehicleApplicationId: seededVehicleApplication.id,
      stickerNumber: ""
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/sticker")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(400);
  });

  it("should return status 404 when vehicle id provided does not exist", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER"]),
      expiration: "1h"
    });

    const payload = {
      vehicleApplicationId: faker.string.uuid(),
      stickerNumber: `STICKER-${faker.string.alphanumeric(6)}`
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/sticker")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(404);
  });

  it("should return status 400 when vehicle id is not provided", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER"]),
      expiration: "1h"
    });

    const payload = {
      stickerNumber: `STICKER-${faker.string.alphanumeric(6)}`
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/sticker")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(400);
  });

  it("should return status 403 when user lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["SECURITY", "STUDENT", "STAFF"]),
      expiration: "1h"
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });

    const payload = {
      vehicleApplicationId: seededVehicleApplication.id,
      stickerNumber: `STICKER-${faker.string.alphanumeric(6)}`
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/sticker")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(403);
  });

  it("should return status 400 when application is not in PENDING_FOR_STICKER status", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER"]),
      expiration: "1h"
    });
    const seededVehicleApplication = await seedVehicleApplication({
      status: faker.helpers.arrayElement([
        "PENDING_FOR_SECURITY_APPROVAL",
        "PENDING_FOR_PAYMENT",
        "APPROVED",
        "REJECTED"
      ])
    });

    const payload = {
      vehicleApplicationId: seededVehicleApplication.id,
      stickerNumber: `STICKER-${faker.string.alphanumeric(6)}`
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/sticker")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(400);
  });

  it("should return status 401 when token is expired", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER"]),
      expiration: "1s"
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });

    const payload = {
      vehicleApplicationId: seededVehicleApplication.id,
      stickerNumber: `STICKER-${faker.string.alphanumeric(6)}`
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/sticker")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .send(payload);

    expect(response.status).toBe(401);
  });

  it("should return status 401 when token is invalid", async () => {
    const seededVehicleApplication = await seedVehicleApplication({
      status: "PENDING_FOR_STICKER"
    });

    const payload = {
      vehicleApplicationId: seededVehicleApplication.id,
      stickerNumber: `STICKER-${faker.string.alphanumeric(6)}`
    };

    const response = await requestAPI
      .post("/api/v1/vehicle-application/update/sticker")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .send(payload);

    expect(response.status).toBe(401);
  });
});
