import { ViolationRecord } from "../../../../src/domain/models/violationRecord/classes/violationRecord";
import { ViolationRecordFactory } from "../../../../src/domain/models/violationRecord/factory";
import { createViolationRecordPersistenceData } from "../../../utils/violationRecord/createViolationRecordPersistenceData";

describe("ViolationRecordFactory", () => {
  it("should successfully create a ViolationRecord when all properties are valid", () => {
    const mockViolationRecordData = createViolationRecordPersistenceData({});
    const result = ViolationRecordFactory.create(mockViolationRecordData);

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBeInstanceOf(ViolationRecord);

    const violationRecord = result.getValue();
    expect(violationRecord.id).toBe(mockViolationRecordData.id);
    expect(violationRecord.userId).toBe(mockViolationRecordData.userId);
    expect(violationRecord.reportedById).toBe(mockViolationRecordData.reportedById);
    expect(violationRecord.violationId).toBe(mockViolationRecordData.violationId);
    expect(violationRecord.vehicleId).toBe(mockViolationRecordData.vehicleId);
    expect(violationRecord.status.value).toBe(mockViolationRecordData.status);
    expect(violationRecord.user).toBeDefined();
    expect(violationRecord.reporter).toBeDefined();
    expect(violationRecord.violation).toBeDefined();
    expect(violationRecord.vehicle).toBeDefined();
  });
});
