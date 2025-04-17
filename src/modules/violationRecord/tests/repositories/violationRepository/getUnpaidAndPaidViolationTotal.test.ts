import { faker } from "@faker-js/faker";
import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedViolation } from "../../../../violation/tests/utils/violation/seedViolation";
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
    const seededUnpaidViolation = await seedViolation({
      penalty: faker.helpers.arrayElement<number>([250, 500, 1000])
    });
    const seededPaidViolation = await seedViolation({
      penalty: faker.helpers.arrayElement<number>([250, 500, 1000])
    });

    await Promise.all([
      seedViolationRecord({ status: "PAID", violationId: seededPaidViolation.id }),
      seedViolationRecord({ status: "UNPAID", violationId: seededUnpaidViolation.id }),
      seedViolationRecord({ status: "PAID", violationId: seededPaidViolation.id }),
      seedViolationRecord({ status: "UNPAID", violationId: seededUnpaidViolation.id }),
      seedViolationRecord({ status: "PAID", violationId: seededPaidViolation.id }),
      seedViolationRecord({ status: "UNPAID", violationId: seededUnpaidViolation.id })
    ]);

    const result = await repository.getUnpaidAndPaidViolationTotal();

    expect(result.paidTotal).toBe(seededPaidViolation.penalty * 3);
    expect(result.unpaidTotal).toBe(seededUnpaidViolation.penalty * 3);
  });

  it("should work return 0 values when no violation record found", async () => {
    const result = await repository.getUnpaidAndPaidViolationTotal();

    expect(result.paidTotal).toBe(0);
    expect(result.unpaidTotal).toBe(0);
  });
});
