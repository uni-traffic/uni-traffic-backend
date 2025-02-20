import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedVehicle } from "../../../../utils/vehicle/seedVehicle";

describe("GET /api/v1/vehicle/:vehicleId", () => {
  let requestAPI: TestAgent;

  beforeAll(() => {
    requestAPI = request(app);
  });

  beforeEach(async () => {
    await db.vehicle.deleteMany();
    await db.user.deleteMany();
  });

  it("should return a 401 status code when Authorization or accessToken is not provided", async () => {
    const seededVehicle = await seedVehicle({});

    const response = await requestAPI.get(`/api/v1/vehicle/${seededVehicle.id}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token is required "Bearer {token}"');
  });

  it("should return a 403 status code when the user does not have ADMIN or SECURITY role", async () => {
    const seededUser = await seedAuthenticatedUser({
      role: "STUDENT", 
      expiration: "1h",
    });

    const seededVehicle = await seedVehicle({});

    const response = await requestAPI
      .get(`/api/v1/vehicle/${seededVehicle.id}`)
      .set("Authorization", `Bearer ${seededUser.accessToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("You do not have the required permissions to access vehicle information.");
  });

  it("should return a 200 status code and vehicle information for an ADMIN user", async () => {
    const adminUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h",
    });

    const seededVehicle = await seedVehicle({});

    const response = await requestAPI
      .get(`/api/v1/vehicle/${seededVehicle.id}`)
      .set("Authorization", `Bearer ${adminUser.accessToken}`);

    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.id).toBe(seededVehicle.id);
    expect(responseBody.owner).toBeDefined();
    expect(responseBody.licenseNumber).toBeDefined();
    expect(responseBody.stickerNumber).toBeDefined();
    expect(responseBody.isActive).toBeDefined();
  });

  it("should return a 200 status code and vehicle information for a SECURITY user", async () => {
    const securityUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h",
    });

    const seededVehicle = await seedVehicle({});

    const response = await requestAPI
      .get(`/api/v1/vehicle/${seededVehicle.id}`)
      .set("Authorization", `Bearer ${securityUser.accessToken}`);

    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.id).toBe(seededVehicle.id);
    expect(responseBody.owner).toBeDefined();
    expect(responseBody.licenseNumber).toBeDefined();
    expect(responseBody.stickerNumber).toBeDefined();
    expect(responseBody.isActive).toBeDefined();
  });

  it("should return a 404 status code when provided with a non-existing vehicleId", async () => {
    const adminUser = await seedAuthenticatedUser({
      role: "ADMIN",
      expiration: "1h",
    });

    const nonExistentVehicleId = faker.string.uuid();

    const response = await requestAPI
      .get(`/api/v1/vehicle/${nonExistentVehicleId}`)
      .set("Authorization", `Bearer ${adminUser.accessToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Vehicle not found.");
  });
});
