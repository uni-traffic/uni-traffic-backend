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
import type { ViolationRecordPaymentRequest } from "../../src/dtos/violationRecordPaymentRequestSchema";
import { NotFoundError, BadRequest, UnexpectedError } from "../../../../shared/core/errors";
import type { IViolationRecordPaymentDTO } from "../../src/dtos/violationRecordPaymentDTO";
import type { IViolationRecord } from "../../../violationRecord/src/domain/models/violationRecord/classes/violationRecord";
import type { IViolationRecordPayment } from "../domain/models/violationRecordPayment/classes/violationRecordPayment";
import { ViolationRecordPaymentMapper } from "../domain/models/violationRecordPayment/mapper";

export class AddViolationRecordPaymentUseCase {
  private _violationRecordRepository: IViolationRecordRepository;
  private _violationRecordPaymentRepository: IViolationRecordPaymentRepository;
  private _auditLogService: ViolationRecordAuditLogService;
  private _violationRecordPaymentMapper: ViolationRecordPaymentMapper;

  public constructor(
    violationRecordRepository: IViolationRecordRepository = new ViolationRecordRepository(),
    violationRecordPaymentRepository: IViolationRecordPaymentRepository = new ViolationRecordPaymentRepository(),
    auditLogService: ViolationRecordAuditLogService = new ViolationRecordAuditLogService(),
    violationRecordPaymentMapper: ViolationRecordPaymentMapper = new ViolationRecordPaymentMapper()
  ) {
    this._violationRecordRepository = violationRecordRepository;
    this._violationRecordPaymentRepository = violationRecordPaymentRepository;
    this._auditLogService = auditLogService;
    this._violationRecordPaymentMapper = violationRecordPaymentMapper;
  }

  public async execute(
    request: ViolationRecordPaymentRequest,
    cashierId: string
  ): Promise<IViolationRecordPaymentDTO> {
    const violationRecord = await this.getViolationRecordOrThrow(request.violationRecordId);

    this.validateAmountPaid(request.amountPaid, violationRecord.violation!.penalty);
    this.checkViolationRecordIsPaid(violationRecord);

    const payment = this.createPayment(request, cashierId);
    const newPayment = await this.savePayment(payment);

    const oldStatus = violationRecord.status.value;
    const updatedViolationRecord = await this.updateViolationRecordStatus(violationRecord);

    if (!updatedViolationRecord) {
      throw new BadRequest("Failed to update violation record status.");
    }

    await this.createAuditLog(cashierId, violationRecord.id, oldStatus, "PAID", newPayment.id);

    return this._violationRecordPaymentMapper.toDTO(newPayment);
  }

  private async getViolationRecordOrThrow(violationRecordId: string): Promise<IViolationRecord> {
    const violationRecords = await this._violationRecordRepository.getViolationRecordByProperty({
      id: violationRecordId
    });

    if (!violationRecords.length) {
      throw new NotFoundError("Violation record not found.");
    }

    return violationRecords[0];
  }

  private checkViolationRecordIsPaid(violationRecord: IViolationRecord): void {
    if (violationRecord.status.value === "PAID") {
      throw new BadRequest("Violation record is already paid.");
    }
  }

  private validateAmountPaid(amountPaid: number, penalty: number): void {
    if (amountPaid < penalty) {
      throw new BadRequest("Amount paid is less than the required penalty.");
    }
  }

  private async updateViolationRecordStatus(
    violationRecord: IViolationRecord
  ): Promise<IViolationRecord> {
    const updatedStatusResult = ViolationRecordStatus.create("PAID");
    if (updatedStatusResult.isFailure) {
      throw new BadRequest("Failed to update violation record status.");
    }

    violationRecord.updateStatus(updatedStatusResult.getValue());
    const updatedRecord =
      await this._violationRecordRepository.updateViolationRecord(violationRecord);

    if (!updatedRecord) {
      throw new BadRequest("Failed to update violation record.");
    }

    return updatedRecord;
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
      throw new UnexpectedError("Failed to create audit log.");
    }
  }
}
