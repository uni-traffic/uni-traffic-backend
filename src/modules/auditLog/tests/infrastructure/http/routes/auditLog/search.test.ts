import request from "supertest";
import type TestAgent from "supertest/lib/agent";
import app from "../../../../../../../../api";
import { db } from "../../../../../../../shared/infrastructure/database/prisma";
import { seedAuthenticatedUser } from "../../../../../../user/tests/utils/user/seedAuthenticatedUser";
import { seedUser } from "../../../../../../user/tests/utils/user/seedUser";
import type { GetAuditLogResponse } from "../../../../../src/dtos/auditLogDTO";
import type { GetAuditLogRequest } from "../../../../../src/dtos/auditLogRequestSchema";
import { seedAuditLog } from "../../../../utils/auditLog/seedAuditLog";

describe("GET /api/v1/audit-log/search", () => {
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

  it("should return status 200 and a paginated list of audit logs", async () => {
    const seededAdmin = await seedAuthenticatedUser({ role: "SUPERADMIN", expiration: "1h" });
    const seededActor = await seedUser({});
    await Promise.all(
      Array.from({ length: 12 }).map(() =>
        seedAuditLog({ actorId: seededActor.id, actionType: "CREATE" })
      )
    );

    const queryParams: GetAuditLogRequest = {
      actorId: seededActor.id,
      actionType: "CREATE",
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/audit-log/search")
      .set("Authorization", `Bearer ${seededAdmin.accessToken}`)
      .query(queryParams);
    const body: GetAuditLogResponse = response.body;

    expect(response.status).toBe(200);
    expect(Array.isArray(body.auditLogs)).toBe(true);
    expect(body.auditLogs.length).toBe(10);
    expect(body.hasNextPage).toBe(true);
    expect(body.hasPreviousPage).toBe(false);
  });

  it("should return 401 if token is missing", async () => {
    const response = await requestAPI
      .get("/api/v1/audit-log/search")
      .query({ count: "10", page: "1" });

    expect(response.status).toBe(401);
  });

  it("should return empty results when no audit logs match the query", async () => {
    const seededAdmin = await seedAuthenticatedUser({ role: "SUPERADMIN", expiration: "1h" });

    const queryParams: GetAuditLogRequest = {
      actorId: "non-existent-id",
      count: "10",
      page: "1"
    };

    const response = await requestAPI
      .get("/api/v1/audit-log/search")
      .set("Authorization", `Bearer ${seededAdmin.accessToken}`)
      .query(queryParams);

    expect(response.status).toBe(404);
  });

  it("should return 400 if invalid query is passed", async () => {
    const seededAdmin = await seedAuthenticatedUser({ role: "SUPERADMIN", expiration: "1h" });

    const response = await requestAPI
      .get("/api/v1/audit-log/search")
      .set("Authorization", `Bearer ${seededAdmin.accessToken}`)
      .query({ count: "abc", page: "-1" });

    expect(response.status).toBe(400);
  });
});
