import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import { seedViolationRecord } from "../../../../violationRecord/tests/utils/violationRecord/seedViolationRecord";
import {
  type IViolationRecordAuditLogRepository,
  ViolationRecordAuditLogRepository
} from "../../../src/repositories/violationRecordAuditLogRepository";
import { createViolationRecordAuditLogDomainObject } from "../../utils/createViolationRecordAuditLogDomainObject";

describe("ViolationRecordAuditLogRepository.createViolationRecordAuditLog", () => {
  let violationRecordAuditLogRepository: IViolationRecordAuditLogRepository;

  beforeAll(() => {
    violationRecordAuditLogRepository = new ViolationRecordAuditLogRepository();
  });

  it("should successfully create a violation record audit log", async () => {
    const seededActor = await seedUser({ role: "ADMIN" });
    const seededViolationRecord = await seedViolationRecord({ status: "PAID" });
    const createdViolationRecordAuditLog = createViolationRecordAuditLogDomainObject({
      actorId: seededActor.id,
      violationRecordId: seededViolationRecord.id
    });

    const savedViolationRecordAuditLog =
      await violationRecordAuditLogRepository.createViolationRecordAuditLog(
        createdViolationRecordAuditLog
      );

    expect(savedViolationRecordAuditLog).not.toBeNull();
  });

  it("should fail to create a violation record audit log when given references dont exist", async () => {
    const createdViolationRecordAuditLog = createViolationRecordAuditLogDomainObject({});

    const savedViolationRecordAuditLog =
      await violationRecordAuditLogRepository.createViolationRecordAuditLog(
        createdViolationRecordAuditLog
      );

    expect(savedViolationRecordAuditLog).toBeNull();
  });
});
