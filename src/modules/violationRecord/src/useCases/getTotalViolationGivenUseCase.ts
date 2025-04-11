import { BadRequest } from "../../../../shared/core/errors";
import type { IViolationRecordRepository } from "../repositories/violationRecordRepository";
import { ViolationRecordRepository } from "../repositories/violationRecordRepository";

interface RequestParams {
  start: Date;
  end: Date;
}

export class GetTotalViolationGiven {
  private _violationRecordRepository: IViolationRecordRepository;

  public constructor(
    violationRecordRepository: IViolationRecordRepository = new ViolationRecordRepository()
  ) {
    this._violationRecordRepository = violationRecordRepository;
  }

  public async execute(payload: RequestParams): Promise<{ date: Date; violationsIssued: number }[]> {
    this._ensurePayloadIsValid(payload);

    return await this._violationRecordRepository.getTotalViolationGiven(payload.start, payload.end);
  }

  private _ensurePayloadIsValid(payload: RequestParams): void {
    const { start, end } = payload;

    if (!start || !end) {
      throw new BadRequest("Start date and end date are required.");
    }

    if (isNaN(new Date(start).getTime()) || isNaN(new Date(end).getTime())) {
      throw new BadRequest("Invalid start or end date.");
    }

    if (new Date(start).getTime() > new Date(end).getTime()) {
      throw new BadRequest("Invalid date range. Start date cannot be after end date.");
    }
  }

}
