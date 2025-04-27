import { faker } from "@faker-js/faker";
import { NotFoundError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { seedVehicle } from "../../../vehicle/tests/utils/vehicle/seedVehicle";
import { seedViolation } from "../../../violation/tests/utils/violation/seedViolation";
import { GetViolationRecordUseCase } from "../../src/useCases/getViolationRecordUseCase";
import { seedViolationRecord } from "../utils/violationRecord/seedViolationRecord";

describe("GetViolationRecordUseCase", () => {
  let getViolationRecordUseCase: GetViolationRecordUseCase;

  beforeAll(async () => {
    getViolationRecordUseCase = new GetViolationRecordUseCase();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
    await db.violationRecord.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return record that match the given violation record id", async () => {
    const seededViolationRecord = await seedViolationRecord({});

    const result = await getViolationRecordUseCase.execute({
      id: seededViolationRecord.id,
      count: "10",
      page: "1"
    });

    expect(result.violation.length).toBe(1);
    expect(result.violation[0].id).toBe(seededViolationRecord.id);
    expect(result.violation[0].reportedById).toBe(seededViolationRecord.reportedById);
    expect(result.violation[0].status).toBe(seededViolationRecord.status);
    expect(result.violation[0].userId).toBe(seededViolationRecord.userId);
    expect(result.violation[0].vehicleId).toBe(seededViolationRecord.vehicleId);
    expect(result.violation[0].violationId).toBe(seededViolationRecord.violationId);
  });

  it("should return record that match the given vehicle id", async () => {
    const seededVehicle = await seedVehicle({});
    const [seededViolationRecord1, seededViolationRecord2, seededViolationRecord3] =
      await Promise.all([
        seedViolationRecord({ vehicleId: seededVehicle.id }),
        seedViolationRecord({ vehicleId: seededVehicle.id }),
        seedViolationRecord({ vehicleId: seededVehicle.id })
      ]);

    const result = await getViolationRecordUseCase.execute({
      vehicleId: seededVehicle.id,
      count: "10",
      page: "1"
    });
    const mappedViolationRecordIds = result.violation.map((violationRecord) => violationRecord.id);

    expect(result.violation.length).toBe(3);
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

    const result = await getViolationRecordUseCase.execute({
      userId: seededUser.id,
      count: "10",
      page: "1"
    });
    const mappedViolationRecordIds = result.violation.map((violationRecord) => violationRecord.id);

    expect(result.violation.length).toBe(3);
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

    const result = await getViolationRecordUseCase.execute({
      violationId: seededViolation.id,
      count: "10",
      page: "1"
    });
    const mappedViolationRecordIds = result.violation.map((violationRecord) => violationRecord.id);

    expect(result.violation.length).toBe(3);
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
      status: "PAID",
      count: "10",
      page: "1"
    });
    const mappedViolationRecordIds = result.violation.map((violationRecord) => violationRecord.id);

    expect(result.violation.length).toBe(3);
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

    const result = await getViolationRecordUseCase.execute({
      userId: seededUser.id,
      violationId: seededViolation.id,
      status: "UNPAID",
      count: "10",
      page: "1"
    });
    const mappedViolationRecordIds = result.violation.map((violationRecord) => violationRecord.id);

    expect(result.violation.length).toBe(3);
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

    const result = await getViolationRecordUseCase.execute({
      vehicleId: seededVehicle.id,
      violationId: seededViolation.id,
      status: "UNPAID",
      count: "10",
      page: "1"
    });
    const mappedViolationRecordIds = result.violation.map((violationRecord) => violationRecord.id);

    expect(result.violation.length).toBe(3);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord1.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord2.id);
    expect(mappedViolationRecordIds).toContain(seededViolationRecord3.id);
    expect(mappedViolationRecordIds).not.toContain(seededViolationRecord4.id);
  });

  it("should return paginated audit logs with correct metadata on first page", async () => {
    const user = await seedUser({});
    await Promise.all(
      Array.from({ length: 6 }).map(() => seedViolationRecord({ userId: user.id }))
    );

    const page1 = await getViolationRecordUseCase.execute({
      userId: user.id,
      count: "3",
      page: "1"
    });

    expect(page1.violation).toHaveLength(3);
    expect(page1.hasNextPage).toBe(true);
    expect(page1.totalPages).toBe(2);
    expect(page1.hasPreviousPage).toBe(false);

    const pageTwo = await getViolationRecordUseCase.execute({
      userId: user.id,
      count: "3",
      page: "2"
    });

    expect(pageTwo.violation).toHaveLength(3);
    expect(pageTwo.hasNextPage).toBe(false);
    expect(pageTwo.totalPages).toBe(2);
    expect(pageTwo.hasPreviousPage).toBe(true);
  });

  it("should filter violation using strict matching for status, userId, vehicleId, and reportedById", async () => {
    const user = await seedUser({});

    const seededViolationRecord = await seedViolationRecord({
      userId: user.id,
      status: "PAID"
    });

    const result = await getViolationRecordUseCase.execute({
      userId: user.id,
      vehicleId: seededViolationRecord.vehicleId,
      reportedById: seededViolationRecord.reportedById,
      status: "PAID",
      count: "10",
      page: "1"
    });

    expect(result.violation.length).toBeGreaterThan(0);
    expect(result.violation[0].status).toBe("PAID");
    expect(result.violation[0].vehicleId).toContain(seededViolationRecord.vehicleId);
    expect(result.violation[0].reportedById).toContain(seededViolationRecord.reportedById);
    expect(result.violation[0].userId).toBe(seededViolationRecord.userId);
  });

  it("should return violationRecord sorted in ascending order when sort = 1", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedViolationRecord({ userId: user.id, createdAt: new Date("2024-01-01") }),
      seedViolationRecord({ userId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const result = await getViolationRecordUseCase.execute({
      userId: user.id,
      count: "10",
      page: "1",
      sort: "1"
    });

    expect(result.violation).toHaveLength(2);
    expect(new Date(result.violation[1].date).getTime()).toBeGreaterThan(
      new Date(result.violation[0].date).getTime()
    );
  });

  it("should return violationRecord sorted in descending order when sort = 2", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedViolationRecord({ userId: user.id, createdAt: new Date("2024-01-01") }),
      seedViolationRecord({ userId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const result = await getViolationRecordUseCase.execute({
      userId: user.id,
      count: "10",
      page: "1",
      sort: "2"
    });

    expect(result.violation).toHaveLength(2);
    expect(new Date(result.violation[0].date).getTime()).toBeGreaterThan(
      new Date(result.violation[1].date).getTime()
    );
  });

  it("should return violationRecord default sort to descending(2) when sort is does not exist", async () => {
    const user = await seedUser({});
    await Promise.all([
      seedViolationRecord({ userId: user.id, createdAt: new Date("2024-01-01") }),
      seedViolationRecord({ userId: user.id, createdAt: new Date("2023-01-01") })
    ]);

    const result = await getViolationRecordUseCase.execute({
      userId: user.id,
      count: "10",
      page: "1"
    });

    expect(result.violation).toHaveLength(2);
    expect(new Date(result.violation[0].date).getTime()).toBeGreaterThan(
      new Date(result.violation[1].date).getTime()
    );
  });

  it("should throw an error if the id given does not exist in the database", async () => {
    await seedViolationRecord({});

    await expect(
      getViolationRecordUseCase.execute({
        id: faker.string.uuid()
      })
    ).rejects.toThrow(new NotFoundError("Violation Records not found"));
  });
});
