import {
  ViolationRecordRepository,
  type IViolationRecordRepository
} from "../../../violationRecord/src/repositories/violationRecordRepository";
import {
  ViolationRecordPaymentRepository,
  type IViolationRecordPaymentRepository
} from "../../src/repositories/addViolationRecordPaymentRepository";
import { ViolationRecordPaymentFactory } from "../../src/domain/models/violationRecordPayment/factory";
import { ViolationRecordStatus } from "../../../violationRecord/src/domain/models/violationRecord/classes/violationRecordStatus";
import { ViolationRecordAuditLogService } from "../../../violationRecordAuditLog/src/service/violationRecordAuditLogService";
import { Result } from "../../../../shared/core/result";
import type { ViolationRecordPaymentRequest } from "../../src/dtos/violationRecordPaymentRequestSchema";
import { NotFoundError, BadRequest } from "../../../../shared/core/errors";
import type { IViolationRecordPaymentDTO } from "../../src/dtos/violationRecordPaymentDTO";
import { ViolationRecord } from "../../../violationRecord/src/domain/models/violationRecord/classes/violationRecord";
import type { IViolationRecordPayment } from "../domain/models/violationRecordPayment/classes/violationRecordPayment";
import { ViolationRecordPaymentMapper } from "../domain/models/violationRecordPayment/mapper";

export class AddViolationRecordPaymentUseCase {
  private _violationRecordRepository: IViolationRecordRepository;
  private _violationRecordPaymentRepository: IViolationRecordPaymentRepository;
  private _auditLogService: ViolationRecordAuditLogService;

  public constructor(
    violationRecordRepository: IViolationRecordRepository = new ViolationRecordRepository(),
    violationRecordPaymentRepository: IViolationRecordPaymentRepository = new ViolationRecordPaymentRepository(),
    auditLogService: ViolationRecordAuditLogService = new ViolationRecordAuditLogService()
  ) {
    this._violationRecordRepository = violationRecordRepository;
    this._violationRecordPaymentRepository = violationRecordPaymentRepository;
    this._auditLogService = auditLogService;
  }

  public async execute(
    request: ViolationRecordPaymentRequest,
    cashierId: string
  ): Promise<Result<IViolationRecordPaymentDTO>> {
    const violationRecord = await this.getViolationRecordOrThrow(request.violationRecordId);

    this.validateAmountPaid(request.amountPaid, violationRecord.violation!.penalty);
    this.checkViolationRecordIsPaid(violationRecord);

    const oldStatus = violationRecord.status.value;

    this.updateViolationRecordStatus(violationRecord);
    await this._violationRecordRepository.updateViolationRecord(violationRecord);

    const payment = this.createPayment(request, cashierId);

    const newPayment = await this.savePayment(payment);

    await this.createAuditLog(cashierId, violationRecord.id, oldStatus, "PAID", newPayment.id);

    const mapper = new ViolationRecordPaymentMapper();
    return Result.ok(mapper.toDTO(newPayment));
  }

  private async getViolationRecordOrThrow(violationRecordId: string): Promise<ViolationRecord> {
    const violationRecords = await this._violationRecordRepository.getViolationRecordByProperty({
      id: violationRecordId
    });

    if (!violationRecords.length) {
      throw new NotFoundError("Violation record not found.");
    }

    const violationRecordData = violationRecords[0];

    return ViolationRecord.create(violationRecordData);
  }

  private checkViolationRecordIsPaid(violationRecord: ViolationRecord): void {
    if (violationRecord.status.value === "PAID") {
      throw new BadRequest("Violation record is already paid.");
    }
  }

  private validateAmountPaid(amountPaid: number, penalty: number): void {
    if (amountPaid < penalty) {
      throw new BadRequest("Amount paid is less than the required penalty.");
    }
  }

  private updateViolationRecordStatus(violationRecord: ViolationRecord): void {
    const updatedStatusResult = ViolationRecordStatus.create("PAID");
    if (updatedStatusResult.isFailure) {
      throw new BadRequest("Failed to update violation record status.");
    }

    violationRecord.updateStatus(updatedStatusResult.getValue());
  }

  private createPayment(request: ViolationRecordPaymentRequest, cashierId: string) {
    const paymentResult = ViolationRecordPaymentFactory.create({
      violationRecordId: request.violationRecordId,
      amountPaid: request.amountPaid,
      cashierId
    });

    if (paymentResult.isFailure) {
      throw new BadRequest("Failed to create payment record.");
    }

    return paymentResult.getValue();
  }

  private async savePayment(payment: IViolationRecordPayment): Promise<IViolationRecordPayment> {
    const savedPayment = await this._violationRecordPaymentRepository.createPayment(payment);

    if (!savedPayment) {
      throw new BadRequest("Failed to process payment.");
    }

    return savedPayment;
  }

  private async createAuditLog(
    cashierId: string,
    violationRecordId: string,
    oldStatus: string,
    newStatus: string,
    paymentId: string
  ) {
    const message = `Violation record payment status updated. Payment ID: ${paymentId}, Status changed from ${oldStatus} to ${newStatus} by cashier ID: ${cashierId}.`;

    const auditLogResult = await this._auditLogService.createAndSaveViolationRecordAuditLog({
      actorId: cashierId,
      violationRecordId,
      auditLogType: "UPDATE",
      details: message
    });

    if (!auditLogResult) {
      throw new BadRequest("Failed to create audit log.");
    }
  }
}
