import { v4 as uuid } from "uuid";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { ViolationRecordRepository } from "../../../src/repositories/violationRecordRepository";
import { faker } from "@faker-js/faker";
import { createUserPersistenceData } from "../../../../user/tests/utils/user/createUserPersistenceData";
import { createViolationPersistenceData } from "../../../../violation/tests/utils/violation/createViolationPersistenceData";
import { createVehiclePersistenceData } from "../../../../vehicle/tests/utils/vehicle/createVehiclePersistenceData";

describe("ViolationRecordRepository.getViolationRecordById", () => {
  let violationRecordRepository: ViolationRecordRepository;

  beforeAll(async () => {
    violationRecordRepository = new ViolationRecordRepository();
  });

  beforeEach(async () => {
    await db.violation.deleteMany();
  });

  it("should retrieve an existing violation record by id", async () => {
    const user = await db.user.create({
      data: createUserPersistenceData({})
    });

    const reporter = await db.user.create({
      data: createUserPersistenceData({})
    });

    const violation = await db.violation.create({
      data: createViolationPersistenceData({})
    });
    const vehicleData = createVehiclePersistenceData({});
    const { owner, ...vehicleDataWithoutOwner } = vehicleData;

    await db.vehicle.create({
      data: {
        ...vehicleDataWithoutOwner,
        ownerId: user.id
      },
      include: {
        owner: true
      }
    });

    const violationRecordData = await db.violationRecord.create({
      data: {
        id: uuid(),
        violationId: violation.id,
        vehicleId: vehicleData.id,
        userId: user.id,
        reportedById: reporter.id,
        status: faker.helpers.arrayElement(["UNPAID", "PAID"])
      },
      include: { reporter: true, user: true, vehicle: true, violation: true }
    });

    const violationRecord = await violationRecordRepository.getViolationRecordById(
      violationRecordData.id
    );
    expect(violationRecord).toBeTruthy();
    expect(violationRecord?.id).toBe(violationRecordData.id);
  });

  it("should return null for non-existing violation record id", async () => {
    const violationRecord = await violationRecordRepository.getViolationRecordById(
      "non-existing-violation-id"
    );
    expect(violationRecord).toBeNull;
  });
});
