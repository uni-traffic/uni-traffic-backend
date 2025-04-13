import { BadRequest, NotFoundError } from "../../../../shared/core/errors";
import type {
  GetTotalFineCollectedPerDayByRangeUseCasePayload,
  GetViolationRecordPaymentAmountAndTimePaid
} from "../dtos/violationRecordPaymentDTO";
import type { ViolationRecordPaymentGetByRangeRequest } from "../dtos/violationRecordPaymentRequestSchema";
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
    params: ViolationRecordPaymentGetByRangeRequest
  ): Promise<GetViolationRecordPaymentAmountAndTimePaid[]> {
    this._ensureDatesAreCorrect(params);

    const refinedParams = this._refineParams(params);
    const paymentDetails = await this._getViolationRecordPaymentDetails(refinedParams);

    return this._sumByDay(paymentDetails);
  }

  private _ensureDatesAreCorrect(params: ViolationRecordPaymentGetByRangeRequest): void {
    const { startDate, endDate } = params;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(startDate)) {
      throw new BadRequest("Start date must be in YYYY-MM-DD format.");
    }

    if (!dateRegex.test(endDate)) {
      throw new BadRequest("End date must be in YYYY-MM-DD format.");
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequest("Invalid date range. startDate date cannot be after endDate date.");
    }
  }

  private _refineParams(
    params: ViolationRecordPaymentGetByRangeRequest
  ): GetTotalFineCollectedPerDayByRangeUseCasePayload {
    const startDate = new Date(params.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(params.endDate);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }

  private async _getViolationRecordPaymentDetails(
    params: GetTotalFineCollectedPerDayByRangeUseCasePayload
  ): Promise<GetViolationRecordPaymentAmountAndTimePaid[]> {
    const violationRecordPaymentRaw =
      await this._violationRecordPaymentRepository.getTotalFineCollectedPerDayByRange(params);
    if (!violationRecordPaymentRaw || violationRecordPaymentRaw.length === 0) {
      throw new NotFoundError("No Violation Record Payments found");
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
