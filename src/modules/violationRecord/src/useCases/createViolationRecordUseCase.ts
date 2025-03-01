import { type IViolationRecordDTO } from "../dtos/violationRecordDTO";
import { ViolationRecordMapper } from "../domain/models/violationRecord/mapper";
import { type IViolationRecordRepository, ViolationRecordRepository } from "../repositories/violationRecordRepository";
import { ViolationRecordRequest } from "../dtos/violationRecordRequestSchema";

export class CreateViolationRecordUseCase {
  private _violationRecordMapper: ViolationRecordMapper;
  private _violationRecordRepository: IViolationRecordRepository;

  public constructor(
    violationRecordMapper = new ViolationRecordMapper(),
    violationRecordRepository = new ViolationRecordRepository()
  ) {
    this._violationRecordMapper = violationRecordMapper;
    this._violationRecordRepository = violationRecordRepository;
  }

  public async execute({
    userId,
    vehicleId,
    violationId,
    reportedById
  } : ViolationRecordRequest): Promise<IViolationRecordDTO> {

    const newViolationRecord = await this._violationRecordRepository.createViolationRecord(
        userId,
        vehicleId,
        violationId,
        reportedById
    );

    return this._violationRecordMapper.toDTO(newViolationRecord);
  }
}