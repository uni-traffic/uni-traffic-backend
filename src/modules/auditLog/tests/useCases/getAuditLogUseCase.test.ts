import { NotFoundError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import type { GetAuditLogRequest } from "../../src/dtos/auditLogRequestSchema";
import { GetAuditLogUseCase } from "../../src/useCases/getAuditLogUseCase";
import { seedAuditLog } from "../utils/auditLog/seedAuditLog";

describe("GetAuditLogUseCase", () => {
  let useCase: GetAuditLogUseCase;

  beforeAll(() => {
    useCase = new GetAuditLogUseCase();
  });

  beforeEach(async () => {
    await db.auditLog.deleteMany({});
    await db.user.deleteMany({});
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return paginated audit logs with correct metadata on first page", async () => {
    const user = await seedUser({});
    await Promise.all(Array.from({ length: 15 }).map(() => seedAuditLog({ actorId: user.id })));

    const request: GetAuditLogRequest = {
      actorId: user.id,
      count: "10",
      page: "1"
    };

    const result = await useCase.execute(request);

    expect(result.auditLogs).toHaveLength(10);
    expect(result.hasNextPage).toBe(true);
    expect(result.totalPages).toBe(2);
    expect(result.hasPreviousPage).toBe(false);
  });

  it("should return second page with correct hasPreviousPage and hasNextPage flags", async () => {
    const user = await seedUser({});
    await Promise.all(Array.from({ length: 15 }).map(() => seedAuditLog({ actorId: user.id })));

    const request: GetAuditLogRequest = {
      actorId: user.id,
      count: "10",
      page: "2"
    };

    const result = await useCase.execute(request);

    expect(result.auditLogs).toHaveLength(5);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
  });

  it("should return correct audit logs when filtering by actionType and searchKey", async () => {
    const user = await seedUser({});
    const objectId = "target-object-id";

    await seedAuditLog({
      actorId: user.id,
      objectId,
      actionType: "DELETE"
    });

    const request: GetAuditLogRequest = {
      searchKey: "target-object",
      actionType: "DELETE",
      count: "10",
      page: "1"
    };

    const result = await useCase.execute(request);

    expect(result.auditLogs.length).toBeGreaterThan(0);
    expect(result.auditLogs[0].actionType).toBe("DELETE");
    expect(result.auditLogs[0].objectId).toContain("target-object");
  });

  it("should handle cases where no audit logs are found", async () => {
    const request: GetAuditLogRequest = {
      actorId: "non-existent-id",
      count: "10",
      page: "1"
    };

    await expect(useCase.execute(request)).rejects.toThrow(
      new NotFoundError("No Audit Logs found")
    );
  });

  it("should properly refine string count and page to numbers", async () => {
    const user = await seedUser({});
    await seedAuditLog({ actorId: user.id });

    const request: GetAuditLogRequest = {
      actorId: user.id,
      count: "1",
      page: "1",
      sort: "1"
    };

    const result = await useCase.execute(request);

    expect(result.auditLogs).toHaveLength(1);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.hasNextPage).toBe(false);
  });

  it("should default to sort order when sort is not provided", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedAuditLog({ actorId: user.id, createdAt: new Date("2022-01-01") }),
      seedAuditLog({ actorId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const request: GetAuditLogRequest = {
      actorId: user.id,
      count: "10",
      page: "1"
    };

    const result = await useCase.execute(request);

    expect(new Date(result.auditLogs[0].createdAt).getTime()).toBeGreaterThan(
      new Date(result.auditLogs[1].createdAt).getTime()
    );
  });
});
