import { AuditLogMapper } from "../../../src/domain/models/auditLog/mapper";
import { createAuditLogDomainObject } from "../../utils/auditLog/createAuditLogDomainObject";
import { createAuditLogPersistenceData } from "../../utils/auditLog/createAuditLogPersistenceData";

describe("AuditLogMapper", () => {
  let auditLogMapper: AuditLogMapper;

  beforeAll(() => {
    auditLogMapper = new AuditLogMapper();
  });

  it("should map to domain from persistence", () => {
    const persistenceData = createAuditLogPersistenceData({});
    const domainObject = auditLogMapper.toDomain(persistenceData);

    expect(domainObject.id).toBe(persistenceData.id);
    expect(domainObject.actionType).toBe(persistenceData.actionType);
    expect(domainObject.details).toBe(persistenceData.details);
    expect(domainObject.createdAt).toBe(persistenceData.createdAt);
    expect(domainObject.updatedAt).toBe(persistenceData.updatedAt);
    expect(domainObject.actorId).toBe(persistenceData.actorId);
    expect(domainObject.objectId).toBe(persistenceData.objectId);
  });

  it("should map to persistence from domain", () => {
    const domainObject = createAuditLogDomainObject({});
    const persistenceData = auditLogMapper.toPersistence(domainObject);

    expect(persistenceData.id).toBe(domainObject.id);
    expect(persistenceData.actionType).toBe(domainObject.actionType);
    expect(persistenceData.details).toBe(domainObject.details);
    expect(persistenceData.createdAt).toBe(domainObject.createdAt);
    expect(persistenceData.updatedAt).toBe(domainObject.updatedAt);
    expect(persistenceData.actorId).toBe(domainObject.actorId);
    expect(persistenceData.objectId).toBe(domainObject.objectId);
  });

  it("should map to DTO from domain", () => {
    const domainObject = createAuditLogDomainObject({});
    const dto = auditLogMapper.toDTO(domainObject);

    expect(dto.id).toBe(domainObject.id);
    expect(dto.actionType).toBe(domainObject.actionType);
    expect(dto.details).toBe(domainObject.details);
    expect(dto.createdAt).toBe(domainObject.createdAt);
    expect(dto.updatedAt).toBe(domainObject.updatedAt);
    expect(dto.actorId).toBe(domainObject.actorId);
    expect(dto.objectId).toBe(domainObject.objectId);
  });
});
