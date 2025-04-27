import { faker } from "@faker-js/faker";
import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../api";
import { db } from "../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedUser } from "../../../../../user/tests/utils/user/seedUser";
import { seedVehicle } from "../../../../../vehicle/tests/utils/vehicle/seedVehicle";
import { seedViolation } from "../../../../../violation/tests/utils/violation/seedViolation";
import type { GetViolationRecordResponse } from "../../../../src/dtos/violationRecordDTO";
import type { ViolationRecordGetRequest } from "../../../../src/dtos/violationRecordRequestSchema";
import { seedViolationRecord } from "../../../utils/violationRecord/seedViolationRecord";

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

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return status 200 when provided with id", async () => {
    const seededViolationRecord = await seedViolationRecord({});
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const payload: ViolationRecordGetRequest = {
      id: seededViolationRecord.id,
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetViolationRecordResponse;

    expect(response.status).toBe(200);
    expect(responseBody.violation[0].id).toBe(seededViolationRecord.id);
    expect(responseBody.violation[0].reportedById).toBe(seededViolationRecord.reportedById);
    expect(responseBody.violation[0].date).toBeDefined();
    expect(responseBody.violation[0].remarks).toBeDefined();
    expect(responseBody.violation[0].status).toBe(seededViolationRecord.status);
    expect(responseBody.violation[0].userId).toBe(seededViolationRecord.userId);
    expect(responseBody.violation[0].vehicleId).toBe(seededViolationRecord.vehicleId);
    expect(responseBody.violation[0].violationId).toBe(seededViolationRecord.violationId);
  });

  it("should return status 200 and violation records when provided with vehicle id", async () => {
    const seededVehicle = await seedVehicle({});
    const [seededViolationRecord1, seededViolationRecord2, seededViolationRecord3] =
      await Promise.all([
        seedViolationRecord({ vehicleId: seededVehicle.id }),
        seedViolationRecord({ vehicleId: seededVehicle.id }),
        seedViolationRecord({ vehicleId: seededVehicle.id })
      ]);

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const payload: ViolationRecordGetRequest = {
      vehicleId: seededVehicle.id,
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as GetViolationRecordResponse;
    const mappedResult = responseBody.violation.map((violationRecord) => violationRecord.id);

    expect(response.status).toBe(200);
    expect(responseBody.violation.length).toBe(3);
    expect(mappedResult).toContain(seededViolationRecord1.id);
    expect(mappedResult).toContain(seededViolationRecord2.id);
    expect(mappedResult).toContain(seededViolationRecord3.id);
  });

  it("should return status 200 and violation records when provided with user id", async () => {
    const seededUser = await seedUser({});
    const [seededViolationRecord1, seededViolationRecord2, seededViolationRecord3] =
      await Promise.all([
        seedViolationRecord({ userId: seededUser.id }),
        seedViolationRecord({ userId: seededUser.id }),
        seedViolationRecord({ userId: seededUser.id })
      ]);

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const payload: ViolationRecordGetRequest = {
      userId: seededUser.id,
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as GetViolationRecordResponse;
    const mappedResult = responseBody.violation.map((violationRecord) => violationRecord.id);

    expect(response.status).toBe(200);
    expect(responseBody.violation.length).toBe(3);
    expect(mappedResult).toContain(seededViolationRecord1.id);
    expect(mappedResult).toContain(seededViolationRecord2.id);
    expect(mappedResult).toContain(seededViolationRecord3.id);
  });

  it("should return status 200 and violation records when provided with violation id", async () => {
    const seededViolation = await seedViolation({});
    const [seededViolationRecord1, seededViolationRecord2, seededViolationRecord3] =
      await Promise.all([
        seedViolationRecord({ violationId: seededViolation.id }),
        seedViolationRecord({ violationId: seededViolation.id }),
        seedViolationRecord({ violationId: seededViolation.id })
      ]);

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const payload: ViolationRecordGetRequest = {
      violationId: seededViolation.id,
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as GetViolationRecordResponse;
    const mappedResult = responseBody.violation.map((violationRecord) => violationRecord.id);

    expect(response.status).toBe(200);
    expect(responseBody.violation.length).toBe(3);
    expect(mappedResult).toContain(seededViolationRecord1.id);
    expect(mappedResult).toContain(seededViolationRecord2.id);
    expect(mappedResult).toContain(seededViolationRecord3.id);
  });

  it("should return status 200 and retrieve record by the given status", async () => {
    const [
      seededViolationRecord1,
      seededViolationRecord2,
      seededViolationRecord3,
      seededViolationRecord4
    ] = await Promise.all([
      seedViolationRecord({ status: "PAID" }),
      seedViolationRecord({ status: "PAID" }),
      seedViolationRecord({ status: "PAID" }),
      seedViolationRecord({ status: "UNPAID" })
    ]);

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const payload: ViolationRecordGetRequest = {
      status: "PAID",
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as GetViolationRecordResponse;
    const mappedResult = responseBody.violation.map((violationRecord) => violationRecord.id);

    expect(response.status).toBe(200);
    expect(responseBody.violation.length).toBe(3);
    expect(mappedResult).toContain(seededViolationRecord1.id);
    expect(mappedResult).toContain(seededViolationRecord2.id);
    expect(mappedResult).toContain(seededViolationRecord3.id);
    expect(mappedResult).not.toContain(seededViolationRecord4.id);
  });

  it("should return status 200 and violation records by the given parameters", async () => {
    const seededUser = await seedUser({});
    const seededViolation = await seedViolation({});
    const [
      seededViolationRecord1,
      seededViolationRecord2,
      seededViolationRecord3,
      seededViolationRecord4,
      seededAuthenticatedUser
    ] = await Promise.all([
      seedViolationRecord({
        status: "UNPAID",
        userId: seededUser.id,
        violationId: seededViolation.id
      }),
      seedViolationRecord({
        status: "UNPAID",
        userId: seededUser.id,
        violationId: seededViolation.id
      }),
      seedViolationRecord({
        status: "UNPAID",
        userId: seededUser.id,
        violationId: seededViolation.id
      }),
      seedViolationRecord({
        status: "PAID",
        userId: seededUser.id,
        violationId: seededViolation.id
      }),
      seedAuthenticatedUser({
        role: "SECURITY",
        expiration: "1h"
      })
    ]);

    const payload: ViolationRecordGetRequest = {
      status: "UNPAID",
      userId: seededUser.id,
      violationId: seededViolation.id,
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as GetViolationRecordResponse;
    const mappedResult = responseBody.violation.map((violationRecord) => violationRecord.id);

    expect(response.status).toBe(200);
    expect(responseBody.violation.length).toBe(3);
    expect(mappedResult).toContain(seededViolationRecord1.id);
    expect(mappedResult).toContain(seededViolationRecord2.id);
    expect(mappedResult).toContain(seededViolationRecord3.id);
    expect(mappedResult).not.toContain(seededViolationRecord4.id);
  });

  it("should return status 200 and violation records by the given parameters", async () => {
    const seededVehicle = await seedVehicle({});
    const seededViolation = await seedViolation({});
    const [
      seededViolationRecord1,
      seededViolationRecord2,
      seededViolationRecord3,
      seededViolationRecord4,
      seededAuthenticatedUser
    ] = await Promise.all([
      seedViolationRecord({
        status: "UNPAID",
        vehicleId: seededVehicle.id,
        violationId: seededViolation.id
      }),
      seedViolationRecord({
        status: "UNPAID",
        vehicleId: seededVehicle.id,
        violationId: seededViolation.id
      }),
      seedViolationRecord({
        status: "UNPAID",
        vehicleId: seededVehicle.id,
        violationId: seededViolation.id
      }),
      seedViolationRecord({
        status: "PAID",
        vehicleId: seededVehicle.id,
        violationId: seededViolation.id
      }),
      seedAuthenticatedUser({
        role: "SECURITY",
        expiration: "1h"
      })
    ]);

    const payload: ViolationRecordGetRequest = {
      status: "UNPAID",
      vehicleId: seededVehicle.id,
      violationId: seededViolation.id,
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as GetViolationRecordResponse;
    const mappedResult = responseBody.violation.map((violationRecord) => violationRecord.id);

    expect(response.status).toBe(200);
    expect(responseBody.violation.length).toBe(3);
    expect(mappedResult).toContain(seededViolationRecord1.id);
    expect(mappedResult).toContain(seededViolationRecord2.id);
    expect(mappedResult).toContain(seededViolationRecord3.id);
    expect(mappedResult).not.toContain(seededViolationRecord4.id);
  });

  it("should return status 200 when user id match the authenticated user", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF"])
    });
    const [seededViolationRecord1, seededViolationRecord2] = await Promise.all([
      seedViolationRecord({ userId: seededAuthenticatedUser.id }),
      seedViolationRecord({ userId: seededAuthenticatedUser.id })
    ]);

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        userId: seededAuthenticatedUser.id,
        count: "10",
        page: "1"
      });
    const responseBody = response.body as GetViolationRecordResponse;
    const mappedResult = responseBody.violation.map((violationRecord) => violationRecord.id);

    expect(response.status).toBe(200);
    expect(responseBody.violation.length).toBe(2);
    expect(mappedResult).toContain(seededViolationRecord1.id);
    expect(mappedResult).toContain(seededViolationRecord2.id);
  });

  it("should return status 200 and paginated users with correct metadata on first page", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const user = await seedUser({});
    await Promise.all(
      Array.from({ length: 6 }).map(() => seedViolationRecord({ userId: user.id }))
    );

    const pageOne = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        count: "3",
        page: "1"
      });
    const pageOneResponseBody = pageOne.body as GetViolationRecordResponse;

    expect(pageOne.status).toBe(200);
    expect(pageOneResponseBody.violation.length).toBe(3);
    expect(pageOneResponseBody.hasNextPage).toBe(true);
    expect(pageOneResponseBody.hasPreviousPage).toBe(false);
    expect(pageOneResponseBody.totalPages).toBe(2);

    const pageTwo = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        count: "3",
        page: "2"
      });
    const pageTwoResponseBody = pageTwo.body as GetViolationRecordResponse;

    expect(pageTwo.status).toBe(200);
    expect(pageTwoResponseBody.violation.length).toBe(3);
    expect(pageTwoResponseBody.hasNextPage).toBe(false);
    expect(pageTwoResponseBody.hasPreviousPage).toBe(true);
    expect(pageTwoResponseBody.totalPages).toBe(2);
  });

  it("should return status 200 and return violationRecord when filtering with searchKey(userId)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const user = await seedUser({});
    const seededViolationRecord = await seedViolationRecord({ userId: user.id });

    const payload: ViolationRecordGetRequest = {
      searchKey: seededViolationRecord.userId.slice(0, 5),
      count: "1",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetViolationRecordResponse;

    expect(response.status).toBe(200);
    expect(responseBody.violation.length).toBe(1);
    expect(responseBody.violation[0].userId).toContain(user.id.slice(0, 5));
  });

  it("should return status 200 and return violationRecord when filtering with searchKey(vehicleId)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const seededVehicle = await seedVehicle({});
    const seededViolationRecord = await seedViolationRecord({ vehicleId: seededVehicle.id });

    const payload: ViolationRecordGetRequest = {
      searchKey: seededViolationRecord.vehicleId.slice(0, 5),
      count: "1",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetViolationRecordResponse;

    expect(response.status).toBe(200);
    expect(responseBody.violation.length).toBe(1);
    expect(responseBody.violation[0].vehicleId).toContain(seededVehicle.id.slice(0, 5));
  });

  it("should return status 200 and return violationRecord when filtering with searchKey(reportedById)", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });

    const seededReporter = await seedUser({});
    await seedViolationRecord({ reportedById: seededReporter.id });

    const payload: ViolationRecordGetRequest = {
      searchKey: seededReporter.id.slice(0, 5),
      count: "1",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetViolationRecordResponse;

    expect(response.status).toBe(200);
    expect(responseBody.violation.length).toBe(1);
    expect(responseBody.violation[0].reportedById).toContain(seededReporter.id.slice(0, 5));
  });

  it("should return status 200 and violationRecord sorted in ascending order when sort = 1", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const user = await seedUser({});
    await Promise.all([
      seedViolationRecord({ userId: user.id, createdAt: new Date("2024-01-01") }),
      seedViolationRecord({ userId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const payload: ViolationRecordGetRequest = {
      userId: user.id,
      count: "10",
      page: "1",
      sort: "1"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetViolationRecordResponse;

    expect(response.status).toBe(200);
    expect(responseBody.violation).toHaveLength(2);
    expect(new Date(responseBody.violation[1].date).getTime()).toBeGreaterThan(
      new Date(responseBody.violation[0].date).getTime()
    );
  });

  it("should return status 200 and violationRecord sorted in descending order when sort = 2", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const user = await seedUser({});
    await Promise.all([
      seedViolationRecord({ userId: user.id, createdAt: new Date("2024-01-01") }),
      seedViolationRecord({ userId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const payload: ViolationRecordGetRequest = {
      userId: user.id,
      count: "10",
      page: "1",
      sort: "2"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetViolationRecordResponse;

    expect(response.status).toBe(200);
    expect(responseBody.violation).toHaveLength(2);
    expect(new Date(responseBody.violation[0].date).getTime()).toBeGreaterThan(
      new Date(responseBody.violation[1].date).getTime()
    );
  });

  it("should return status 200 and default sort to descending when sort does not exist", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: "SECURITY",
      expiration: "1h"
    });
    const user = await seedUser({});
    await Promise.all([
      seedViolationRecord({ userId: user.id, createdAt: new Date("2024-01-01") }),
      seedViolationRecord({ userId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const payload: ViolationRecordGetRequest = {
      userId: user.id,
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);
    const responseBody = response.body as GetViolationRecordResponse;

    expect(response.status).toBe(200);
    expect(responseBody.violation).toHaveLength(2);
    expect(new Date(responseBody.violation[0].date).getTime()).toBeGreaterThan(
      new Date(responseBody.violation[1].date).getTime()
    );
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
