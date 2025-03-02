import { ViolationRecord } from "../../../../src/domain/models/violationRecord/classes/violationRecord";
import {
  type IViolationRecordMapper,
  ViolationRecordMapper
} from "../../../../src/domain/models/violationRecord/mapper";
import { createViolationRecordDomainObject } from "../../../utils/violationRecord/createViolationRecordDomainObject";
import { createViolationRecordPersistenceData } from "../../../utils/violationRecord/createViolationRecordPersistenceData";

describe("ViolationRecordMapper", () => {
  let violationRecord: IViolationRecordMapper;

  beforeAll(() => {
    violationRecord = new ViolationRecordMapper();
  });

  it("should map to domain from persistence data", () => {
    const violationRecordPersistenceData = createViolationRecordPersistenceData({});
    const violationRecordDomainObject = violationRecord.toDomain(violationRecordPersistenceData);

    expect(violationRecordDomainObject).toBeInstanceOf(ViolationRecord);
    expect(violationRecordDomainObject.id).toBe(violationRecordPersistenceData.id);
    expect(violationRecordDomainObject.userId).toBe(violationRecordPersistenceData.userId);
    expect(violationRecordDomainObject.reportedById).toBe(
      violationRecordPersistenceData.reportedById
    );
    expect(violationRecordDomainObject.violationId).toBe(
      violationRecordPersistenceData.violationId
    );
    expect(violationRecordDomainObject.remarks.value).toBe(violationRecordPersistenceData.remarks);
    expect(violationRecordDomainObject.vehicleId).toBe(violationRecordPersistenceData.vehicleId);
    expect(violationRecordDomainObject.status.value).toBe(violationRecordPersistenceData.status);
    expect(violationRecordDomainObject.user).toBeDefined();
    expect(violationRecordDomainObject.reporter).toBeDefined();
    expect(violationRecordDomainObject.violation).toBeDefined();
    expect(violationRecordDomainObject.vehicle).toBeDefined();
  });

  it("should map to persistence from domain", () => {
    const violationRecordDomainObject = createViolationRecordDomainObject({});
    const violationRecordSchemaObject = violationRecord.toPersistence(violationRecordDomainObject);

    expect(violationRecordSchemaObject.id).toBe(violationRecordDomainObject.id);
    expect(violationRecordSchemaObject.userId).toBe(violationRecordDomainObject.userId);
    expect(violationRecordSchemaObject.reportedById).toBe(violationRecordDomainObject.reportedById);
    expect(violationRecordSchemaObject.violationId).toBe(violationRecordDomainObject.violationId);
    expect(violationRecordSchemaObject.vehicleId).toBe(violationRecordDomainObject.vehicleId);
    expect(violationRecordSchemaObject.status).toBe(violationRecordDomainObject.status.value);
  });

  it("should map to DTO from domain", () => {
    const violationRecordDomainObject = createViolationRecordDomainObject({});
    const violationRecordDTO = violationRecord.toDTO(violationRecordDomainObject);

    expect(violationRecordDTO.id).toBe(violationRecordDomainObject.id);
    expect(violationRecordDTO.userId).toBe(violationRecordDomainObject.userId);
    expect(violationRecordDTO.reportedById).toBe(violationRecordDomainObject.reportedById);
    expect(violationRecordDTO.violationId).toBe(violationRecordDomainObject.violationId);
    expect(violationRecordDTO.vehicleId).toBe(violationRecordDomainObject.vehicleId);
    expect(violationRecordDTO.status).toBe(violationRecordDomainObject.status.value);
    expect(violationRecordDTO.user).toEqual(violationRecordDomainObject.user);
    expect(violationRecordDTO.reporter).toEqual(violationRecordDomainObject.reporter);
    expect(violationRecordDTO.violation).toEqual(violationRecordDomainObject.violation);
    expect(violationRecordDTO.vehicle).toEqual(violationRecordDomainObject.vehicle);
  });
});
