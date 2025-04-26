import { NotFoundError } from "../../../../shared/core/errors";
import type { IViolationRecord } from "../domain/models/violationRecord/classes/violationRecord";
import {
  type IViolationRecordMapper,
  ViolationRecordMapper
} from "../domain/models/violationRecord/mapper";
import type { GetViolationRecord, GetViolationRecordResponse } from "../dtos/violationRecordDTO";
import type { ViolationRecordGetRequest } from "../dtos/violationRecordRequestSchema";
import {
  type IViolationRecordRepository,
  ViolationRecordRepository
} from "../repositories/violationRecordRepository";

export class GetViolationRecordInformationUseCase {
  private _violationRecordRepository: IViolationRecordRepository;
  private _violationRecordMapper: IViolationRecordMapper;

  public constructor(
    violationRecordRepository: IViolationRecordRepository = new ViolationRecordRepository(),
    violationRecordMapper: IViolationRecordMapper = new ViolationRecordMapper()
  ) {
    this._violationRecordRepository = violationRecordRepository;
    this._violationRecordMapper = violationRecordMapper;
  }

  public async execute(payload: ViolationRecordGetRequest): Promise<GetViolationRecordResponse> {
    const refinedParams = this._refinePayload(payload);
    const violation = await this._getViolationRecordDetails(refinedParams);
    const totalUserCount = await this._getTotalCount(refinedParams);
    const totalPages = this._getTotalPages(refinedParams.count, totalUserCount);
    const hasNextPage = this._hasNextPage(refinedParams.count, refinedParams.page, totalUserCount);

    return {
      violation: violation.map((record) => this._violationRecordMapper.toDTO(record)),
      hasNextPage,
      hasPreviousPage: refinedParams.page > 1,
      totalPages
    };
  }

  private async _getViolationRecordDetails(
    payload: GetViolationRecord
  ): Promise<IViolationRecord[]> {
    const violationRecords = await this._violationRecordRepository.getViolationRecord(payload);
    if (!violationRecords || violationRecords.length === 0) {
      throw new NotFoundError("Violation Records not found");
    }

    return violationRecords;
  }

  private _refinePayload(payload: ViolationRecordGetRequest): GetViolationRecord {
    return {
      ...payload,
      sort: payload.sort ? (payload.sort === "1" ? 1 : 2) : payload.sort,
      count: Number(payload.count),
      page: Number(payload.page)
    };
  }

  private _getTotalCount(params: GetViolationRecord): Promise<number> {
    return this._violationRecordRepository.getTotalViolation(params);
  }

  private _hasNextPage(count: number, page: number, totalUserCount: number): boolean {
    return page * count < totalUserCount;
  }

  private _getTotalPages(countPerPage: number, totalUser: number): number {
    return Math.ceil(totalUser / countPerPage);
  }
}
