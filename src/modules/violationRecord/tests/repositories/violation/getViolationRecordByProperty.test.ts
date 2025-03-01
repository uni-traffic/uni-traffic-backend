import { v4 as uuid } from "uuid";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { createUserPersistenceData } from "../../../../user/tests/utils/user/createUserPersistenceData";
import { createVehiclePersistenceData } from "../../../../vehicle/tests/utils/vehicle/createVehiclePersistenceData";
import { createViolationPersistenceData } from "../../../../violation/tests/utils/violation/createViolationPersistenceData";
import {
  type IViolationRecordRepository,
  ViolationRecordRepository
} from "../../../src/repositories/violationRecordRepository";
import { faker } from "@faker-js/faker";

describe("ViolationRecordRepository.getViolationRecordByProperty", () => {
  let violationRecordRepository: IViolationRecordRepository;

  beforeAll(async () => {
    violationRecordRepository = new ViolationRecordRepository();
  });

  beforeEach(async () => {
    await db.violationRecord.deleteMany();
  });

  it("should retrieve a violation record when only id is provided", async () => {
    const user = await db.user.create({ data: createUserPersistenceData({}) });
    const reporter = await db.user.create({ data: createUserPersistenceData({}) });
    const violation = await db.violation.create({ data: createViolationPersistenceData({}) });
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

    const violationRecord = await db.violationRecord.create({
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

    const result = await violationRecordRepository.getViolationRecordByProperty({ id: violationRecord.id });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(violationRecord.id);
  });

  it("should retrieve a violation record when only vehicleId is provided", async () => {
    const user = await db.user.create({ data: createUserPersistenceData({}) });
    const reporter = await db.user.create({ data: createUserPersistenceData({}) });
    const violation = await db.violation.create({ data: createViolationPersistenceData({}) });
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

    await db.violationRecord.create({
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

    const result = await violationRecordRepository.getViolationRecordByProperty({ vehicleId: vehicleData.id });
    expect(result.length).toBe(1);
    expect(result[0].vehicleId).toBe(vehicleData.id);
  });

  it("should retrieve a violation record when only userId is provided", async () => {
    const user = await db.user.create({ data: createUserPersistenceData({}) });
    const reporter = await db.user.create({ data: createUserPersistenceData({}) });
    const violation = await db.violation.create({ data: createViolationPersistenceData({}) });
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

    await db.violationRecord.create({
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

    const result = await violationRecordRepository.getViolationRecordByProperty({ userId: user.id });
    expect(result.length).toBe(1);
    expect(result[0].userId).toBe(user.id);
  });
});
