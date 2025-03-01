import { BadRequest, NotFoundError, UnexpectedError } from "../../../../shared/core/errors";
import type { IVehicle } from "../../../vehicle/src/domain/models/vehicle/classes/vehicle";
import {
  type IVehicleRepository,
  VehicleRepository
} from "../../../vehicle/src/repositories/vehicleRepository";
import type { IViolationRecord } from "../domain/models/violationRecord/classes/violationRecord";
import { ViolationRecordFactory } from "../domain/models/violationRecord/factory";
import { ViolationRecordMapper } from "../domain/models/violationRecord/mapper";
import type {
  ICreateViolationRecordInputUseCase,
  IViolationRecordDTO
} from "../dtos/violationRecordDTO";
import {
  type IViolationRecordRepository,
  ViolationRecordRepository
} from "../repositories/violationRecordRepository";

export class CreateViolationRecordUseCase {
  private _violationRecordMapper: ViolationRecordMapper;
  private _violationRecordRepository: IViolationRecordRepository;
  private _vehicleRepository: IVehicleRepository;

  public constructor(
    violationRecordMapper = new ViolationRecordMapper(),
    violationRecordRepository = new ViolationRecordRepository(),
    vehicleRepository = new VehicleRepository()
  ) {
    this._violationRecordMapper = violationRecordMapper;
    this._vehicleRepository = vehicleRepository;
    this._violationRecordRepository = violationRecordRepository;
  }

  public async execute({
    vehicleId,
    violationId,
    reportedById,
    licensePlate,
    stickerNumber
  }: ICreateViolationRecordInputUseCase): Promise<IViolationRecordDTO> {
    const vehicle = await this._getVehicleFromDatabase({ vehicleId, licensePlate, stickerNumber });
    const violationRecord = this._createViolationRecordObject({
      userId: vehicle.ownerId,
      vehicleId: vehicle.id,
      reportedById,
      violationId
    });
    const savedViolationRecord = await this._saveViolationRecord(violationRecord);

    return this._violationRecordMapper.toDTO(savedViolationRecord);
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
    reportedById: string;
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
