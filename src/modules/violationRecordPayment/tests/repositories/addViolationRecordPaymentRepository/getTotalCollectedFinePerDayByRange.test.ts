import { db } from "../../../../../shared/infrastructure/database/prisma";
import {
  type IViolationRecordPaymentRepository,
  ViolationRecordPaymentRepository
} from "../../../src/repositories/violationRecordPaymentRepository";
import { seedViolationRecordPayment } from "../../utils/violationRecordPayment/seedViolationRecordPayment";

describe("ViolationRecordPaymentRepository.getTotalFineCollectedPerDayByRange", () => {
  let violationRecordPaymentRepository: IViolationRecordPaymentRepository;

  beforeAll(() => {
    violationRecordPaymentRepository = new ViolationRecordPaymentRepository();
  });

  beforeEach(async () => {
    await db.violationRecordPayment.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return an array of violation record payments within the specified date range", async () => {
    const startDate = new Date("2023-01-01");
    const endDate = new Date("2023-01-31");

    const seededViolationRecordPayment1 = await seedViolationRecordPayment({
      timePaid: new Date("2023-01-03T12:00:00Z"),
      amountPaid: 100
    });
    const seededViolationRecordPayment2 = await seedViolationRecordPayment({
      timePaid: new Date("2023-01-03T10:00:00Z"),
      amountPaid: 200
    });
    const seededViolationRecordPayment3 = await seedViolationRecordPayment({
      timePaid: new Date("2023-01-05T14:00:00Z"),
      amountPaid: 150
    });
    const seededViolationRecordPayment4 = await seedViolationRecordPayment({
      timePaid: new Date("2024-01-03T13:00:00Z"),
      amountPaid: 300
    });

    const result = await violationRecordPaymentRepository.getTotalFineCollectedPerDayByRange({
      startDate,
      endDate
    });

    const mappedViolationRecordPayment = result.map(
      (violationRecordPayment) => violationRecordPayment.timePaid
    );

    expect(mappedViolationRecordPayment).toContainEqual(seededViolationRecordPayment1.timePaid);
    expect(mappedViolationRecordPayment).toContainEqual(seededViolationRecordPayment2.timePaid);
    expect(mappedViolationRecordPayment).toContainEqual(seededViolationRecordPayment3.timePaid);
    expect(mappedViolationRecordPayment).not.toContainEqual(seededViolationRecordPayment4.timePaid);
    expect(result.length).toBe(3);
  });

  it("should return an empty array if no violation record payments are found within the specified date range", async () => {
    const startDate = new Date("2023-01-01");
    const endDate = new Date("2023-01-31");

    const result = await violationRecordPaymentRepository.getTotalFineCollectedPerDayByRange({
      startDate,
      endDate
    });

    expect(result).toEqual([]);
  });
});
