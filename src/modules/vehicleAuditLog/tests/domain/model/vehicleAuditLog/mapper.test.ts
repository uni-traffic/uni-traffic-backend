import { VehicleAuditLogMapper } from "../../../../src/domain/models/vehicleAuditLog/mapper";
import { createVehicleAuditLogDomainObject } from "../../../utils/createVehicleAuditLogDomainObject";
import { createVehicleAuditLogPersistenceData } from "../../../utils/createVehicleAuditLogPersistenceData";

describe("VehicleAuditLogMapper", () => {
  let vehicleAuditLogMapper: VehicleAuditLogMapper;

  beforeAll(() => {
    vehicleAuditLogMapper = new VehicleAuditLogMapper();
  });

  it("should map to domain from persistence", () => {
    const vehicleAuditLogPersistenceData = createVehicleAuditLogPersistenceData({});
    const vehicleAuditLogDomainObject = vehicleAuditLogMapper.toDomain(
      vehicleAuditLogPersistenceData
    );

    expect(vehicleAuditLogDomainObject.id).toBe(vehicleAuditLogPersistenceData.id);
    expect(vehicleAuditLogDomainObject.actorId).toBe(vehicleAuditLogPersistenceData.actorId);
    expect(vehicleAuditLogDomainObject.auditLogType.value).toBe(
      vehicleAuditLogPersistenceData.auditLogType
    );
    expect(vehicleAuditLogDomainObject.details).toBe(vehicleAuditLogPersistenceData.details);
    expect(vehicleAuditLogDomainObject.actor).toBeDefined();
    expect(vehicleAuditLogDomainObject.vehicle).toBeDefined();
  });

  it("should map to persistence from domain", () => {
    const vehicleAuditLogDomainObject = createVehicleAuditLogDomainObject({});
    const vehicleAuditLogPersistenceData = vehicleAuditLogMapper.toPersistence(
      vehicleAuditLogDomainObject
    );

    expect(vehicleAuditLogDomainObject.id).toBe(vehicleAuditLogPersistenceData.id);
    expect(vehicleAuditLogDomainObject.actorId).toBe(vehicleAuditLogPersistenceData.actorId);
    expect(vehicleAuditLogDomainObject.auditLogType.value).toBe(
      vehicleAuditLogPersistenceData.auditLogType
    );
    expect(vehicleAuditLogDomainObject.details).toBe(vehicleAuditLogPersistenceData.details);
    expect(vehicleAuditLogDomainObject.actor).toBeDefined();
    expect(vehicleAuditLogDomainObject.vehicle).toBeDefined();
  });

  it("should map to DTO from domain", () => {
    const vehicleAuditLogDomainObject = createVehicleAuditLogDomainObject({});
    const vehicleAuditLogDTO = vehicleAuditLogMapper.toDTO(vehicleAuditLogDomainObject);

    expect(vehicleAuditLogDTO.id).toBe(vehicleAuditLogDomainObject.id);
    expect(vehicleAuditLogDTO.actorId).toBe(vehicleAuditLogDomainObject.actorId);
    expect(vehicleAuditLogDTO.auditLogType).toBe(vehicleAuditLogDomainObject.auditLogType.value);
    expect(vehicleAuditLogDTO.details).toBe(vehicleAuditLogDomainObject.details);
    expect(vehicleAuditLogDTO.actor).toBeDefined();
    expect(vehicleAuditLogDTO.vehicle).toBeDefined();
  });
});
