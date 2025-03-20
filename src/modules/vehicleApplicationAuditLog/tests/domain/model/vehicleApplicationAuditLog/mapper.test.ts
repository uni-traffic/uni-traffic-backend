import { VehicleApplicationAuditLogMapper } from "../../../../src/domain/models/vehicleApplicationAuditLog/mapper";
import { createVehicleApplicationAuditLogDomainObject } from "../../../utils/createVehicleApplicationAuditLogDomainObject";
import { createVehicleApplicationAuditLogPersistenceData } from "../../../utils/createVehicleApplicationAuditLogPersistenceData";

describe("VehicleApplicationAuditLogMapper", () => {
  let vehicleApplicationAuditLogMapper: VehicleApplicationAuditLogMapper;

  beforeAll(() => {
    vehicleApplicationAuditLogMapper = new VehicleApplicationAuditLogMapper();
  });

  it("should map to domain from persistence", () => {
    const vehicleApplicationAuditLogPersistenceData =
      createVehicleApplicationAuditLogPersistenceData({});
    const vehicleApplicationAuditLogDomainObject = vehicleApplicationAuditLogMapper.toDomain(
      vehicleApplicationAuditLogPersistenceData
    );

    expect(vehicleApplicationAuditLogDomainObject.id).toBe(
      vehicleApplicationAuditLogPersistenceData.id
    );
    expect(vehicleApplicationAuditLogDomainObject.actorId).toBe(
      vehicleApplicationAuditLogPersistenceData.actorId
    );
    expect(vehicleApplicationAuditLogDomainObject.auditLogType.value).toBe(
      vehicleApplicationAuditLogPersistenceData.auditLogType
    );
    expect(vehicleApplicationAuditLogDomainObject.details).toBe(
      vehicleApplicationAuditLogPersistenceData.details
    );
    expect(vehicleApplicationAuditLogDomainObject.actor).toBeDefined();
    expect(vehicleApplicationAuditLogDomainObject.vehicleApplication).toBeDefined();
  });

  it("should map to persistence from domain", () => {
    const vehicleApplicationAuditLogDomainObject = createVehicleApplicationAuditLogDomainObject({});
    const vehicleApplicationAuditLogPersistenceData =
      vehicleApplicationAuditLogMapper.toPersistence(vehicleApplicationAuditLogDomainObject);

    expect(vehicleApplicationAuditLogDomainObject.id).toBe(
      vehicleApplicationAuditLogPersistenceData.id
    );
    expect(vehicleApplicationAuditLogDomainObject.actorId).toBe(
      vehicleApplicationAuditLogPersistenceData.actorId
    );
    expect(vehicleApplicationAuditLogDomainObject.auditLogType.value).toBe(
      vehicleApplicationAuditLogPersistenceData.auditLogType
    );
    expect(vehicleApplicationAuditLogDomainObject.details).toBe(
      vehicleApplicationAuditLogPersistenceData.details
    );
    expect(vehicleApplicationAuditLogDomainObject.actor).toBeDefined();
    expect(vehicleApplicationAuditLogDomainObject.vehicleApplication).toBeDefined();
  });

  it("should map to DTO from domain", () => {
    const vehicleApplicationAuditLogDomainObject = createVehicleApplicationAuditLogDomainObject({});
    const vehicleApplicationAuditLogDTO = vehicleApplicationAuditLogMapper.toDTO(
      vehicleApplicationAuditLogDomainObject
    );

    expect(vehicleApplicationAuditLogDTO.id).toBe(vehicleApplicationAuditLogDomainObject.id);
    expect(vehicleApplicationAuditLogDTO.actorId).toBe(
      vehicleApplicationAuditLogDomainObject.actorId
    );
    expect(vehicleApplicationAuditLogDTO.auditLogType).toBe(
      vehicleApplicationAuditLogDomainObject.auditLogType.value
    );
    expect(vehicleApplicationAuditLogDTO.details).toBe(
      vehicleApplicationAuditLogDomainObject.details
    );
    expect(vehicleApplicationAuditLogDTO.actor).toBeDefined();
    expect(vehicleApplicationAuditLogDTO.vehicleApplication).toBeDefined();
  });
});
