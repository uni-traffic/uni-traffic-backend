import { UnexpectedError } from "../../../../../shared/core/errors";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import type { CreateAuditLogParams } from "../../../src/dtos/auditLogDTO";
import { AuditLogService, type IAuditLogService } from "../../../src/service/auditLogService";

describe("AuditLogService", () => {
  let auditLogService: IAuditLogService;

  beforeAll(() => {
    auditLogService = new AuditLogService();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully create an audit log", async () => {
    const seededUser = await seedUser({ role: "ADMIN" });
    const requestParams: CreateAuditLogParams = {
      actorId: seededUser.id,
      actionType: "CREATE",
      details: "Created a new resource",
      objectId: "object-id"
    };

    const createdAuditLog = await auditLogService.createAndSaveAuditLog(requestParams);

    expect(createdAuditLog).not.toBeNull();
    expect(createdAuditLog?.objectId).toBe(requestParams.objectId);
    expect(createdAuditLog?.actionType).toBe(requestParams.actionType);
    expect(createdAuditLog?.details).toBe(requestParams.details);
    expect(createdAuditLog?.actorId).toBe(requestParams.actorId);
    expect(createdAuditLog?.actor).toBeDefined();
  });

  it("should fail to create an audit log when given references don't exist", async () => {
    const requestParams: CreateAuditLogParams = {
      actorId: "non-existent-id",
      actionType: "CREATE",
      details: "Created a new resource",
      objectId: "object-id"
    };

    await expect(auditLogService.createAndSaveAuditLog(requestParams)).rejects.toThrow(
      new UnexpectedError("Failed to save audit log.")
    );
  });

  it("should fail to create an audit log when the factory fails", async () => {
    const seededUser = await seedUser({ role: "ADMIN" });
    const requestParams: CreateAuditLogParams = {
      actorId: seededUser.id,
      actionType: "INVALID_ACTION",
      details: "Created a new resource",
      objectId: "object-id"
    };

    let message = "";
    try {
      await auditLogService.createAndSaveAuditLog(requestParams);
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toContain("Invalid action type. Valid action type are");
  });
});
