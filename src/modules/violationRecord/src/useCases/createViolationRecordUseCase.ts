import { BadRequest, NotFoundError, UnexpectedError } from "../../../../shared/core/errors";
import type { IVehicle } from "../../../vehicle/src/domain/models/vehicle/classes/vehicle";
import {
  type IVehicleRepository,
  VehicleRepository
} from "../../../vehicle/src/repositories/vehicleRepository";
import type { IViolation } from "../../../violation/src/domain/models/violation/classes/violation";
import {
  type IViolationRepository,
  ViolationRepository
} from "../../../violation/src/repositories/violationRepository";
import type { IViolationRecord } from "../domain/models/violationRecord/classes/violationRecord";
import { ViolationRecordFactory } from "../domain/models/violationRecord/factory";
import {
  type IViolationRecordMapper,
  ViolationRecordMapper
} from "../domain/models/violationRecord/mapper";
import type {
  ICreateViolationRecordInputUseCase,
  IViolationRecordDTO
} from "../dtos/violationRecordDTO";
import {
  type IViolationRecordRepository,
  ViolationRecordRepository
} from "../repositories/violationRecordRepository";

export class CreateViolationRecordUseCase {
  private _violationRecordMapper: IViolationRecordMapper;
  private _violationRepository: IViolationRepository;
  private _violationRecordRepository: IViolationRecordRepository;
  private _vehicleRepository: IVehicleRepository;

  public constructor(
    violationRepository = new ViolationRepository(),
    violationRecordRepository = new ViolationRecordRepository(),
    violationRecordMapper = new ViolationRecordMapper(),
    vehicleRepository = new VehicleRepository()
  ) {
    this._violationRepository = violationRepository;
    this._violationRecordMapper = violationRecordMapper;
    this._vehicleRepository = vehicleRepository;
    this._violationRecordRepository = violationRecordRepository;
  }

  public async execute({
    vehicleId,
    violationId,
    reportedById,
    licensePlate,
    stickerNumber,
    remarks
  }: ICreateViolationRecordInputUseCase): Promise<IViolationRecordDTO> {
    const violation = await this._getViolationFromDatabase(violationId);
    const vehicle = await this._getVehicleFromDatabase({ vehicleId, licensePlate, stickerNumber });
    const violationRecord = this._createViolationRecordObject({
      userId: vehicle.ownerId,
      vehicleId: vehicle.id,
      penalty: violation.penalty,
      reportedById,
      violationId,
      remarks
    });
    const savedViolationRecord = await this._saveViolationRecord(violationRecord);

    return this._violationRecordMapper.toDTO(savedViolationRecord);
  }

  private async _getViolationFromDatabase(violationId: string): Promise<IViolation> {
    const violation = await this._violationRepository.getViolationById(violationId);
    if (!violation) {
      throw new BadRequest("Violation does not exist");
    }

    return violation;
  }

  private async _getVehicleFromDatabase({
    vehicleId,
    licensePlate,
    stickerNumber
  }: { vehicleId?: string; licensePlate?: string; stickerNumber?: string }): Promise<IVehicle> {
    const vehicle = await this._vehicleRepository.getVehicleByProperty({
      id: vehicleId,
      licensePlate,
      stickerNumber
    });
    if (!vehicle) {
      throw new NotFoundError(
        "The vehicle record that you've provided didn't match any records in our system."
      );
    }

    return vehicle;
  }

  private _createViolationRecordObject(props: {
    userId: string;
    vehicleId: string;
    violationId: string;
    penalty: number;
    reportedById: string;
    remarks: string;
  }): IViolationRecord {
    const violationRecord = ViolationRecordFactory.create(props);
    if (violationRecord.isFailure) {
      throw new BadRequest("Failed to create a record with the data that you've provided.");
    }

    return violationRecord.getValue();
  }

  private async _saveViolationRecord(violationRecord: IViolationRecord): Promise<IViolationRecord> {
    const savedViolationRecord =
      await this._violationRecordRepository.createViolationRecord(violationRecord);
    if (!savedViolationRecord) {
      throw new UnexpectedError("An error occurred while saving ViolationRecord");
    }

    return savedViolationRecord;
  }
}
