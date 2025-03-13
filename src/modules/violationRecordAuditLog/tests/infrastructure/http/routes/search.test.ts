import { faker } from "@faker-js/faker";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../api";
import request from "supertest";
import { seedAuthenticatedUser } from "../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { db } from "../../../../../../shared/infrastructure/database/prisma";
import { seedViolationRecordAuditLog } from "../../../utils/seedViolationRecordAuditLog";
import type { ViolationRecordAuditLogGetRequest } from "../../../../src/dtos/violationRecordAuditLogRequestSchema";
import { seedUser } from "../../../../../user/tests/utils/user/seedUser";
import type { IViolationRecordAuditLogDTO } from "../../../../src/dtos/violationRecordAuditLogDTO";
import { seedViolationRecord } from "../../../../../violationRecord/tests/utils/violationRecord/seedViolationRecord";

describe("GET /api/v1/audit-log/violation-record/search", () => {
  let requestAPI: TestAgent;

  beforeAll(() => {
    requestAPI = request.agent(app);
  });

  beforeEach(async () => {
    await db.violationRecordAuditLog.deleteMany();
    await db.violationRecord.deleteMany();
    await db.user.deleteMany();
  });

  it("should return status 200 status code and violation record audit log when valid id is provided", async () => {
    const seededViolationRecordAuditLog = await seedViolationRecordAuditLog({});
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });

    const payload: ViolationRecordAuditLogGetRequest = {
      id: seededViolationRecordAuditLog.id,
      page: "1",
      count: "1"
    };

    const response = await requestAPI
      .get("/api/v1/audit-log/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body;

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(1);
    expect(responseBody[0].id).toBe(seededViolationRecordAuditLog.id);
    expect(responseBody[0].actorId).toBe(seededViolationRecordAuditLog.actorId);
    expect(responseBody[0].auditLogType).toBe(seededViolationRecordAuditLog.auditLogType);
    expect(responseBody[0].details).toBe(seededViolationRecordAuditLog.details);
    expect(responseBody[0].violationRecordId).toBe(seededViolationRecordAuditLog.violationRecordId);
  });

  it("should return status 200 status code and violation record audit log when provided with actor id", async () => {
    const seededUser = await seedUser({});
    const seededViolationRecordAuditLog1 = await seedViolationRecordAuditLog({
      actorId: seededUser.id
    });
    const seededViolationRecordAuditLog2 = await seedViolationRecordAuditLog({
      actorId: seededUser.id
    });
    const seededViolationRecordAuditLog3 = await seedViolationRecordAuditLog({
      actorId: seededUser.id
    });
    const seededViolationRecordAuditLog4 = await seedViolationRecordAuditLog({
      actorId: seededUser.id
    });

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });

    const payload: ViolationRecordAuditLogGetRequest = {
      actorId: seededUser.id,
      page: "1",
      count: "5"
    };

    const response = await requestAPI
      .get("/api/v1/audit-log/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as IViolationRecordAuditLogDTO[];
    const mappedViolationRecordAuditLog = responseBody.map(
      (violationRecordAuditLog) => violationRecordAuditLog.id
    );

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(4);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog1.id);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog2.id);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog3.id);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog4.id);
    expect(responseBody).not.toBe([]);
  });

  it("should return status 200 status code and violation record audit log when provided with violation record id", async () => {
    const seededViolationRecord = await seedViolationRecord({});
    const seededViolationRecordAuditLog1 = await seedViolationRecordAuditLog({
      violationRecordId: seededViolationRecord.id
    });
    const seededViolationRecordAuditLog2 = await seedViolationRecordAuditLog({
      violationRecordId: seededViolationRecord.id
    });
    const seededViolationRecordAuditLog3 = await seedViolationRecordAuditLog({
      violationRecordId: seededViolationRecord.id
    });
    const seededViolationRecordAuditLog4 = await seedViolationRecordAuditLog({
      violationRecordId: seededViolationRecord.id
    });

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });

    const payload: ViolationRecordAuditLogGetRequest = {
      violationRecordId: seededViolationRecord.id,
      page: "1",
      count: "5"
    };

    const response = await requestAPI
      .get("/api/v1/audit-log/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as IViolationRecordAuditLogDTO[];
    const mappedViolationRecordAuditLog = responseBody.map(
      (violationRecordAuditLog) => violationRecordAuditLog.id
    );

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(4);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog1.id);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog2.id);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog3.id);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog4.id);
    expect(responseBody).not.toBe([]);
  });

  it("should return status 200 status code and violation record audit log when provided with audit log type", async () => {
    const seededViolationRecordAuditLog1 = await seedViolationRecordAuditLog({
      auditLogType: "CREATE"
    });
    const seededViolationRecordAuditLog2 = await seedViolationRecordAuditLog({
      auditLogType: "CREATE"
    });
    const seededViolationRecordAuditLog3 = await seedViolationRecordAuditLog({
      auditLogType: "CREATE"
    });
    const seededViolationRecordAuditLog4 = await seedViolationRecordAuditLog({
      auditLogType: "UPDATE"
    });
    const seededViolationRecordAuditLog5 = await seedViolationRecordAuditLog({
      auditLogType: "DELETE"
    });

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });

    const payload: ViolationRecordAuditLogGetRequest = {
      auditLogType: "CREATE",
      page: "1",
      count: "5"
    };

    const response = await requestAPI
      .get("/api/v1/audit-log/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as IViolationRecordAuditLogDTO[];
    const mappedViolationRecordAuditLog = responseBody.map(
      (violationRecordAuditLog) => violationRecordAuditLog.id
    );

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(3);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog1.id);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog2.id);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog3.id);
    expect(mappedViolationRecordAuditLog).not.toContain(seededViolationRecordAuditLog4.id);
    expect(mappedViolationRecordAuditLog).not.toContain(seededViolationRecordAuditLog5.id);
    expect(responseBody).not.toBe([]);
  });

  it("should return status 200 status code and violation record audit log by the given parameters", async () => {
    const seededUser = await seedUser({});
    const seededViolationRecord = await seedViolationRecord({});
    const seededViolationRecordAuditLog1 = await seedViolationRecordAuditLog({
      actorId: seededUser.id,
      violationRecordId: seededViolationRecord.id,
      auditLogType: "CREATE"
    });
    const seededViolationRecordAuditLog2 = await seedViolationRecordAuditLog({
      actorId: seededUser.id,
      violationRecordId: seededViolationRecord.id,
      auditLogType: "CREATE"
    });
    const seededViolationRecordAuditLog3 = await seedViolationRecordAuditLog({
      actorId: seededUser.id,
      violationRecordId: seededViolationRecord.id,
      auditLogType: "CREATE"
    });
    const seededViolationRecordAuditLog4 = await seedViolationRecordAuditLog({
      actorId: seededUser.id,
      violationRecordId: seededViolationRecord.id,
      auditLogType: "UPDATE"
    });
    const seededViolationRecordAuditLog5 = await seedViolationRecordAuditLog({
      actorId: seededUser.id,
      violationRecordId: seededViolationRecord.id,
      auditLogType: "DELETE"
    });

    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });

    const payload: ViolationRecordAuditLogGetRequest = {
      actorId: seededUser.id,
      violationRecordId: seededViolationRecord.id,
      auditLogType: "CREATE",
      page: "1",
      count: "5"
    };

    const response = await requestAPI
      .get("/api/v1/audit-log/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as IViolationRecordAuditLogDTO[];
    const mappedViolationRecordAuditLog = responseBody.map(
      (violationRecordAuditLog) => violationRecordAuditLog.id
    );

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(3);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog1.id);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog2.id);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog3.id);
    expect(mappedViolationRecordAuditLog).not.toContain(seededViolationRecordAuditLog4.id);
    expect(mappedViolationRecordAuditLog).not.toContain(seededViolationRecordAuditLog5.id);
    expect(responseBody).not.toBe([]);
  });

  it("should return status 200 status code and violation record audit log when actor id matches the authenticated user id", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });
    const seededViolationRecordAuditLog1 = await seedViolationRecordAuditLog({
      actorId: seededAuthenticatedUser.id
    });
    const seededViolationRecordAuditLog2 = await seedViolationRecordAuditLog({
      actorId: seededAuthenticatedUser.id
    });

    const payload: ViolationRecordAuditLogGetRequest = {
      actorId: seededAuthenticatedUser.id,
      page: "1",
      count: "5"
    };

    const response = await requestAPI
      .get("/api/v1/audit-log/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query(payload);

    const responseBody = response.body as IViolationRecordAuditLogDTO[];
    const mappedViolationRecordAuditLog = responseBody.map(
      (violationRecordAuditLog) => violationRecordAuditLog.id
    );

    expect(response.status).toBe(200);
    expect(responseBody.length).toBe(2);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog1.id);
    expect(mappedViolationRecordAuditLog).toContain(seededViolationRecordAuditLog2.id);
    expect(responseBody).not.toBe([]);
  });

  it("should return status 400 status code when no parameters passed", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });

    const response = await requestAPI
      .get("/api/v1/audit-log/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({});

    expect(response.status).toBe(400);
  });

  it("should return status 403 status code and message when Authorization provided lacks permission", async () => {
    const seededAuthenticatedUser = await seedAuthenticatedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF"])
    });

    const response = await requestAPI
      .get("/api/v1/audit-log/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        id: faker.string.uuid(),
        page: "1",
        count: "1"
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
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN"])
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await requestAPI
      .get("/api/v1/audit-log/violation-record/search")
      .set("Authorization", `Bearer ${seededAuthenticatedUser.accessToken}`)
      .query({
        id: faker.string.uuid(),
        page: "1",
        count: "1"
      });
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("Your session has expired. Please log in again.");
  });

  it("should return a 401 status code when the provided Authorization is malformed", async () => {
    const response = await requestAPI
      .get("/api/v1/audit-log/violation-record/search")
      .set("Authorization", `Bearer ${faker.internet.jwt()}`)
      .query({
        id: faker.string.uuid(),
        page: "1",
        count: "1"
      });
    const responseBody = response.body;

    expect(response.status).toBe(401);
    expect(responseBody.message).toBe("The provided token is invalid or malformed.");
  });
});
