import { BadRequest } from "../../../../shared/core/errors";
import type { GetViolationsGivenPerDayByRangeParams } from "../../../violationRecord/src/dtos/violationRecordDTO";
import type { GetUserSignInActivityByRange } from "../dtos/userSignInActivityDTO";
import type { UserSignInActivityByRangeRequest } from "../dtos/userSignInActivityRequestSchema";
import {
  type IUserSignInActivityRepository,
  UserSignInActivityRepository
} from "../repositories/userSignInActivityRepository";

export class CountUserSignInActivityByRangeUseCase {
  private _userSignInRepository: IUserSignInActivityRepository;

  public constructor(
    userSignInRepository: IUserSignInActivityRepository = new UserSignInActivityRepository()
  ) {
    this._userSignInRepository = userSignInRepository;
  }

  public async execute(params: { startDate: string; endDate: string }): Promise<{ count: number }> {
    this._ensureParamsIsValid(params);

    const refinedParams = this._refineParams(params);
    const uniqueSignIn = await this._countUserSignInActivityByRange(refinedParams);

    return { count: uniqueSignIn };
  }

  private _refineParams(
    params: UserSignInActivityByRangeRequest
  ): GetViolationsGivenPerDayByRangeParams {
    const startDate = new Date(params.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(params.endDate);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }

  private _ensureParamsIsValid(params: UserSignInActivityByRangeRequest): void {
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

  private _countUserSignInActivityByRange(params: GetUserSignInActivityByRange): Promise<number> {
    return this._userSignInRepository.countUserSignInActivityByRange(params);
  }
}
