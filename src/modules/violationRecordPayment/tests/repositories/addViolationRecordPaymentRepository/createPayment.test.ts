import { db } from "../../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../../user/tests/utils/user/seedUser";
import { seedViolationRecord } from "../../../../violationRecord/tests/utils/violationRecord/seedViolationRecord";
import { ViolationRecordPaymentRepository } from "../../../src/repositories/violationRecordPaymentRepository";
import { createViolationRecordPaymentDomainObject } from "../../utils/violationRecordPayment/createViolationRecordPaymentDomainObject";

describe("ViolationRecordPaymentRepository.createPayment", () => {
  let violationRecordPaymentRepository: ViolationRecordPaymentRepository;

  beforeAll(() => {
    violationRecordPaymentRepository = new ViolationRecordPaymentRepository();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should successfully create a violation record payment", async () => {
    const seededCashier = await seedUser({ role: "CASHIER" });
    const seededViolationRecord = await seedViolationRecord({ status: "UNPAID" });
    const createdPayment = createViolationRecordPaymentDomainObject({
      violationRecordId: seededViolationRecord.id,
      amountPaid: 500,
      cashierId: seededCashier.id
    });

    const savedPayment = await violationRecordPaymentRepository.createPayment(createdPayment);

    expect(savedPayment).not.toBeNull();
    expect(savedPayment?.amountPaid).toBe(500);
  });

  it("should fail to create a violation record payment when given references don’t exist", async () => {
    const createdPayment = createViolationRecordPaymentDomainObject({
      violationRecordId: "non-existent-id",
      amountPaid: 500,
      cashierId: "non-existent-id"
    });

    const savedPayment = await violationRecordPaymentRepository.createPayment(createdPayment);

    expect(savedPayment).toBeNull();
  });
});
