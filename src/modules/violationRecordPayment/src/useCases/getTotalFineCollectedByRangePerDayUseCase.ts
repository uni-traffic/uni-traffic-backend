import { NotFoundError } from "../../../../shared/core/errors";
import type {
  GetTotalFineCollectedPerDayByRangeUseCasePayload,
  GetViolationRecordPaymentAmountAndTimePaid
} from "../dtos/violationRecordPaymentDTO";
import {
  type IViolationRecordPaymentRepository,
  ViolationRecordPaymentRepository
} from "../repositories/violationRecordPaymentRepository";

export class GetTotalFineCollectedPerDayByRangeUseCase {
  private _violationRecordPaymentRepository: IViolationRecordPaymentRepository;

  public constructor(
    violationRecordPaymentRepository: IViolationRecordPaymentRepository = new ViolationRecordPaymentRepository()
  ) {
    this._violationRecordPaymentRepository = violationRecordPaymentRepository;
  }

  public async execute(
    params: GetTotalFineCollectedPerDayByRangeUseCasePayload
  ): Promise<GetViolationRecordPaymentAmountAndTimePaid[]> {
    const paymentDetails = await this._getViolationRecordPaymentDetails(params);
    const result = this._sumByDay(paymentDetails);

    return result;
  }

  private async _getViolationRecordPaymentDetails(
    params: GetTotalFineCollectedPerDayByRangeUseCasePayload
  ): Promise<GetViolationRecordPaymentAmountAndTimePaid[]> {
    const violationRecordPaymentRaw =
      await this._violationRecordPaymentRepository.getTotalFineCollectedPerDayByRange(params);
    if (!violationRecordPaymentRaw || violationRecordPaymentRaw.length === 0) {
      throw new NotFoundError("Violation Record Payments not found");
    }

    return violationRecordPaymentRaw;
  }

  private _sumByDay(
    params: GetViolationRecordPaymentAmountAndTimePaid[]
  ): GetViolationRecordPaymentAmountAndTimePaid[] {
    const sumByDay = params.reduce(
      (acc, payment) => {
        const date = payment.timePaid.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + payment.amountPaid;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.keys(sumByDay).map((date) => ({
      timePaid: new Date(date),
      amountPaid: sumByDay[date]
    }));
  }
}
