import { faker } from "@faker-js/faker";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { seedVehicle } from "../../../vehicle/tests/utils/vehicle/seedVehicle";
import { seedViolation } from "../../../violation/tests/utils/violation/seedViolation";
import { GetViolationRecordInformationUseCase } from "../../src/useCases/getViolationRecordUseCase";
import { seedViolationRecord } from "../utils/violationRecord/seedViolationRecord";
import { NotFoundError } from "../../../../shared/core/errors";

describe("GetViolationRecordUseCase", () => {
  let getViolationRecordUseCase: GetViolationRecordInformationUseCase;

  beforeAll(async () => {
    getViolationRecordUseCase = new GetViolationRecordInformationUseCase();
  });

  beforeEach(async () => {
    await db.violationRecord.deleteMany();
  });

  it("should return record that match the given violation record id", async () => {
    const seededViolationRecord = await seedViolationRecord({});

    const result = await getViolationRecordUseCase.execute({
      id: seededViolationRecord.id
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(seededViolationRecord.id);
    expect(result[0].reportedById).toBe(seededViolationRecord.reportedById);
    expect(result[0].status).toBe(seededViolationRecord.status);
    expect(result[0].userId).toBe(seededViolationRecord.userId);
    expect(result[0].vehicleId).toBe(seededViolationRecord.vehicleId);
    expect(result[0].violationId).toBe(seededViolationRecord.violationId);
  });

  it("should return record that match the given vehicle id", async () => {
    const seededVehicle = await seedVehicle({});
    const seededViolationRecord1 = await seedViolationRecord({ vehicleId: seededVehicle.id });
    const seededViolationRecord2 = await seedViolationRecord({ vehicleId: seededVehicle.id });
    const seededViolationRecord3 = await seedViolationRecord({ vehicleId: seededVehicle.id });

    const result = await getViolationRecordUseCase.execute({
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

    const result = await getViolationRecordUseCase.execute({
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

    const result = await getViolationRecordUseCase.execute({
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

    const result = await getViolationRecordUseCase.execute({
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

    const result = await getViolationRecordUseCase.execute({
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

    const result = await getViolationRecordUseCase.execute({
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

    await expect(
      getViolationRecordUseCase.execute({
        id: faker.string.uuid()
      })
    ).rejects.toThrow(new NotFoundError("Violation Records not found"));
  });
});
