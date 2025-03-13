import { IViolationRecordRepository } from "../../../violationRecord/src/repositories/violationRecordRepository";
import { IViolationRecordPaymentRepository } from "../../src/repositories/addViolationRecordPaymentRepository";
import { ViolationRecordPaymentFactory } from "../../src/domain/models/violationRecordPayment/factory";
import { ViolationRecordStatus } from "../../../violationRecord/src/domain/models/violationRecord/classes/violationRecordStatus";
import { ViolationRecordAuditLogService } from "../../../violationRecordAuditLog/src/service/violationRecordAuditLogService";
import { Result } from "../../../../shared/core/result";
import { ViolationRecordPaymentRequest } from "../../src/dtos/violationRecordPaymentRequestSchema";

export class AddViolationRecordPaymentUseCase {
  private _violationRecordRepository: IViolationRecordRepository;
  private _violationRecordPaymentRepository: IViolationRecordPaymentRepository;
  private _auditLogService: ViolationRecordAuditLogService;

  public constructor(
    violationRecordRepository: IViolationRecordRepository,
    violationRecordPaymentRepository: IViolationRecordPaymentRepository,
    auditLogService: ViolationRecordAuditLogService
  ) {
    this._violationRecordRepository = violationRecordRepository;
    this._violationRecordPaymentRepository = violationRecordPaymentRepository;
    this._auditLogService = auditLogService;
  }

  public async execute(
    request: ViolationRecordPaymentRequest,
    cashierId: string
  ): Promise<Result<void>> {
    const violationRecords = await this._violationRecordRepository.getViolationRecordByProperty({
      id: request.violationRecordId
    });

    if (!violationRecords.length) {
      return Result.fail("Violation record not found.");
    }

    const violationRecord = violationRecords[0];

    if (violationRecord.status.value === "PAID") {
      return Result.fail("Violation record is already paid.");
    }

    if (!violationRecord.violation) {
      return Result.fail("Violation details not found for this record.");
    }

    if (request.amountPaid < violationRecord.violation.penalty) {
      return Result.fail("Amount paid is less than the required penalty.");
    }

    const updatedStatusResult = ViolationRecordStatus.create("PAID");
    if (updatedStatusResult.isFailure) {
      return Result.fail(
        updatedStatusResult.getErrorMessage() || "Failed to update violation record status."
      );
    }

    const updatedStatus = updatedStatusResult.getValue();
    await this._violationRecordRepository.updateViolationRecordStatus(
      violationRecord.id,
      updatedStatus
    );

    const paymentResult = ViolationRecordPaymentFactory.create({
      violationRecordId: violationRecord.id,
      amountPaid: request.amountPaid,
      cashierId
    });

    if (paymentResult.isFailure) {
      return Result.fail(paymentResult.getErrorMessage() || "Failed to create payment record.");
    }

    const payment = paymentResult.getValue();
    const newPayment = await this._violationRecordPaymentRepository.createPayment(payment);

    if (!newPayment) {
      return Result.fail("Failed to process payment.");
    }

    const oldStatus = violationRecord.status.value;

    const message = `Violation record payment status updated. Payment ID: ${newPayment.id}, Status changed from ${oldStatus} to PAID by cashier ID: ${cashierId}.`;

    await this._auditLogService.createAndSaveViolationRecordAuditLog({
      actorId: cashierId,
      violationRecordId: violationRecord.id,
      auditLogType: "UPDATE",
      details: message
    });

    return Result.ok();
  }
}
