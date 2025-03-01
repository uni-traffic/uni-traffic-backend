import { seedViolations } from "../../../../../../scripts/seedViolation";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import { seedVehicle } from "../../../../vehicle/tests/utils/vehicle/seedVehicle";
import { seedViolation } from "../../../../violation/tests/utils/violation/seedViolation";
import {
  type IViolationRecord,
  ViolationRecord
} from "../../../src/domain/models/violationRecord/classes/violationRecord";
import {
  type IViolationRecordRepository,
  ViolationRecordRepository
} from "../../../src/repositories/violationRecordRepository";
import { createViolationRecordDomainObject } from "../../utils/violationRecord/createViolationRecordDomainObject";

const assertViolationRecord = (data: IViolationRecord, expected: IViolationRecord) => {
  expect(data.id).toBe(expected.id);
  expect(data.userId).toBe(expected.userId);
  expect(data.vehicleId).toBe(expected.vehicleId);
  expect(data.reportedById).toBe(expected.reportedById);
  expect(data.status.value).toBe(expected.status.value);
};

describe("ViolationRepository.createViolationRecord", () => {
  let violationRecordRepository: IViolationRecordRepository;

  beforeAll(async () => {
    await seedViolations();
    violationRecordRepository = new ViolationRecordRepository();
  });

  it("should successfully create a violation record", async () => {
    const seededOwner = await seedUser({});
    const seededVehicle = await seedVehicle({ ownerId: seededOwner.id });
    const seededSecurity = await seedUser({ role: "SECURITY" });
    const seededViolation = await seedViolation({});

    const violationRecordObject = createViolationRecordDomainObject({
      violationId: seededViolation.id,
      vehicleId: seededVehicle.id,
      userId: seededOwner.id,
      status: "UNPAID",
      reportedById: seededSecurity.id
    });
    const savedViolationRecord =
      await violationRecordRepository.createViolationRecord(violationRecordObject);

    expect(savedViolationRecord).not.toBeNull();
    expect(savedViolationRecord).toBeInstanceOf(ViolationRecord);
    assertViolationRecord(savedViolationRecord!, violationRecordObject);
  });

  it("should fail when one of the foreign key doesn't exist on the system", async () => {
    const violationRecordObject = createViolationRecordDomainObject({});

    const savedViolationRecord =
      await violationRecordRepository.createViolationRecord(violationRecordObject);

    expect(savedViolationRecord).toBeNull();
  });
});
