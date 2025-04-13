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

describe("ViolationRecordRepository.getViolationRecordByProperty", () => {
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

    const result = await violationRecordRepository.getViolationRecordByProperty({
      id: seededViolationRecord.id
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(seededViolationRecord.id);
  });

  it("should return record that match the given vehicle id", async () => {
    const seededVehicle = await seedVehicle({});
    const seededViolationRecord1 = await seedViolationRecord({ vehicleId: seededVehicle.id });
    const seededViolationRecord2 = await seedViolationRecord({ vehicleId: seededVehicle.id });
    const seededViolationRecord3 = await seedViolationRecord({ vehicleId: seededVehicle.id });

    const result = await violationRecordRepository.getViolationRecordByProperty({
      vehicleId: seededVehicle.id
    });
    const mappedViolationRecordIds = result.map((violationRecord) => violationRecord.id);

    expect(result.length).toBe(3);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord1.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord2.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord3.id);
  });

  it("should return record that match the given user id", async () => {
    const seededUser = await seedUser({});
    const seededViolationRecord1 = await seedViolationRecord({ userId: seededUser.id });
    const seededViolationRecord2 = await seedViolationRecord({ userId: seededUser.id });
    const seededViolationRecord3 = await seedViolationRecord({ userId: seededUser.id });

    const result = await violationRecordRepository.getViolationRecordByProperty({
      userId: seededUser.id
    });
    const mappedViolationRecordIds = result.map((violationRecord) => violationRecord.id);

    expect(result.length).toBe(3);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord1.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord2.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord3.id);
  });

  it("should return record that match the given violation id", async () => {
    const seededViolation = await seedViolation({});
    const seededViolationRecord1 = await seedViolationRecord({ violationId: seededViolation.id });
    const seededViolationRecord2 = await seedViolationRecord({ violationId: seededViolation.id });
    const seededViolationRecord3 = await seedViolationRecord({ violationId: seededViolation.id });

    const result = await violationRecordRepository.getViolationRecordByProperty({
      violationId: seededViolation.id
    });
    const mappedViolationRecordIds = result.map((violationRecord) => violationRecord.id);

    expect(result.length).toBe(3);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord1.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord2.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord3.id);
  });

  it("should only retrieve record by the given status", async () => {
    const seededViolationRecord1 = await seedViolationRecord({ status: "PAID" });
    const seededViolationRecord2 = await seedViolationRecord({ status: "PAID" });
    const seededViolationRecord3 = await seedViolationRecord({ status: "PAID" });
    const seededViolationRecord4 = await seedViolationRecord({ status: "UNPAID" });

    const result = await violationRecordRepository.getViolationRecordByProperty({
      status: "PAID"
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
    const seededViolationRecord1 = await seedViolationRecord({
      status: "UNPAID",
      userId: seededUser.id,
      violationId: seededViolation.id
    });
    const seededViolationRecord2 = await seedViolationRecord({
      status: "UNPAID",
      userId: seededUser.id,
      violationId: seededViolation.id
    });
    const seededViolationRecord3 = await seedViolationRecord({
      status: "UNPAID",
      userId: seededUser.id,
      violationId: seededViolation.id
    });
    const seededViolationRecord4 = await seedViolationRecord({
      status: "PAID",
      userId: seededUser.id,
      violationId: seededViolation.id
    });

    const result = await violationRecordRepository.getViolationRecordByProperty({
      userId: seededUser.id,
      violationId: seededViolation.id,
      status: "UNPAID"
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
    const seededViolationRecord1 = await seedViolationRecord({
      status: "UNPAID",
      vehicleId: seededVehicle.id,
      violationId: seededViolation.id
    });
    const seededViolationRecord2 = await seedViolationRecord({
      status: "UNPAID",
      vehicleId: seededVehicle.id,
      violationId: seededViolation.id
    });
    const seededViolationRecord3 = await seedViolationRecord({
      status: "UNPAID",
      vehicleId: seededVehicle.id,
      violationId: seededViolation.id
    });
    const seededViolationRecord4 = await seedViolationRecord({
      status: "PAID",
      vehicleId: seededVehicle.id,
      violationId: seededViolation.id
    });

    const result = await violationRecordRepository.getViolationRecordByProperty({
      vehicleId: seededVehicle.id,
      violationId: seededViolation.id,
      status: "UNPAID"
    });
    const mappedViolationRecordIds = result.map((violationRecord) => violationRecord.id);

    expect(result.length).toBe(3);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord1.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord2.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord3.id);
    expect(mappedViolationRecordIds).not.toContain(seededViolationRecord4.id);
  });

  it("should return an emptry array if the id given does not exist in the database", async () => {
    await seedViolationRecord({});

    const result = await violationRecordRepository.getViolationRecordByProperty({
      id: faker.string.uuid()
    });

    expect(result.length).toBe(0);
  });
});
