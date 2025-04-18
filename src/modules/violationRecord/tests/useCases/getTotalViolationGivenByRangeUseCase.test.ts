import { faker } from "@faker-js/faker";
import { ForbiddenError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { GetTotalViolationGivenByRangeUseCase } from "../../src/useCases/getTotalViolationGivenByRangeUseCase";
import { seedViolationRecord } from "../utils/violationRecord/seedViolationRecord";

describe("GetTotalViolationGivenByRangeUseCase", () => {
  let useCase: GetTotalViolationGivenByRangeUseCase;

  beforeAll(() => {
    useCase = new GetTotalViolationGivenByRangeUseCase();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
    await db.violation.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully return the correct count per DAY on given range", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"])
    });
    await Promise.all([
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-01T01:15:30.123Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-01T03:45:10.456Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-01T12:00:00.789Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-02T12:00:00.789Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-02T12:00:00.789Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-03T13:00:00.789Z") })
    ]);

    const result = await useCase.execute({
      actorId: seededActor.id,
      startDate: "2024-01-01",
      endDate: "2025-12-31",
      type: "DAY"
    });

    expect(result).toContainEqual({ date: "2024-05-01", count: 3 });
    expect(result).toContainEqual({ date: "2024-05-02", count: 2 });
    expect(result).toContainEqual({ date: "2024-05-03", count: 1 });
  });

  it("should successfully return the correct count per MONTH on given range", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"])
    });
    await Promise.all([
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-02-01T01:15:30.123Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-02-01T03:45:10.456Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-01T12:00:00.789Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-02T12:00:00.789Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-05-02T12:00:00.789Z") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024-08-03T13:00:00.789Z") })
    ]);

    const result = await useCase.execute({
      actorId: seededActor.id,
      startDate: "2024-01-01",
      endDate: "2025-12-31",
      type: "MONTH"
    });

    expect(result).toContainEqual({ date: "2024-02", count: 2 });
    expect(result).toContainEqual({ date: "2024-05", count: 3 });
    expect(result).toContainEqual({ date: "2024-08", count: 1 });
  });

  it("should successfully return the correct count per YEAR on given range", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"])
    });
    await Promise.all([
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2021") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2022") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2022") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2022") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2023") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2023") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024") }),
      seedViolationRecord({ status: "UNPAID", createdAt: new Date("2024") })
    ]);

    const result = await useCase.execute({
      actorId: seededActor.id,
      startDate: "2020-01-01",
      endDate: "2025-12-31",
      type: "YEAR"
    });

    expect(result).toContainEqual({ date: "2021", count: 1 });
    expect(result).toContainEqual({ date: "2022", count: 3 });
    expect(result).toContainEqual({ date: "2023", count: 2 });
    expect(result).toContainEqual({ date: "2024", count: 3 });
  });

  it("should throw ForbiddenError when user lacks permission", async () => {
    const seededActor = await seedUser({
      role: faker.helpers.arrayElement(["STUDENT", "STAFF", "GUEST"])
    });

    await expect(
      useCase.execute({
        actorId: seededActor.id,
        startDate: "2020-01-01",
        endDate: "2025-12-31",
        type: "YEAR"
      })
    ).rejects.toThrow(new ForbiddenError("You do not have permission to perform this action."));
  });
});
