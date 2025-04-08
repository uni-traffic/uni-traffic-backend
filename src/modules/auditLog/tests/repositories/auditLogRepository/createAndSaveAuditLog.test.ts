import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import {
  AuditLogRepository,
  type IAuditLogRepository
} from "../../../src/repositories/auditLogRepository";
import { createAuditLogDomainObject } from "../../utils/auditLog/createAuditLogDomainObject";

describe("AuditLogRepository.createaAndSaveAuditLog", () => {
  let auditLogRepository: IAuditLogRepository;

  beforeAll(() => {
    auditLogRepository = new AuditLogRepository();
  });

  it("should successfully create and save an audit log", async () => {
    const seededActor = await seedUser({ role: "ADMIN" });
    const createAuditLogDomainObjectRaw = createAuditLogDomainObject({
      actorId: seededActor.id
    });

    const createdAuditLog = await auditLogRepository.createAndSaveAuditLog(
      createAuditLogDomainObjectRaw
    );

    expect(createdAuditLog).not.toBeNull();
    expect(createdAuditLog?.id).toBe(createAuditLogDomainObjectRaw.id);
    expect(createdAuditLog?.objectId).toBe(createAuditLogDomainObjectRaw.objectId);
    expect(createdAuditLog?.actionType.value).toBe(createAuditLogDomainObjectRaw.actionType.value);
    expect(createdAuditLog?.details).toBe(createAuditLogDomainObjectRaw.details);
    expect(createdAuditLog?.actorId).toBe(createAuditLogDomainObjectRaw.actorId);
    expect(createdAuditLog?.actor).toBeDefined();
  });

  it("should fail to create and save an audit log when given references don't exist", async () => {
    const createAuditLogDomainObjectRaw = createAuditLogDomainObject({
      actorId: "non-existent-id"
    });

    const createdAuditLog = await auditLogRepository.createAndSaveAuditLog(
      createAuditLogDomainObjectRaw
    );
    console.log(createdAuditLog);

    expect(createdAuditLog).toBeNull();
  });
});
