import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { createUserPersistenceData } from "../../../../user/tests/utils/user/createUserPersistenceData";
import { createVehiclePersistenceData } from "../../../../vehicle/tests/utils/vehicle/createVehiclePersistenceData";
import { createViolationPersistenceData } from "../../../../violation/tests/utils/violation/createViolationPersistenceData";
import {
  type IViolationRecordRepository,
  ViolationRecordRepository
} from "../../../src/repositories/violationRecordRepository";

describe("ViolationRecordRepository.getViolationRecordByVehicleId", () => {
  let violationRecordRepository: IViolationRecordRepository;

  beforeAll(async () => {
    violationRecordRepository = new ViolationRecordRepository();
  });

  beforeEach(async () => {
    await db.violationRecord.deleteMany();
  });

  it("should retrieve an existing violation by vehicle id", async () => {
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

    const violationRecord = await violationRecordRepository.getViolationsRecordByVehicleId(
      violationRecordData.vehicleId
    );
    expect(violationRecord).toBeTruthy();
    expect(violationRecord[0].vehicleId).toBe(violationRecordData.vehicleId);
  });

  it("should return an empty array when given non-existing vehicle IDs", async () => {
    const violationRecordData =
      await violationRecordRepository.getViolationsRecordByVehicleId("non-existing-vehicle-id");
    expect(violationRecordData).toEqual([]);
  });
});
