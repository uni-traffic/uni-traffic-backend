import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import { seedVehicle } from "../../../../vehicle/tests/utils/vehicle/seedVehicle";
import { seedViolation } from "../../../../violation/tests/utils/violation/seedViolation";
import type { IViolationRecord } from "../../../src/domain/models/violationRecord/classes/violationRecord";
import {
  type IViolationRecordRepository,
  ViolationRecordRepository
} from "../../../src/repositories/violationRecordRepository";
import { createViolationRecordDomainObject } from "../../utils/violationRecord/createViolationRecordDomainObject";
import { seedViolationRecord } from "../../utils/violationRecord/seedViolationRecord";

const assertViolationRecord = (data: IViolationRecord, expected: IViolationRecord) => {
  expect(data.id).toBe(expected.id);
  expect(data.userId).toBe(expected.userId);
  expect(data.vehicleId).toBe(expected.vehicleId);
  expect(data.reportedById).toBe(expected.reportedById);
  expect(data.status.value).toBe(expected.status.value);
  expect(data.remarks.value).toBe(expected.remarks.value);
};

describe("ViolationRecordRepository.updateViolationRecord", () => {
  let violationRecordRepository: IViolationRecordRepository;

  beforeAll(async () => {
    violationRecordRepository = new ViolationRecordRepository();
  });

  beforeEach(async () => {
    await db.violationRecord.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully update a violation record", async () => {
    const seededUser = await seedUser({});
    const seededVehicle = await seedVehicle({ ownerId: seededUser.id });
    const seededSecurity = await seedUser({ role: "SECURITY" });
    const seededViolation = await seedViolation({});
    const seededViolationRecord = await seedViolationRecord({
      userId: seededUser.id,
      vehicleId: seededVehicle.id,
      reportedById: seededSecurity.id,
      violationId: seededViolation.id,
      status: "UNPAID",
      remarks: "Initial remark"
    });

    const updatedViolationRecordObject = createViolationRecordDomainObject({
      id: seededViolationRecord.id,
      userId: seededUser.id,
      vehicleId: seededVehicle.id,
      reportedById: seededSecurity.id,
      violationId: seededViolation.id,
      status: "PAID",
      remarks: "Updated remark"
    });

    const updatedViolationRecord = await violationRecordRepository.updateViolationRecord(
      updatedViolationRecordObject
    );

    expect(updatedViolationRecord).not.toBeNull();
    assertViolationRecord(updatedViolationRecord!, updatedViolationRecordObject);
  });

  it("should return null when trying to update a non-existent violation record", async () => {
    const nonExistentViolationRecord = createViolationRecordDomainObject({
      id: "non-existent-id",
      status: "PAID",
      remarks: "Some remark"
    });

    const result = await violationRecordRepository.updateViolationRecord(
      nonExistentViolationRecord
    );
    expect(result).toBeNull();
  });
});
