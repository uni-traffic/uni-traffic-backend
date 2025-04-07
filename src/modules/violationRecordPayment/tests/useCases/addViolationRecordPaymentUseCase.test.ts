import { faker } from "@faker-js/faker";
import { db } from "../../../../shared/infrastructure/database/prisma";
import { seedUser } from "../../../user/tests/utils/user/seedUser";
import { seedViolation } from "../../../violation/tests/utils/violation/seedViolation";
import { seedViolationRecord } from "../../../violationRecord/tests/utils/violationRecord/seedViolationRecord";
import { AddViolationRecordPaymentUseCase } from "../../src/useCases/addViolationRecordPaymentUseCase";

describe("AddViolationRecordPaymentUseCase", () => {
  let addViolationRecordPaymentUseCase: AddViolationRecordPaymentUseCase;

  beforeAll(() => {
    addViolationRecordPaymentUseCase = new AddViolationRecordPaymentUseCase();
  });

  beforeEach(async () => {
    await db.violationRecordPayment.deleteMany();
    await db.violationRecord.deleteMany();
  });

  it("should successfully add a violation record payment and update status", async () => {
    const seededCashier = await seedUser({ role: "CASHIER" });
    const seededViolationRecord = await seedViolationRecord({ status: "UNPAID" });

    expect(seededViolationRecord.violation).toBeDefined();
    expect(seededViolationRecord.violation?.penalty).toBeGreaterThan(0);

    const mockRequestData = {
      violationRecordId: seededViolationRecord.id,
      amountPaid: seededViolationRecord.violation.penalty
    };

    const result = await addViolationRecordPaymentUseCase.execute(
      mockRequestData,
      seededCashier.id
    );

    expect(result).toBeDefined();
    expect(result.violationRecordId).toBe(mockRequestData.violationRecordId);

    const updatedRecord = await db.violationRecord.findUnique({
      where: { id: seededViolationRecord.id }
    });

    expect(updatedRecord).toBeDefined();
    expect(updatedRecord?.status).toBe("PAID");
  });

  it("should fail when the violation record does not exist or has an invalid ID", async () => {
    const seededCashier = await seedUser({ role: "CASHIER" });

    const invalidViolationRecordId = faker.string.uuid();

    const mockRequestData = {
      violationRecordId: invalidViolationRecordId,
      amountPaid: 100
    };

    await expect(
      addViolationRecordPaymentUseCase.execute(mockRequestData, seededCashier.id)
    ).rejects.toThrowError("Violation record not found.");
  });

  it("should fail when the amountPaid is less than the penalty", async () => {
    const seededCashier = await seedUser({ role: "CASHIER" });

    const seededViolation = await seedViolation({
      category: "A",
      violationName: "Illegal Parking",
      penalty: 500
    });

    const seededViolationRecord = await seedViolationRecord({
      status: "UNPAID",
      violationId: seededViolation.id
    });

    const mockRequestData = {
      violationRecordId: seededViolationRecord.id,
      amountPaid: 400
    };

    await expect(
      addViolationRecordPaymentUseCase.execute(mockRequestData, seededCashier.id)
    ).rejects.toThrowError("Amount paid is less than the required penalty.");
  });
});
