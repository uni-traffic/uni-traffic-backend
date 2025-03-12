import { ViolationRecordAuditLogMapper } from "../../../src/domain/models/violationRecordAuditLog/mapper";
import { createViolationRecordAuditLogDomainObject } from "../../utils/createViolationRecordAuditLogDomainObject";
import { createViolationRecordAuditLogPersistenceData } from "../../utils/createViolationRecordAuditLogPersistenceData";

describe("ViolationRecordAuditLogMapper", () => {
  let violationRecordAuditLogMapper: ViolationRecordAuditLogMapper;

  beforeAll(() => {
    violationRecordAuditLogMapper = new ViolationRecordAuditLogMapper();
  });

  it("should map to domain from persistence", () => {
    const violationRecordAuditLogPersistenceData = createViolationRecordAuditLogPersistenceData({});
    const violationRecordAuditLogDomainObject = violationRecordAuditLogMapper.toDomain(
      violationRecordAuditLogPersistenceData
    );

    expect(violationRecordAuditLogDomainObject.id).toBe(violationRecordAuditLogPersistenceData.id);
    expect(violationRecordAuditLogDomainObject.actorId).toBe(
      violationRecordAuditLogPersistenceData.actorId
    );
    expect(violationRecordAuditLogDomainObject.auditLogType.value).toBe(
      violationRecordAuditLogPersistenceData.auditLogType
    );
    expect(violationRecordAuditLogDomainObject.details).toBe(
      violationRecordAuditLogPersistenceData.details
    );
    expect(violationRecordAuditLogDomainObject.actor).toBeDefined();
    expect(violationRecordAuditLogDomainObject.violationRecord).toBeDefined();
  });

  it("should map to persistence from domain", () => {
    const violationRecordAuditLogDomainObject = createViolationRecordAuditLogDomainObject({});
    const violationRecordAuditLogPersistenceData = violationRecordAuditLogMapper.toPersistence(
      violationRecordAuditLogDomainObject
    );

    expect(violationRecordAuditLogDomainObject.id).toBe(violationRecordAuditLogPersistenceData.id);
    expect(violationRecordAuditLogDomainObject.actorId).toBe(
      violationRecordAuditLogPersistenceData.actorId
    );
    expect(violationRecordAuditLogDomainObject.auditLogType.value).toBe(
      violationRecordAuditLogPersistenceData.auditLogType
    );
    expect(violationRecordAuditLogDomainObject.details).toBe(
      violationRecordAuditLogPersistenceData.details
    );
    expect(violationRecordAuditLogDomainObject.actor).toBeDefined();
    expect(violationRecordAuditLogDomainObject.violationRecord).toBeDefined();
  });

  it("should map to DTO from domain", () => {
    const violationRecordAuditLogDomainObject = createViolationRecordAuditLogDomainObject({});
    const violationRecordAuditLogDTO = violationRecordAuditLogMapper.toDTO(
      violationRecordAuditLogDomainObject
    );

    expect(violationRecordAuditLogDTO.id).toBe(violationRecordAuditLogDomainObject.id);
    expect(violationRecordAuditLogDTO.actorId).toBe(violationRecordAuditLogDomainObject.actorId);
    expect(violationRecordAuditLogDTO.auditLogType).toBe(
      violationRecordAuditLogDomainObject.auditLogType.value
    );
    expect(violationRecordAuditLogDTO.details).toBe(violationRecordAuditLogDomainObject.details);
    expect(violationRecordAuditLogDTO.actor).toBeDefined();
    expect(violationRecordAuditLogDTO.violationRecord).toBeDefined();
  });
});
