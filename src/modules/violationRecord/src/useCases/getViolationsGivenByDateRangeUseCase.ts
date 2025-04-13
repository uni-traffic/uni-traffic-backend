import { BadRequest, NotFoundError } from "../../../../shared/core/errors";
import type { ViolationRecordPaymentGetByRangeRequest } from "../../../violationRecordPayment/src/dtos/violationRecordPaymentRequestSchema";
import type { GetViolationsGivenPerDayByRangeParams } from "../dtos/violationRecordDTO";
import type { ViolationsGivenPerDayByRange } from "../dtos/violationRecordRequestSchema";
import type { IViolationRecordRepository } from "../repositories/violationRecordRepository";
import { ViolationRecordRepository } from "../repositories/violationRecordRepository";

export class GetViolationsGivenByDateRange {
  private _violationRecordRepository: IViolationRecordRepository;

  public constructor(
    violationRecordRepository: IViolationRecordRepository = new ViolationRecordRepository()
  ) {
    this._violationRecordRepository = violationRecordRepository;
  }

  public async execute(
    params: ViolationsGivenPerDayByRange
  ): Promise<{ date: Date; violationsIssued: number }[]> {
    this._ensureParamsIsValid(params);

    const refinedParams = this._refineParams(params);
    const foundViolationRecord = await this._getViolationsGivenPerDayByRange(refinedParams);

    return this._aggregateViolationsByDay(foundViolationRecord);
  }

  private _ensureParamsIsValid(params: ViolationsGivenPerDayByRange): void {
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
  ): GetViolationsGivenPerDayByRangeParams {
    const startDate = new Date(params.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(params.endDate);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }

  private async _getViolationsGivenPerDayByRange(params: GetViolationsGivenPerDayByRangeParams) {
    const violationRecords =
      await this._violationRecordRepository.getViolationRecordGivenByRange(params);
    if (!violationRecords) {
      throw new NotFoundError("No Violation Record Found");
    }

    return violationRecords;
  }

  private _aggregateViolationsByDay(
    data: { createdAt: Date; id: string }[]
  ): { date: Date; violationsIssued: number }[] {
    const map: Map<string, number> = new Map();

    for (const { createdAt } of data) {
      const dateKey = createdAt.toISOString().split("T")[0];

      if (map.has(dateKey)) {
        map.set(dateKey, map.get(dateKey)! + 1);
      } else {
        map.set(dateKey, 1);
      }
    }

    const result: { date: Date; violationsIssued: number }[] = [];
    map.forEach((count, dateKey) => {
      result.push({ date: new Date(dateKey), violationsIssued: count });
    });

    return result;
  }
}
