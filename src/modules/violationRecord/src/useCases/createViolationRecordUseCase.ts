import { type IViolationRecordDTO } from "../dtos/violationRecordDTO";
import { ViolationRecordMapper } from "../domain/models/violationRecord/mapper";
import { type IViolationRecordRepository, ViolationRecordRepository } from "../repositories/violationRecordRepository";
import { ViolationRecordRequest } from "../dtos/violationRecordRequestSchema";
import { ConflictError } from "../../../../shared/core/errors";

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
    id,
    userId,
    vehicleId,
    violationId,
    reportedById
  } : ViolationRecordRequest): Promise<IViolationRecordDTO> {
    if (id) {
        const existingRecord = await this._violationRecordRepository.isViolationRecordAlreadyExists(id);
        if (existingRecord) {
            throw new ConflictError("Violation record already exists.");
        }
    }

    const newViolationRecord = await this._violationRecordRepository.createViolationRecord(
        id,
        userId,
        vehicleId,
        violationId,
        reportedById
    );

    return this._violationRecordMapper.toDTO(newViolationRecord);
  }
}