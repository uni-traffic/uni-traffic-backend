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

describe("ViolationRecordRepository.getViolationRecordByUserId", () => {
  let violationRecordRepository: IViolationRecordRepository;

  beforeAll(async () => {
    violationRecordRepository = new ViolationRecordRepository();
  });

  beforeEach(async () => {
    await db.violationRecord.deleteMany();
  });

  it("should retrieve an existing violation by user id", async () => {
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

    const violationRecord = await violationRecordRepository.getViolationsRecordByUserId(
      violationRecordData.userId
    );
    expect(violationRecord).toBeTruthy();
    expect(violationRecord[0].userId).toBe(violationRecordData.userId);
  });

  it("should return an empty array when given non-existing user IDs", async () => {
    const violationRecordData =
      await violationRecordRepository.getViolationsRecordByUserId("non-existing-user-id");
    expect(violationRecordData).toEqual([]);
  });
});
