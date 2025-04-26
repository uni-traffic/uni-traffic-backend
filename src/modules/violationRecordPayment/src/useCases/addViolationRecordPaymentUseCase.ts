import { BadRequest, NotFoundError } from "../../../../shared/core/errors";
import type { IViolationRecord } from "../../../violationRecord/src/domain/models/violationRecord/classes/violationRecord";
import { ViolationRecordStatus } from "../../../violationRecord/src/domain/models/violationRecord/classes/violationRecordStatus";
import {
  type IViolationRecordRepository,
  ViolationRecordRepository
} from "../../../violationRecord/src/repositories/violationRecordRepository";
import type { IViolationRecordPayment } from "../domain/models/violationRecordPayment/classes/violationRecordPayment";
import { ViolationRecordPaymentFactory } from "../domain/models/violationRecordPayment/factory";
import { ViolationRecordPaymentMapper } from "../domain/models/violationRecordPayment/mapper";
import type { IViolationRecordPaymentDTO } from "../dtos/violationRecordPaymentDTO";
import type { ViolationRecordPaymentRequest } from "../dtos/violationRecordPaymentRequestSchema";
import {
  type IViolationRecordPaymentRepository,
  ViolationRecordPaymentRepository
} from "../repositories/violationRecordPaymentRepository";

export class AddViolationRecordPaymentUseCase {
  private _violationRecordRepository: IViolationRecordRepository;
  private _violationRecordPaymentRepository: IViolationRecordPaymentRepository;
  private _violationRecordPaymentMapper: ViolationRecordPaymentMapper;

  public constructor(
    violationRecordRepository: IViolationRecordRepository = new ViolationRecordRepository(),
    violationRecordPaymentRepository: IViolationRecordPaymentRepository = new ViolationRecordPaymentRepository(),
    violationRecordPaymentMapper: ViolationRecordPaymentMapper = new ViolationRecordPaymentMapper()
  ) {
    this._violationRecordRepository = violationRecordRepository;
    this._violationRecordPaymentRepository = violationRecordPaymentRepository;
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

    const updatedViolationRecord = await this.updateViolationRecordStatus(violationRecord);
    if (!updatedViolationRecord) {
      throw new BadRequest("Failed to update violation record status.");
    }

    return this._violationRecordPaymentMapper.toDTO(newPayment);
  }

  private async getViolationRecordOrThrow(violationRecordId: string): Promise<IViolationRecord> {
    const violationRecords =
      await this._violationRecordRepository.getViolationRecordById(violationRecordId);

    if (!violationRecords) {
      throw new NotFoundError("Violation record not found.");
    }

    return violationRecords;
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

  /** TODO: Apply the new audit log
   * private async createAuditLog(
   *     cashierId: string,
   *     violationRecordId: string,
   *     oldStatus: string,
   *     newStatus: string,
   *     paymentId: string
   *   ) {
   *     const message = `Violation record payment status updated. Payment ID: ${paymentId}, Status changed from ${oldStatus} to ${newStatus} by cashier ID: ${cashierId}.`;
   *
   *     const auditLogResult = await this._auditLogService.createAndSaveViolationRecordAuditLog({
   *       actorId: cashierId,
   *       violationRecordId,
   *       auditLogType: "UPDATE",
   *       details: message
   *     });
   *
   *     if (!auditLogResult) {
   *       throw new UnexpectedError("Failed to create audit log.");
   *     }
   *   }
   */
}
