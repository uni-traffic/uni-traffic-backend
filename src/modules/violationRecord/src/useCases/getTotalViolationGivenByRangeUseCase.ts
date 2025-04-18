import { BadRequest } from "../../../../shared/core/errors";
import { ProtectedUseCase } from "../../../../shared/domain/useCase";
import type { UseCaseActorInfo } from "../../../../shared/lib/types";
import type {
  GetTotalViolationGivenByRangeParams,
  ViolationGivenByRange
} from "../dtos/violationRecordDTO";
import type { GetTotalViolationGivenByGivenRange } from "../dtos/violationRecordRequestSchema";
import {
  type IViolationRecordRepository,
  ViolationRecordRepository
} from "../repositories/violationRecordRepository";

export class GetTotalViolationGivenByRangeUseCase extends ProtectedUseCase<
  GetTotalViolationGivenByGivenRange,
  ViolationGivenByRange
> {
  protected _ALLOWED_ACCESS_ROLES: string[] = ["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"];
  private _violationRecordRepository: IViolationRecordRepository;

  public constructor(
    violationRecordRepository: IViolationRecordRepository = new ViolationRecordRepository()
  ) {
    super();
    this._violationRecordRepository = violationRecordRepository;
  }

  protected executeImplementation(
    params: GetTotalViolationGivenByGivenRange & UseCaseActorInfo
  ): Promise<ViolationGivenByRange> {
    this._ensureParamsIsValid(params);

    const refinedParams = this._refineParams(params);

    return this._getTotalViolationGivenByRange(refinedParams);
  }

  private _ensureParamsIsValid(params: GetTotalViolationGivenByGivenRange): void {
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
    params: GetTotalViolationGivenByGivenRange
  ): GetTotalViolationGivenByRangeParams {
    const startDate = new Date(params.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(params.endDate);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate, type: params.type };
  }

  private async _getTotalViolationGivenByRange(
    params: GetTotalViolationGivenByRangeParams
  ): Promise<ViolationGivenByRange> {
    return this._violationRecordRepository.getTotalViolationGivenByRange(params);
  }
}
