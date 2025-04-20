import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedUser } from "../../../../../../user/tests/utils/user/seedUser";
import type { GetVehicleResponse } from "../../../../../src/dtos/vehicleDTO";
import { seedVehicle } from "../../../../utils/vehicle/seedVehicle";

describe("GET /api/v1/vehicle/search", () => {
  let requestAPI: TestAgent;

  beforeAll(() => {
    requestAPI = request(app);
  });

  beforeEach(async () => {
    await db.user.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return status 200 and the vehicle that match the ID", async () => {
    const seededVehicle = await seedVehicle({});
    await Promise.all([seedVehicle({}), seedVehicle({}), seedVehicle({})]);

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const response = await requestAPI
      .get("/api/v1/vehicle/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        id: seededVehicle.id,
        count: "5",
        page: "1"
      });
    const responseBody: GetVehicleResponse = response.body;

    expect(responseBody.vehicles.length).toBeGreaterThan(0);
    expect(responseBody.hasNextPage).toBe(false);
    expect(responseBody.hasPreviousPage).toBe(false);
    expect(responseBody.totalPages).toBe(1);
    expect(responseBody.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle.id,
          stickerNumber: seededVehicle.stickerNumber,
          licensePlate: seededVehicle.licensePlate
        })
      ])
    );
  });

  it("should return status 200 and the vehicle that match the license plate", async () => {
    const seededVehicle = await seedVehicle({});
    await Promise.all([seedVehicle({}), seedVehicle({}), seedVehicle({})]);

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const response = await requestAPI
      .get("/api/v1/vehicle/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        licensePlate: seededVehicle.licensePlate,
        count: "5",
        page: "1"
      });
    const result: GetVehicleResponse = response.body;

    expect(response.status).toBe(200);
    expect(result.vehicles.length).toBeGreaterThan(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle.id,
          stickerNumber: seededVehicle.stickerNumber,
          licensePlate: seededVehicle.licensePlate
        })
      ])
    );
  });

  it("should return status 200 and the vehicle that match the sticker number", async () => {
    const seededVehicle = await seedVehicle({});
    await Promise.all([seedVehicle({}), seedVehicle({}), seedVehicle({})]);

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const response = await requestAPI
      .get("/api/v1/vehicle/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        stickerNumber: seededVehicle.stickerNumber,
        count: "5",
        page: "1"
      });
    const result: GetVehicleResponse = response.body;

    expect(response.status).toBe(200);
    expect(result.vehicles.length).toBeGreaterThan(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle.id,
          stickerNumber: seededVehicle.stickerNumber,
          licensePlate: seededVehicle.licensePlate
        })
      ])
    );
  });

  it("should return status 200 and the vehicle that match the owner id", async () => {
    const seededUser = await seedUser({ role: "STUDENT" });
    const [seededVehicle1, seededVehicle2] = await Promise.all([
      seedVehicle({
        ownerId: seededUser.id
      }),
      seedVehicle({
        ownerId: seededUser.id
      }),
      seedVehicle({})
    ]);

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const response = await requestAPI
      .get("/api/v1/vehicle/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        ownerId: seededUser.id,
        count: "5",
        page: "1"
      });
    const result: GetVehicleResponse = response.body;

    expect(response.status).toBe(200);
    expect(result.vehicles.length).toBeGreaterThan(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle1.id,
          stickerNumber: seededVehicle1.stickerNumber,
          licensePlate: seededVehicle1.licensePlate
        }),
        expect.objectContaining({
          id: seededVehicle2.id,
          stickerNumber: seededVehicle2.stickerNumber,
          licensePlate: seededVehicle2.licensePlate
        })
      ])
    );
  });

  it("should return status 200 and vehicles that matches license plate with the given search key", async () => {
    const [seededVehicle1, seededVehicle2] = await Promise.all([
      seedVehicle({
        stickerNumber: "20201234",
        licensePlate: "ABC1234"
      }),
      seedVehicle({
        stickerNumber: "20201235",
        licensePlate: "145ABC"
      }),
      seedVehicle({})
    ]);

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const response = await requestAPI
      .get("/api/v1/vehicle/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        searchKey: "ABC",
        count: "5",
        page: "1"
      });
    const result: GetVehicleResponse = response.body;

    expect(response.status).toBe(200);
    expect(result.vehicles.length).toBeGreaterThan(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle1.id,
          stickerNumber: seededVehicle1.stickerNumber,
          licensePlate: seededVehicle1.licensePlate
        }),
        expect.objectContaining({
          id: seededVehicle2.id,
          stickerNumber: seededVehicle2.stickerNumber,
          licensePlate: seededVehicle2.licensePlate
        })
      ])
    );
  });

  it("should return status 200 and vehicles that matches sticker number with the given search key", async () => {
    const [seededVehicle1, seededVehicle2] = await Promise.all([
      seedVehicle({
        stickerNumber: "20201234"
      }),
      seedVehicle({
        stickerNumber: "20201235"
      }),
      seedVehicle({})
    ]);

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const response = await requestAPI
      .get("/api/v1/vehicle/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        searchKey: "0123",
        count: "5",
        page: "1"
      });
    const result: GetVehicleResponse = response.body;

    expect(response.status).toBe(200);
    expect(result.vehicles.length).toBeGreaterThan(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle1.id,
          stickerNumber: seededVehicle1.stickerNumber,
          licensePlate: seededVehicle1.licensePlate
        }),
        expect.objectContaining({
          id: seededVehicle2.id,
          stickerNumber: seededVehicle2.stickerNumber,
          licensePlate: seededVehicle2.licensePlate
        })
      ])
    );
  });

  it("should return status 200 and the vehicle that match the owner id when user request for itself", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const seededVehicle = await seedVehicle({
      ownerId: seededAuthenticatedUser.id
    });

    const response = await requestAPI
      .get("/api/v1/vehicle/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        ownerId: seededAuthenticatedUser.id,
        count: "5",
        page: "1"
      });
    const result: GetVehicleResponse = response.body;

    expect(response.status).toBe(200);
    expect(result.vehicles.length).toBeGreaterThan(0);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.totalPages).toBe(1);
    expect(result.vehicles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: seededVehicle.id,
          stickerNumber: seededVehicle.stickerNumber,
          licensePlate: seededVehicle.licensePlate
        })
      ])
    );
  });

  it("should return status 403 when user lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF", "GUEST"]),
      expiration: "1h"
    });

    const response = await requestAPI
      .get("/api/v1/vehicle/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        id: faker.string.uuid(),
        count: "5",
        page: "1"
      });

    expect(response.status).toBe(403);
  });
});
