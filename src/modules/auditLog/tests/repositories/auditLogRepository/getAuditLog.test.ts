import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import {
  AuditLogRepository,
  type IAuditLogRepository
} from "../../../src/repositories/auditLogRepository";
import { seedAuditLog } from "../../utils/auditLog/seedAuditLog";

describe("AuditLogRepository.getAuditLog", () => {
  let auditLogRepository: IAuditLogRepository;

  beforeAll(() => {
    auditLogRepository = new AuditLogRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany({});
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return audit logs sorted in descending order when sort = 1", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedAuditLog({ actorId: user.id, createdAt: new Date("2024-01-01") }),
      seedAuditLog({ actorId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const logs = await auditLogRepository.getAuditLog({
      actorId: user.id,
      count: 10,
      page: 1,
      sort: 1
    });

    expect(logs).toHaveLength(2);
    expect(new Date(logs[0].createdAt).getTime()).toBeGreaterThan(
      new Date(logs[1].createdAt).getTime()
    );
  });

  it("should return audit logs sorted in ascending order when sort = 2", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedAuditLog({ actorId: user.id, createdAt: new Date("2024-01-01") }),
      seedAuditLog({ actorId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const logs = await auditLogRepository.getAuditLog({
      actorId: user.id,
      count: 10,
      page: 1,
      sort: 2
    });

    expect(logs).toHaveLength(2);
    expect(new Date(logs[0].createdAt).getTime()).toBeLessThan(
      new Date(logs[1].createdAt).getTime()
    );
  });

  it("should correctly apply pagination", async () => {
    const user = await seedUser({});
    await Promise.all(Array.from({ length: 15 }).map(() => seedAuditLog({ actorId: user.id })));

    const page1 = await auditLogRepository.getAuditLog({ actorId: user.id, count: 10, page: 1 });
    const page2 = await auditLogRepository.getAuditLog({ actorId: user.id, count: 10, page: 2 });

    expect(page1).toHaveLength(10);
    expect(page2).toHaveLength(5);
  });

  it("should filter logs using partial actorId match with searchKey", async () => {
    const user = await seedUser({ username: "uniqueUser" });
    await seedAuditLog({ actorId: user.id });

    const logs = await auditLogRepository.getAuditLog({
      searchKey: user.id.slice(0, 8),
      count: 10,
      page: 1
    });

    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].actor!.id).toContain(user.id.slice(0, 8));
  });

  it("should filter logs using partial objectId match with searchKey", async () => {
    const user = await seedUser({});
    const objectId = faker.string.uuid();
    await seedAuditLog({ actorId: user.id, objectId });

    const logs = await auditLogRepository.getAuditLog({
      searchKey: objectId.slice(0, 8),
      count: 10,
      page: 1
    });

    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].objectId).toContain(objectId.slice(0, 8));
  });

  it("should filter logs using strict matching for actionType, actorId, and objectId", async () => {
    const user = await seedUser({});
    const objectId = faker.string.uuid();
    const actionType = "CREATE" as const;
    await seedAuditLog({ actorId: user.id, objectId, actionType });

    const logs = await auditLogRepository.getAuditLog({
      actorId: user.id,
      objectId,
      actionType,
      count: 10,
      page: 1
    });

    expect(logs).toHaveLength(1);
    expect(logs[0].actor!.id).toBe(user.id);
    expect(logs[0].objectId).toBe(objectId);
    expect(logs[0].actionType.value).toBe(actionType);
  });

  it("should return an empty array when no logs match the criteria", async () => {
    const logs = await auditLogRepository.getAuditLog({
      actorId: "non-existent-id",
      count: 10,
      page: 1
    });

    expect(logs).toHaveLength(0);
  });
});
