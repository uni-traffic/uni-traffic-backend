import { VehicleScanLogMapper } from "../../../../src/domain/models/vehicleScanLog/mapper";
import { createVehicleScanLogDomainObject } from "../../../utils/vehicleScanLog/createVehicleScanLogDomainObject";
import { createVehicleScanLogPersistenceData } from "../../../utils/vehicleScanLog/createVehicleScanLogPersistenceData";

describe("VehicleScanLogMapper", () => {
  let mapper: VehicleScanLogMapper;

  beforeAll(() => {
    mapper = new VehicleScanLogMapper();
  });

  it("should map to domain from persistence", () => {
    const persistenceData = createVehicleScanLogPersistenceData({});
    const domainObject = mapper.toDomain(persistenceData);

    expect(domainObject.id).toBe(persistenceData.id);
    expect(domainObject.securityId).toBe(persistenceData.securityId);
    expect(domainObject.licensePlate).toBe(persistenceData.licensePlate);
    expect(domainObject.time).toBe(persistenceData.time);
  });

  it("should map to persistence from domain", () => {
    const domainObject = createVehicleScanLogDomainObject({});
    const persistenceData = mapper.toPersistence(domainObject);

    expect(persistenceData.id).toBe(domainObject.id);
    expect(persistenceData.securityId).toBe(domainObject.securityId);
    expect(persistenceData.licensePlate).toBe(domainObject.licensePlate);
    expect(persistenceData.time).toBe(domainObject.time);
  });

  it("should map to DTO from domain", () => {
    const domainObject = createVehicleScanLogDomainObject({});
    const dto = mapper.toDTO(domainObject);

    expect(dto.id).toBe(domainObject.id);
    expect(dto.securityId).toBe(domainObject.securityId);
    expect(dto.licensePlate).toBe(domainObject.licensePlate);
    expect(dto.time).toBe(domainObject.time);
  });
});
