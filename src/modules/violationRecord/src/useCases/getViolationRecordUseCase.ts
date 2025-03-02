import { NotFoundError } from "../../../../shared/core/errors";
import type { IViolationRecord } from "../domain/models/violationRecord/classes/violationRecord";
import {
  type IViolationRecordMapper,
  ViolationRecordMapper
} from "../domain/models/violationRecord/mapper";
import type { IViolationRecordDTO } from "../dtos/violationRecordDTO";
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

  public async execute(payload: ViolationRecordGetRequest): Promise<IViolationRecordDTO[]> {
    const violationRecord = await this._getViolationRecordDetails(payload);

    return violationRecord.map(record => this._violationRecordMapper.toDTO(record));
  }

  private async _getViolationRecordDetails(
    payload: ViolationRecordGetRequest
  ): Promise<IViolationRecord[]> {
    const violationRecords =
      await this._violationRecordRepository.getViolationRecordByProperty(payload);
    if (!violationRecords || violationRecords.length === 0) {
      throw new NotFoundError("Violation Records not found");
    }

    return violationRecords;
  }
}
