import { NotFoundError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { combineDate } from "../../../../shared/lib/utils";
import { GetTotalFineCollectedPerDayByRangeUseCase } from "../../src/useCases/getTotalFineCollectedByRangePerDayUseCase";
import { seedViolationRecordPayment } from "../utils/violationRecordPayment/seedViolationRecordPayment";

describe("GetTotalCollectedFineByRangePerDayUseCase", () => {
  let getTotalFineCollectedByRangePerDayUseCase: GetTotalFineCollectedPerDayByRangeUseCase;

  beforeAll(() => {
    getTotalFineCollectedByRangePerDayUseCase = new GetTotalFineCollectedPerDayByRangeUseCase();
  });

  beforeEach(async () => {
    await db.violationRecordPayment.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return an array of total fine collected per day within the specified date range", async () => {
    const startDate = "2023-01-01";
    const endDate = "2023-01-31";

    const seededViolationRecordPayment = await Promise.all([
      seedViolationRecordPayment({
        timePaid: new Date("2023-01-03T12:00:00Z"),
        amountPaid: 100
      }),
      seedViolationRecordPayment({
        timePaid: new Date("2023-01-03T10:00:00Z"),
        amountPaid: 200
      }),
      seedViolationRecordPayment({
        timePaid: new Date("2023-01-03T13:00:00Z"),
        amountPaid: 300
      }),
      seedViolationRecordPayment({
        timePaid: new Date("2023-01-06T14:00:00Z"),
        amountPaid: 150
      }),
      seedViolationRecordPayment({
        timePaid: new Date("2024-01-05T14:00:00Z"),
        amountPaid: 150
      })
    ]);

    const result = await getTotalFineCollectedByRangePerDayUseCase.execute({
      startDate,
      endDate
    });

    const combinedDate = combineDate(seededViolationRecordPayment);

    expect(result.length).toBe(2);
    expect(result[0].timePaid.toISOString()).toContain(combinedDate[0]);
    expect(result[1].timePaid.toISOString()).toContain(combinedDate[1]);
    expect(result[0].amountPaid).toBe(600);
    expect(result[1].amountPaid).toBe(150);
  });

  it("should return an empty array if no records are found within the specified date range", async () => {
    const startDate = "2023-01-01";
    const endDate = "2023-01-31";

    await expect(
      getTotalFineCollectedByRangePerDayUseCase.execute({
        startDate,
        endDate
      })
    ).rejects.toThrow(new NotFoundError("No Violation Record Payments found"));
  });
});
