import type TestAgent from "supertest/lib/agent";
import request from "supertest";
import type { IViolationRecordDTO } from "../../../../src/dtos/violationRecordDTO";
import app from "../../../../../../../api";
import { db } from "../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
import type { ViolationRecordGetRequest } from "../../../../src/dtos/violationRecordRequestSchema";
import { seedViolationRecord } from "../../../utils/violationRecord/seedViolationRecord";
import { seedVehicle } from "../../../../../vehicle/tests/utils/vehicle/seedVehicle";
import { seedUser } from "../../../../../user/tests/utils/user/seedUser";
import { seedViolation } from "../../../../../violation/tests/utils/violation/seedViolation";
import { faker } from "@faker-js/faker";


describe("GET /api/v1/violation-record/search", () => {
  let requestAPI: TestAgent;

  beforeAll(async () => {
    requestAPI = request.agent(app);
  });

  beforeEach(async () => {
    await db.violationRecord.deleteMany();
    await db.vehicle.deleteMany();
    await db.violation.deleteMany();
    await db.user.deleteMany();
  });

  it("should return status 200 when provided with id", async () => {
    const seededViolationRecord = await seedViolationRecord({});
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const payload: ViolationRecordGetRequest = {
      id: seededViolationRecord.id
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody[0].id).toBe(seededViolationRecord.id);
    expect(responseBody[0].reportedById).toBe(seededViolationRecord.reportedById);
    expect(responseBody[0].status).toBe(seededViolationRecord.status);
    expect(responseBody[0].userId).toBe(seededViolationRecord.userId);
    expect(responseBody[0].vehicleId).toBe(seededViolationRecord.vehicleId);
    expect(responseBody[0].violationId).toBe(seededViolationRecord.violationId);
  });

  it("should return status 200 and violation records when provided with vehicle id", async () => {
    const seededVehicle = await seedVehicle({});
    const seededViolationRecord1 = await seedViolationRecord({ vehicleId: seededVehicle.id });
    const seededViolationRecord2 = await seedViolationRecord({ vehicleId: seededVehicle.id });
    const seededViolationRecord3 = await seedViolationRecord({ vehicleId: seededVehicle.id });
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const payload: ViolationRecordGetRequest = {
      vehicleId: seededVehicle.id
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as IViolationRecordDTO[];
    const mappedResult = responseBody.map((violationRecord) => violationRecord.id);

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(3);
    expect(mappedResult).toContain(seededViolationRecord1.id);
    expect(mappedResult).toContain(seededViolationRecord2.id);
    expect(mappedResult).toContain(seededViolationRecord3.id);
  });

  it("should return status 200 and violation records when provided with user id", async () => {
    const seededUser = await seedUser({});
    const seededViolationRecord1 = await seedViolationRecord({ userId: seededUser.id });
    const seededViolationRecord2 = await seedViolationRecord({ userId: seededUser.id });
    const seededViolationRecord3 = await seedViolationRecord({ userId: seededUser.id });
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const payload: ViolationRecordGetRequest = {
      userId: seededUser.id
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as IViolationRecordDTO[];
    const mappedResult = responseBody.map((violationRecord) => violationRecord.id);

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(3);
    expect(mappedResult).toContain(seededViolationRecord1.id);
    expect(mappedResult).toContain(seededViolationRecord2.id);
    expect(mappedResult).toContain(seededViolationRecord3.id);
  });

  it("should return status 200 and violation records when provided with violation id", async () => {
    const seededViolation = await seedViolation({});
    const seededViolationRecord1 = await seedViolationRecord({ violationId: seededViolation.id });
    const seededViolationRecord2 = await seedViolationRecord({ violationId: seededViolation.id });
    const seededViolationRecord3 = await seedViolationRecord({ violationId: seededViolation.id });
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const payload: ViolationRecordGetRequest = {
      violationId: seededViolation.id
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as IViolationRecordDTO[];
    const mappedResult = responseBody.map((violationRecord) => violationRecord.id);

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(3);
    expect(mappedResult).toContain(seededViolationRecord1.id);
    expect(mappedResult).toContain(seededViolationRecord2.id);
    expect(mappedResult).toContain(seededViolationRecord3.id);
  });

  it("should return status 200 and retrieve record by the given status", async () => {
    const seededViolationRecord1 = await seedViolationRecord({ status: "PAID" });
    const seededViolationRecord2 = await seedViolationRecord({ status: "PAID" });
    const seededViolationRecord3 = await seedViolationRecord({ status: "PAID" });
    const seededViolationRecord4 = await seedViolationRecord({ status: "UNPAID" });
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const payload: ViolationRecordGetRequest = {
      status: "PAID"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as IViolationRecordDTO[];
    const mappedResult = responseBody.map((violationRecord) => violationRecord.id);

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(3);
    expect(mappedResult).toContain(seededViolationRecord1.id);
    expect(mappedResult).toContain(seededViolationRecord2.id);
    expect(mappedResult).toContain(seededViolationRecord3.id);
    expect(mappedResult).not.toContain(seededViolationRecord4.id);
  });

  it("should return status 200 and violation records by the given parameters", async () => {
    const seededUser = await seedUser({});
    const seededViolation = await seedViolation({});
    const seededViolationRecord1 = await seedViolationRecord({
      status: "UNPAID",
      userId: seededUser.id,
      violationId: seededViolation.id
    });
    const seededViolationRecord2 = await seedViolationRecord({
      status: "UNPAID",
      userId: seededUser.id,
      violationId: seededViolation.id
    });
    const seededViolationRecord3 = await seedViolationRecord({
      status: "UNPAID",
      userId: seededUser.id,
      violationId: seededViolation.id
    });
    const seededViolationRecord4 = await seedViolationRecord({
      status: "PAID",
      userId: seededUser.id,
      violationId: seededViolation.id
    });
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const payload: ViolationRecordGetRequest = {
      status: "UNPAID",
      userId: seededUser.id,
      violationId: seededViolation.id
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as IViolationRecordDTO[];
    const mappedResult = responseBody.map((violationRecord) => violationRecord.id);

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(3);
    expect(mappedResult).toContain(seededViolationRecord1.id);
    expect(mappedResult).toContain(seededViolationRecord2.id);
    expect(mappedResult).toContain(seededViolationRecord3.id);
    expect(mappedResult).not.toContain(seededViolationRecord4.id);
  });

  it("should return status 200 and violation records by the given parameters", async () => {
    const seededVehicle = await seedVehicle({});
    const seededViolation = await seedViolation({});
    const seededViolationRecord1 = await seedViolationRecord({
      status: "UNPAID",
      vehicleId: seededVehicle.id,
      violationId: seededViolation.id
    });
    const seededViolationRecord2 = await seedViolationRecord({
      status: "UNPAID",
      vehicleId: seededVehicle.id,
      violationId: seededViolation.id
    });
    const seededViolationRecord3 = await seedViolationRecord({
      status: "UNPAID",
      vehicleId: seededVehicle.id,
      violationId: seededViolation.id
    });
    const seededViolationRecord4 = await seedViolationRecord({
      status: "PAID",
      vehicleId: seededVehicle.id,
      violationId: seededViolation.id
    });
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const payload: ViolationRecordGetRequest = {
      status: "UNPAID",
      vehicleId: seededVehicle.id,
      violationId: seededViolation.id
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as IViolationRecordDTO[];
    const mappedResult = responseBody.map((violationRecord) => violationRecord.id);

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(3);
    expect(mappedResult).toContain(seededViolationRecord1.id);
    expect(mappedResult).toContain(seededViolationRecord2.id);
    expect(mappedResult).toContain(seededViolationRecord3.id);
    expect(mappedResult).not.toContain(seededViolationRecord4.id);
  });

  it("should return status 200 when user id match the authenticated user", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF"])
    });
    const seededViolationRecord1 = await seedViolationRecord({ userId: seededAuthenticatedUser.id })
    const seededViolationRecord2 = await seedViolationRecord({ userId: seededAuthenticatedUser.id })

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        userId: seededAuthenticatedUser.id
      });
    const responseBody = response.body as IViolationRecordDTO[];
    const mappedResult = responseBody.map((violationRecord) => violationRecord.id);

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(2);
    expect(mappedResult).toContain(seededViolationRecord1.id);
    expect(mappedResult).toContain(seededViolationRecord2.id);
  });

  it("should return status 400 when no parameters passed", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({});

    expect(response.status).toBe(400);
  });


  it("should return status 403 status code and message when Authorization provided lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF"])
    });

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        userId: faker.string.uuid()
      });
    const responseBody = response.body;

    expect(response.status).toBe(403);
    expect(responseBody.message).toBe(
      "You do not have the required permissions to perform this action."
    );
  });

  it("should return a 401 status code when the provided Authorization is expired", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      expiration: "1s",
      role: faker.helpers.arrayElement(["SECURITY"])
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        userId: faker.string.uuid()
      });
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return a 401 status code when the provided Authorization is malformed", async () => {
    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .query({
        id: faker.string.uuid()
      });
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("The provided token is invalid or malformed.");
  });
});
