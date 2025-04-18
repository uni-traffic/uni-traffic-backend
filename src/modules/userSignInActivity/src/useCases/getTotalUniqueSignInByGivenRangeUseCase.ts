import { BadRequest } from "../../../../shared/core/errors";
import { ProtectedUseCase } from "../../../../shared/domain/useCase";
import type { UseCaseActorInfo } from "../../../../shared/lib/types";
import type { GetTotalViolationGivenByGivenRange } from "../../../violationRecord/src/dtos/violationRecordRequestSchema";
import type {
  GetTotalUniqueSignInByGivenRangeParams,
  TotalUniqueSignInByGivenRange
} from "../dtos/userSignInActivityDTO";
import type { GetTotalUniqueSignInByGivenRange } from "../dtos/userSignInActivityRequestSchema";
import {
  type IUserSignInActivityRepository,
  UserSignInActivityRepository
} from "../repositories/userSignInActivityRepository";

export class GetTotalUniqueSignInByGivenRangeUseCase extends ProtectedUseCase<
  GetTotalUniqueSignInByGivenRange,
  TotalUniqueSignInByGivenRange
> {
  protected _ALLOWED_ACCESS_ROLES: string[] = ["ADMIN", "SUPERADMIN", "CASHIER", "SECURITY"];
  private _userSignInActivityRepository: IUserSignInActivityRepository;

  public constructor(
    userSignInActivityRepository: IUserSignInActivityRepository = new UserSignInActivityRepository()
  ) {
    super();
    this._userSignInActivityRepository = userSignInActivityRepository;
  }

  protected executeImplementation(
    params: GetTotalUniqueSignInByGivenRange & UseCaseActorInfo
  ): Promise<TotalUniqueSignInByGivenRange> {
    this._ensureParamsIsValid(params);

    const refinedParams = this._refineParams(params);

    return this._getTotalUniqueSignInByGivenRange(refinedParams);
  }

  private _ensureParamsIsValid(params: GetTotalUniqueSignInByGivenRange): void {
    const { startDate, endDate } = params;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(startDate.split("T")[0])) {
      throw new BadRequest("Start date must be in YYYY-MM-DD format.");
    }

    if (!dateRegex.test(endDate.split("T")[0])) {
      throw new BadRequest("End date must be in YYYY-MM-DD format.");
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequest("Invalid date range. startDate date cannot be after endDate date.");
    }
  }

  private _refineParams(
    params: GetTotalViolationGivenByGivenRange
  ): GetTotalUniqueSignInByGivenRangeParams {
    const startDate = new Date(params.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(params.endDate);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate, type: params.type };
  }

  private async _getTotalUniqueSignInByGivenRange(
    params: GetTotalUniqueSignInByGivenRangeParams
  ): Promise<TotalUniqueSignInByGivenRange> {
    return this._userSignInActivityRepository.getTotalUniqueSignInByGivenRange(params);
  }
}
