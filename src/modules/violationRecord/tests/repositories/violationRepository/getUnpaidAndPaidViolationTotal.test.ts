import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import {
  type IViolationRecordRepository,
  ViolationRecordRepository
} from "../../../src/repositories/violationRecordRepository";
import { seedViolationRecord } from "../../utils/violationRecord/seedViolationRecord";

describe("ViolationRecordRepository.getUnpaidAndPaidViolation", () => {
  let repository: IViolationRecordRepository;

  beforeAll(() => {
    repository = new ViolationRecordRepository();
  });

  beforeEach(async () => {
    await db.user.deleteMany();
    await db.violation.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully return the correct sum", async () => {
    const unpaidPenalty = faker.helpers.arrayElement<number>([250, 500, 1000]);
    const paidPenalty = faker.helpers.arrayElement<number>([250, 500, 1000]);

    await Promise.all([
      seedViolationRecord({ status: "PAID", penalty: paidPenalty }),
      seedViolationRecord({ status: "UNPAID", penalty: unpaidPenalty }),
      seedViolationRecord({ status: "PAID", penalty: paidPenalty }),
      seedViolationRecord({ status: "UNPAID", penalty: unpaidPenalty }),
      seedViolationRecord({ status: "PAID", penalty: paidPenalty }),
      seedViolationRecord({ status: "UNPAID", penalty: unpaidPenalty })
    ]);

    const result = await repository.getUnpaidAndPaidViolationTotal();

    expect(result.paidTotal).toBe(paidPenalty * 3);
    expect(result.unpaidTotal).toBe(unpaidPenalty * 3);
  });

  it("should work return 0 values when no violation record found", async () => {
    const result = await repository.getUnpaidAndPaidViolationTotal();

    expect(result.paidTotal).toBe(0);
    expect(result.unpaidTotal).toBe(0);
  });
});
