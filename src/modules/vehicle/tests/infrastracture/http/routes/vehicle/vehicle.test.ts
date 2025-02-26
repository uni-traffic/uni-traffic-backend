import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import type { IVehicleDTO } from "../../../../../src/dtos/vehicleDTO";
import type { VehicleRequest } from "../../../../../src/dtos/vehicleRequestSchema";
import { seedVehicle } from "../../../../utils/vehicle/seedVehicle";

const assertVehicle = (received: IVehicleDTO, expected: IVehicleDTO) => {
  expect(received.id).toBe(expected.id);
  expect(received.isActive).toBe(expected.isActive);
  expect(received.licensePlate).toBe(expected.licensePlate);
  expect(received.make).toBe(expected.make);
  expect(received.model).toBe(expected.model);
  expect(received.series).toBe(expected.series);
  expect(received.color).toBe(expected.color);
  expect(received.type).toBe(expected.type);
  expect(received.images).toStrictEqual(expected.images);
  expect(received.stickerNumber).toBe(expected.stickerNumber);
  expect(received.ownerId).toBe(expected.ownerId);
  expect(received.owner).toBeDefined();
};

describe("GET /api/v1/vehicle", () => {
  let requestAPI: TestAgent;

  beforeAll(() => {
    requestAPI = request(app);
  });

  beforeEach(async () => {
    await db.vehicle.deleteMany();
    await db.user.deleteMany();
  });

  it("should return status 200 when provided with id", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const seededVehicle = await seedVehicle({});
    const mockRequestData: VehicleRequest = {
      id: seededVehicle.id
    };

    const response = await requestAPI
      .get("/api/v1/vehicle")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(mockRequestData);
    const responseBody: IVehicleDTO = response.body;

    expect(response.status).toBe(200);
    assertVehicle(responseBody, seededVehicle);
  });

  it("should return status 200 when provided with licenseNumber", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const seededVehicle = await seedVehicle({});
    const mockRequestData: VehicleRequest = {
      licensePlate: seededVehicle.licensePlate
    };

    const response = await requestAPI
      .get("/api/v1/vehicle")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(mockRequestData);
    const responseBody: IVehicleDTO = response.body;

    expect(response.status).toBe(200);
    assertVehicle(responseBody, seededVehicle);
  });

  it("should return status 200 when provided with stickerNumber", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const seededVehicle = await seedVehicle({});
    const mockRequestData: VehicleRequest = {
      stickerNumber: seededVehicle.stickerNumber
    };

    const response = await requestAPI
      .get("/api/v1/vehicle")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(mockRequestData);
    const responseBody: IVehicleDTO = response.body;

    expect(response.status).toBe(200);
    assertVehicle(responseBody, seededVehicle);
  });

  it("should return status 400 when no parameters passed", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const response = await requestAPI
      .get("/api/v1/vehicle")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({});

    expect(response.status).toBe(400);
  });

  it("should return a 403 status code and message when Authorization provided lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF"])
    });

    const response = await requestAPI
      .get("/api/v1/vehicle")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        id: faker.string.uuid()
      });
    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });

  it("should return a 401 status code when Authorization or accessToken is not provided", async () => {
    const response = await requestAPI.get("/api/v1/vehicle").query({
      id: faker.string.uuid()
    });
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe('Access token is required "Bearer {token}"');
  });

  it("should return a 401 status code when the provided Authorization is expired", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      expiration: "1s",
      role: faker.helpers.arrayElement(["SECURITY"])
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requestAPI
      .get("/api/v1/vehicle")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        id: faker.string.uuid()
      });
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return a 401 status code when the provided Authorization is malformed", async () => {
    const response = await requestAPI
      .get("/api/v1/vehicle")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .query({
        id: faker.string.uuid()
      });
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("The provided token is invalid or malformed.");
  });
});
