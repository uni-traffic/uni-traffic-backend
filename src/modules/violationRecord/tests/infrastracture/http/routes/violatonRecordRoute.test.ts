import { v4 as uuid } from "uuid";
import type TestAgent from "supertest/lib/agent";
import request from "supertest";
import type { IViolationRecordDTO } from "../../../../src/dtos/violationRecordDTO";
import app from "../../../../../../../api";
import { db } from "../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { createUserPersistenceData } from "../../../../../user/tests/utils/user/createUserPersistenceData";
import { createViolationPersistenceData } from "../../../../../violation/tests/utils/violation/createViolationPersistenceData";
import { createVehiclePersistenceData } from "../../../../../vehicle/tests/utils/vehicle/createVehiclePersistenceData";
import { faker } from "@faker-js/faker";
import type { ViolationRecordRequest } from "../../../../src/dtos/violationRecordRequestSchema";

const assertViolationRecord = (
  received: IViolationRecordDTO | IViolationRecordDTO[],
  expected: IViolationRecordDTO
) => {
  const records = Array.isArray(received) ? received : [received];
  expect(records).toBeInstanceOf(Array);
  expect(records).not.toHaveLength(0);

  const record = records[0];

  expect(record.id).toBe(expected.id);
  expect(record.reportedById).toBe(expected.reportedById);
  expect(record.reporter?.id).toBe(expected.reporter?.id);
  expect(record.status).toBe(expected.status);
  expect(record.user?.id).toBe(expected.user?.id);
  expect(record.userId).toBe(expected.userId);
  expect(record.vehicle?.id).toBe(expected.vehicle?.id);
  expect(record.vehicleId).toBe(expected.vehicleId);
  expect(record.violation?.id).toBe(expected.violation?.id);
  expect(record.violationId).toBe(expected.violationId);
};

describe("GET /api/v1/violationRecord", () => {
  let requestAPI: TestAgent;
  let seededViolation: IViolationRecordDTO;

  beforeAll(async () => {
    requestAPI = request.agent(app);
  });

  beforeEach(async () => {
    await db.violationRecord.deleteMany();
    await db.vehicle.deleteMany();
    await db.violation.deleteMany();
    await db.user.deleteMany();

    const user = await db.user.create({
      data: createUserPersistenceData({})
    });

    const reporter = await db.user.create({
      data: createUserPersistenceData({})
    });

    const violation = await db.violation.create({
      data: createViolationPersistenceData({})
    });

    const vehicleData = createVehiclePersistenceData({});
    const { owner, ...vehicleDataWithoutOwner } = vehicleData;

    const vehicle = await db.vehicle.create({
      data: {
        ...vehicleDataWithoutOwner,
        ownerId: user.id
      },
      include: {
        owner: true
      }
    });

    seededViolation = await db.violationRecord.create({
      data: {
        id: uuid(),
        violationId: violation.id,
        vehicleId: vehicle.id,
        userId: user.id,
        reportedById: reporter.id,
        status: faker.helpers.arrayElement(["UNPAID", "PAID"])
      },
      include: {
        reporter: true,
        user: true,
        vehicle: {
          include: {
            owner: true
          }
        },
        violation: true
      }
    });
  });

  it("should return status 200 when provided with id, vehicleId, userId", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const mockDataRequest: ViolationRecordRequest = {
      id: seededViolation.id,
      vehicleId: seededViolation.vehicleId,
      userId: seededViolation.userId
    };

    const response = await requestAPI
      .get("/api/v1/violationRecord")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(mockDataRequest);

    expect(response.status).toBe(200);
    assertViolationRecord(response.body, seededViolation);
  });

  it("should return status 200 when provided with id and vehicleId only", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const mockDataRequest: ViolationRecordRequest = {
      id: seededViolation.id,
      vehicleId: seededViolation.vehicleId
    };

    const response = await requestAPI
      .get("/api/v1/violationRecord")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(mockDataRequest);

    expect(response.status).toBe(200);
    assertViolationRecord(response.body, seededViolation);
  });

  it("should return status 400 when provided with id only", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const mockDataRequest: ViolationRecordRequest = {
      id: seededViolation.id
    };

    const response = await requestAPI
      .get("/api/v1/violationRecord")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(mockDataRequest);

    expect(response.status).toBe(400);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]?.errors?.issues?.[0]?.message).toContain(
      "At least one of 'vehicleId', 'userId', 'reportedBy', or 'violationId' must be provided."
    );    
  });

  it("should return status 401 if the token is invalid or malformed", async () => {
    const mockDataRequest: ViolationRecordRequest = {
      id: seededViolation.id,
      vehicleId: seededViolation.vehicleId,
      reportedById: seededViolation.reportedById,
      userId: seededViolation.userId
    };

    const response = await requestAPI
      .get("/api/v1/violationRecord")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .query(mockDataRequest);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("The provided token is invalid or malformed.");
  });

  it("should return status 401 if no access token is provided", async () => {
    const mockDataRequest: ViolationRecordRequest = {
      id: seededViolation.id,
      vehicleId: seededViolation.vehicleId,
      reportedById: seededViolation.reportedById,
      userId: seededViolation.userId
    };

    const response = await requestAPI.get("/api/v1/violationRecord").query(mockDataRequest);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token is required "Bearer {token}"');
  });

  it("should return status 403 if the user lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "STUDENT",
      expiration: "1h"
    });

    const mockDataRequest: ViolationRecordRequest = {
      id: seededViolation.id,
      vehicleId: seededViolation.vehicleId,
      reportedById: seededViolation.reportedById,
      userId: seededViolation.userId
    };

    const response = await requestAPI
      .get("/api/v1/violationRecord")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(mockDataRequest);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("You can only access your own violation records.");
  });
});
