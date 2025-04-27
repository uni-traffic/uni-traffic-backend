import { NotFoundError } from "../../../../shared/core/errors";
import type { IViolation } from "../domain/models/violation/classes/violation";
import { type IViolationMapper, ViolationMapper } from "../domain/models/violation/mapper";
import type { GetViolation, GetViolationResponse } from "../dtos/violationDTO";
import type { GetViolationRequest } from "../dtos/violationRequestSchema";
import {
  type IViolationRepository,
  ViolationRepository
} from "../repositories/violationRepository";

export class GetViolationUseCase {
  private _violationRepository: IViolationRepository;
  private _violationMapper: IViolationMapper;

  public constructor(
    violationRepository: IViolationRepository = new ViolationRepository(),
    violationMapper: IViolationMapper = new ViolationMapper()
  ) {
    this._violationRepository = violationRepository;
    this._violationMapper = violationMapper;
  }

  public async execute(payload: GetViolationRequest): Promise<GetViolationResponse> {
    const refinedParams = this._refineParams(payload);
    const violations = await this._getViolations(refinedParams);
    const totalViolationCount = await this._getTotalCount(refinedParams);
    const totalPages = this._getTotalPages(refinedParams.count, totalViolationCount);
    const hasNextPage = this._hasNextPage(
      refinedParams.count,
      refinedParams.page,
      totalViolationCount
    );

    return {
      violation: violations.map((violation) => this._violationMapper.toDTO(violation)),
      hasNextPage,
      hasPreviousPage: refinedParams.page > 1,
      totalPages
    };
  }

  private _refineParams(params: GetViolationRequest): GetViolation {
    let isDeleted: boolean | undefined;

    switch (params.isDeleted) {
      case "true":
        isDeleted = true;
        break;
      case "false":
        isDeleted = false;
        break;
      default:
        isDeleted = undefined;
    }

    return {
      ...params,
      isDeleted: isDeleted,
      sort: params.sort ? (params.sort === "2" ? 2 : 1) : params.sort,
      count: Number(params.count),
      page: Number(params.page)
    };
  }

  private async _getViolations(params: GetViolation): Promise<IViolation[]> {
    const violations = await this._violationRepository.getViolation(params);
    if (violations.length === 0) {
      throw new NotFoundError("No Violations Found");
    }

    return violations;
  }

  private _getTotalCount(params: GetViolation): Promise<number> {
    return this._violationRepository.getTotalViolation(params);
  }

  private _hasNextPage(count: number, page: number, totalViolationCount: number): boolean {
    return page * count < totalViolationCount;
  }

  private _getTotalPages(countPerPage: number, totalViolationCount: number): number {
    return Math.ceil(totalViolationCount / countPerPage);
  }
}
