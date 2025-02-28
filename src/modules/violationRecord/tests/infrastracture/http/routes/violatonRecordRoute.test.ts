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

const assertViolationRecord = (received: IViolationRecordDTO, expected: IViolationRecordDTO) => {
  expect(received.id).toBe(expected.id);
  expect(received.reportedById).toBe(expected.reportedById);
  expect(received.reporter?.id).toBe(expected.reporter?.id);
  expect(received.status).toBe(expected.status);
  expect(received.user?.id).toBe(expected.user?.id);
  expect(received.userId).toBe(expected.userId);
  expect(received.vehicle?.id).toBe(expected.vehicle?.id);
  expect(received.vehicleId).toBe(expected.vehicleId);
  expect(received.violation?.id).toBe(expected.violation?.id);
  expect(received.violationId).toBe(expected.violationId);
};

describe("GET /api/v1/violationRecord", () => {
  let requestAPI: TestAgent;
  let seededViolation: IViolationRecordDTO;

  beforeAll(async () => {
    requestAPI = request.agent(app);
  });

  beforeEach(async () => {
    await db.user.deleteMany();
    await db.vehicle.deleteMany();
    await db.violationRecord.deleteMany();

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

    await db.vehicle.create({
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
        vehicleId: vehicleData.id,
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

  it("should return status 200 when provided with id, vehicleId, userId, violationId", async () => {
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

    const responseBody: IViolationRecordDTO = response.body;

    expect(response.status).toBe(200);
    assertViolationRecord(responseBody, seededViolation);
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

    const responseBody: IViolationRecordDTO = response.body;

    expect(response.status).toBe(200);
    assertViolationRecord(responseBody, seededViolation);
  });

  it("should return status 200 when provided with id and userId only", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const mockDataRequest: ViolationRecordRequest = {
      id: seededViolation.id,
      userId: seededViolation.userId
    };

    const response = await requestAPI
      .get("/api/v1/violationRecord")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(mockDataRequest);

    const responseBody: IViolationRecordDTO = response.body;

    expect(response.status).toBe(200);
    assertViolationRecord(responseBody, seededViolation);
  });

  it("should return status 200 when provided with id and reportedById only", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const mockDataRequest: ViolationRecordRequest = {
      id: seededViolation.id,
      reportedById: seededViolation.reportedById
    };

    const response = await requestAPI
      .get("/api/v1/violationRecord")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(mockDataRequest);

    const responseBody: IViolationRecordDTO = response.body;

    expect(response.status).toBe(200);
    assertViolationRecord(responseBody, seededViolation);
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
    expect(response.body[0].errors.issues[0].message).toContain(
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

  it("should return status 401 if the token is expired", async () => {
    const mockDataRequest: ViolationRecordRequest = {
      id: seededViolation.id,
      vehicleId: seededViolation.vehicleId,
      reportedById: seededViolation.reportedById,
      userId: seededViolation.userId
    };

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      expiration: "1s",
      role: "SECURITY"
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requestAPI
      .get("/api/v1/violationRecord")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(mockDataRequest);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return status 403 if the user lacks permission", async () => {
    const mockDataRequest: ViolationRecordRequest = {
      id: seededViolation.id,
      vehicleId: seededViolation.vehicleId,
      reportedById: seededViolation.reportedById,
      userId: seededViolation.userId
    };

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "STUDENT",
      expiration: "1h"
    });

    const response = await requestAPI
      .get("/api/v1/violationRecord")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(mockDataRequest);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("You can only access your own violation records.");
  });
});
