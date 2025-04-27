import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import { seedVehicle } from "../../../../vehicle/tests/utils/vehicle/seedVehicle";
import { seedViolation } from "../../../../violation/tests/utils/violation/seedViolation";
import {
  type IViolationRecordRepository,
  ViolationRecordRepository
} from "../../../src/repositories/violationRecordRepository";
import { seedViolationRecord } from "../../utils/violationRecord/seedViolationRecord";

describe("ViolationRecordRepository.getViolationRecord", () => {
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

  it("should return record that match the given violation record id", async () => {
    const seededViolationRecord = await seedViolationRecord({});

    const result = await violationRecordRepository.getViolationRecord({
      id: seededViolationRecord.id,
      count: 1,
      page: 1
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(seededViolationRecord.id);
  });

  it("should return record that match the given vehicle id", async () => {
    const seededVehicle = await seedVehicle({});
    const [seededViolationRecord1, seededViolationRecord2, seededViolationRecord3] =
      await Promise.all([
        seedViolationRecord({ vehicleId: seededVehicle.id }),
        seedViolationRecord({ vehicleId: seededVehicle.id }),
        seedViolationRecord({ vehicleId: seededVehicle.id })
      ]);

    const result = await violationRecordRepository.getViolationRecord({
      vehicleId: seededVehicle.id,
      count: 3,
      page: 1
    });

    const mappedViolationRecordIds = result.map((violationRecord) => violationRecord.id);

    expect(result.length).toBe(3);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord1.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord2.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord3.id);
  });

  it("should return record that match the given user id", async () => {
    const seededUser = await seedUser({});
    const [seededViolationRecord1, seededViolationRecord2, seededViolationRecord3] =
      await Promise.all([
        seedViolationRecord({ userId: seededUser.id }),
        seedViolationRecord({ userId: seededUser.id }),
        seedViolationRecord({ userId: seededUser.id })
      ]);

    const result = await violationRecordRepository.getViolationRecord({
      userId: seededUser.id,
      count: 3,
      page: 1
    });
    const mappedViolationRecordIds = result.map((violationRecord) => violationRecord.id);

    expect(result.length).toBe(3);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord1.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord2.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord3.id);
  });

  it("should return record that match the given violation id", async () => {
    const seededViolation = await seedViolation({});
    const [seededViolationRecord1, seededViolationRecord2, seededViolationRecord3] =
      await Promise.all([
        seedViolationRecord({ violationId: seededViolation.id }),
        seedViolationRecord({ violationId: seededViolation.id }),
        seedViolationRecord({ violationId: seededViolation.id })
      ]);

    const result = await violationRecordRepository.getViolationRecord({
      violationId: seededViolation.id,
      count: 3,
      page: 1
    });
    const mappedViolationRecordIds = result.map((violationRecord) => violationRecord.id);

    expect(result.length).toBe(3);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord1.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord2.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord3.id);
  });

  it("should only retrieve record by the given status", async () => {
    const [
      seededViolationRecord1,
      seededViolationRecord2,
      seededViolationRecord3,
      seededViolationRecord4
    ] = await Promise.all([
      seedViolationRecord({ status: "PAID" }),
      seedViolationRecord({ status: "PAID" }),
      seedViolationRecord({ status: "PAID" }),
      seedViolationRecord({ status: "UNPAID" })
    ]);

    const result = await violationRecordRepository.getViolationRecord({
      status: "PAID",
      count: 3,
      page: 1
    });
    const mappedViolationRecordIds = result.map((violationRecord) => violationRecord.id);

    expect(result.length).toBe(3);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord1.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord2.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord3.id);
    expect(mappedViolationRecordIds).not.toContain(seededViolationRecord4.id);
  });

  it("should return record that match the given parameters", async () => {
    const seededUser = await seedUser({});
    const seededViolation = await seedViolation({});
    const [
      seededViolationRecord1,
      seededViolationRecord2,
      seededViolationRecord3,
      seededViolationRecord4
    ] = await Promise.all([
      seedViolationRecord({
        status: "UNPAID",
        userId: seededUser.id,
        violationId: seededViolation.id
      }),
      seedViolationRecord({
        status: "UNPAID",
        userId: seededUser.id,
        violationId: seededViolation.id
      }),
      seedViolationRecord({
        status: "UNPAID",
        userId: seededUser.id,
        violationId: seededViolation.id
      }),
      seedViolationRecord({
        status: "PAID",
        userId: seededUser.id,
        violationId: seededViolation.id
      })
    ]);

    const result = await violationRecordRepository.getViolationRecord({
      userId: seededUser.id,
      violationId: seededViolation.id,
      status: "UNPAID",
      count: 3,
      page: 1
    });
    const mappedViolationRecordIds = result.map((violationRecord) => violationRecord.id);

    expect(result.length).toBe(3);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord1.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord2.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord3.id);
    expect(mappedViolationRecordIds).not.toContain(seededViolationRecord4.id);
  });

  it("should return record that match the given parameters", async () => {
    const seededVehicle = await seedVehicle({});
    const seededViolation = await seedViolation({});
    const [
      seededViolationRecord1,
      seededViolationRecord2,
      seededViolationRecord3,
      seededViolationRecord4
    ] = await Promise.all([
      seedViolationRecord({
        status: "UNPAID",
        vehicleId: seededVehicle.id,
        violationId: seededViolation.id
      }),
      seedViolationRecord({
        status: "UNPAID",
        vehicleId: seededVehicle.id,
        violationId: seededViolation.id
      }),
      seedViolationRecord({
        status: "UNPAID",
        vehicleId: seededVehicle.id,
        violationId: seededViolation.id
      }),
      seedViolationRecord({
        status: "PAID",
        vehicleId: seededVehicle.id,
        violationId: seededViolation.id
      })
    ]);

    const result = await violationRecordRepository.getViolationRecord({
      vehicleId: seededVehicle.id,
      violationId: seededViolation.id,
      status: "UNPAID",
      count: 3,
      page: 1
    });
    const mappedViolationRecordIds = result.map((violationRecord) => violationRecord.id);

    expect(result.length).toBe(3);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord1.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord2.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord3.id);
    expect(mappedViolationRecordIds).not.toContain(seededViolationRecord4.id);
  });

  it("should return an empty array if the id given does not exist in the database", async () => {
    await seedViolationRecord({});

    const result = await violationRecordRepository.getViolationRecord({
      id: faker.string.uuid(),
      count: 3,
      page: 1
    });

    expect(result.length).toBe(0);
  });

  it("should return violationRecord sorted in ascending order when sort = 1", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedViolationRecord({ userId: user.id, createdAt: new Date("2024-01-01") }),
      seedViolationRecord({ userId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const logs = await violationRecordRepository.getViolationRecord({
      userId: user.id,
      count: 10,
      page: 1,
      sort: 1
    });

    expect(logs).toHaveLength(2);
    expect(new Date(logs[1].createdAt).getTime()).toBeGreaterThan(
      new Date(logs[0].createdAt).getTime()
    );
  });

  it("should return violationRecord sorted in descending order when sort = 2", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedViolationRecord({ userId: user.id, createdAt: new Date("2024-01-01") }),
      seedViolationRecord({ userId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const logs = await violationRecordRepository.getViolationRecord({
      userId: user.id,
      count: 10,
      page: 1,
      sort: 2
    });

    expect(logs).toHaveLength(2);
    expect(new Date(logs[0].createdAt).getTime()).toBeGreaterThan(
      new Date(logs[1].createdAt).getTime()
    );
  });

  it("should return violationRecord default sort to descending(2) when sort is does not exist", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedViolationRecord({ userId: user.id, createdAt: new Date("2024-01-01") }),
      seedViolationRecord({ userId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const logs = await violationRecordRepository.getViolationRecord({
      userId: user.id,
      count: 10,
      page: 1
    });

    expect(logs).toHaveLength(2);
    expect(new Date(logs[0].createdAt).getTime()).toBeGreaterThan(
      new Date(logs[1].createdAt).getTime()
    );
  });

  it("should correctly apply pagination", async () => {
    const user = await seedUser({});
    await Promise.all(
      Array.from({ length: 15 }).map(() => seedViolationRecord({ userId: user.id }))
    );

    const page1 = await violationRecordRepository.getViolationRecord({
      userId: user.id,
      count: 10,
      page: 1
    });
    const page2 = await violationRecordRepository.getViolationRecord({
      userId: user.id,
      count: 10,
      page: 2
    });

    expect(page1).toHaveLength(10);
    expect(page2).toHaveLength(5);
  });

  it("should filter violation using partial userId match with searchKey", async () => {
    const user = await seedUser({});
    const userId = user.id;
    await seedViolationRecord({ userId: userId });

    const violation = await violationRecordRepository.getViolationRecord({
      searchKey: userId.slice(0, 8),
      count: 10,
      page: 1
    });

    expect(violation.length).toBeGreaterThan(0);
    expect(violation[0].userId).toContain(userId.slice(0, 8));
  });

  it("should filter violation using partial id match with searchKey", async () => {
    const seededViolationRecord = await seedViolationRecord({});

    const violation = await violationRecordRepository.getViolationRecord({
      searchKey: seededViolationRecord.id.slice(0, 8),
      count: 10,
      page: 1
    });

    expect(violation.length).toBeGreaterThan(0);
    expect(violation[0].id).toContain(seededViolationRecord.id.slice(0, 8));
  });

  it("should filter violation using partial vehicleId match with searchKey", async () => {
    const seededViolationRecord = await seedViolationRecord({});

    const violation = await violationRecordRepository.getViolationRecord({
      searchKey: seededViolationRecord.vehicleId.slice(0, 8),
      count: 10,
      page: 1
    });

    expect(violation.length).toBeGreaterThan(0);
    expect(violation[0].vehicleId).toContain(seededViolationRecord.vehicleId.slice(0, 8));
  });

  it("should filter violation using partial reportedById match with searchKey", async () => {
    const seededViolationRecord = await seedViolationRecord({});

    const violation = await violationRecordRepository.getViolationRecord({
      searchKey: seededViolationRecord.reportedById.slice(0, 8),
      count: 10,
      page: 1
    });

    expect(violation.length).toBeGreaterThan(0);
    expect(violation[0].reportedById).toContain(seededViolationRecord.reportedById.slice(0, 8));
  });

  it("should filter violation using strict matching for status, userId, vehicleId, and reportedById", async () => {
    const seededUser = await seedUser({});
    const seededViolationRecord = await seedViolationRecord({
      userId: seededUser.id,
      status: "PAID"
    });

    const violation = await violationRecordRepository.getViolationRecord({
      userId: seededUser.id,
      vehicleId: seededViolationRecord.vehicleId,
      reportedById: seededViolationRecord.reportedById,
      status: "PAID",
      count: 10,
      page: 1
    });

    expect(violation.length).toBe(1);
    expect(violation[0].id).toBe(seededViolationRecord.id);
    expect(violation[0].vehicleId).toBe(seededViolationRecord.vehicleId);
    expect(violation[0].reportedById).toBe(seededViolationRecord.reportedById);
    expect(violation[0].status.value).toBe(seededViolationRecord.status);
  });
});
