import { faker } from "@faker-js/faker";
import { NotFoundError } from "../../../../shared/core/errors";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { seedViolationRecord } from "../../../violationRecord/tests/utils/violationRecord/seedViolationRecord";
import { AddViolationRecordPaymentUseCase } from "../../src/useCases/addViolationRecordPaymentUseCase";
import { ViolationRecordRepository } from "../../../violationRecord/src/repositories/violationRecordRepository";
import { ViolationRecordPaymentRepository } from "../../src/repositories/addViolationRecordPaymentRepository";
import { ViolationRecordAuditLogService } from "../../../violationRecordAuditLog/src/service/violationRecordAuditLogService";

describe("AddViolationRecordPaymentUseCase", () => {
  let addViolationRecordPaymentUseCase: AddViolationRecordPaymentUseCase;

  beforeAll(() => {
    const violationRecordRepository = new ViolationRecordRepository();
    const violationRecordPaymentRepository = new ViolationRecordPaymentRepository();
    const auditLogService = new ViolationRecordAuditLogService();

    addViolationRecordPaymentUseCase = new AddViolationRecordPaymentUseCase(
      violationRecordRepository,
      violationRecordPaymentRepository,
      auditLogService
    );
  });

  beforeEach(async () => {
    await db.violationRecordPayment.deleteMany();
    await db.violationRecord.deleteMany();
  });

  it("should successfully add a violation record payment and update status", async () => {
    const seededCashier = await seedUser({ role: "CASHIER" });
    const seededViolationRecord = await seedViolationRecord({ status: "UNPAID" });

    const mockRequestData = {
      violationRecordId: seededViolationRecord.id,
      amountPaid: seededViolationRecord.violation.penalty
    };

    const result = await addViolationRecordPaymentUseCase.execute(
      mockRequestData,
      seededCashier.id
    );

    expect(result.isSuccess).toBe(true);
  });

  it("should fail when the violation record does not exist or has an invalid ID", async () => {
    const seededCashier = await seedUser({ role: "CASHIER" });
    const mockRequestData = {
      violationRecordId: faker.string.uuid(),
      amountPaid: 100
    };

    const result = await addViolationRecordPaymentUseCase.execute(
      mockRequestData,
      seededCashier.id
    );
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Violation record not found.");
  });

  it("should fail when the amountPaid is less than the penalty", async () => {
    const seededCashier = await seedUser({ role: "CASHIER" });
    const seededViolationRecord = await seedViolationRecord({
      status: "UNPAID",
      violation: {
        id: faker.string.uuid(),
        category: "A",
        violationName: "Illegal Parking",
        penalty: 500
      }
    });

    const mockRequestData = {
      violationRecordId: seededViolationRecord.id,
      amountPaid: 400
    };

    const result = await addViolationRecordPaymentUseCase.execute(
      mockRequestData,
      seededCashier.id
    );
    expect(result.isFailure).toBe(true);
    expect(result.getErrorMessage()).toBe("Amount paid is less than the required penalty.");
  });

  it("should create an audit log with correct details after payment", async () => {
    const seededCashier = await seedUser({ role: "CASHIER" });
    const seededViolationRecord = await seedViolationRecord({ status: "UNPAID" });

    const mockRequestData = {
      violationRecordId: seededViolationRecord.id,
      amountPaid: seededViolationRecord.violation.penalty
    };

    const result = await addViolationRecordPaymentUseCase.execute(
      mockRequestData,
      seededCashier.id
    );
    expect(result.isSuccess).toBe(true);

    const auditLog = await db.violationRecordAuditLog.findFirst({
      where: { violationRecordId: seededViolationRecord.id },
      orderBy: { createdAt: "desc" }
    });

    expect(auditLog).toBeDefined();
    expect(auditLog?.details).toContain(`Violation record payment status updated.`);
    expect(auditLog?.details).toContain(`Payment ID:`);
    expect(auditLog?.details).toContain(
      `Status changed from UNPAID to PAID by cashier ID: ${seededCashier.id}.`
    );
  });
});
