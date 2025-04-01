import { BadRequest, ConflictError, UnexpectedError } from "../../../../shared/core/errors";
import { type IVehicleFactoryProps, VehicleFactory } from "../domain/models/vehicle/factory";
import { type IVehicleMapper, VehicleMapper } from "../domain/models/vehicle/mapper";
import { type IVehicleDTO } from "../dtos/vehicleDTO";
import type { IVehicle } from "../domain/models/vehicle/classes/vehicle";
import { type IVehicleRepository, VehicleRepository } from "../repositories/vehicleRepository";

export class CreateVehicleUseCase {
  private _vehicleMapper: IVehicleMapper;
  private _vehicleRepository: IVehicleRepository;

  public constructor(
    vehicleMapper: IVehicleMapper = new VehicleMapper(),
    vehicleRepository: IVehicleRepository = new VehicleRepository()
  ) {
    this._vehicleMapper = vehicleMapper;
    this._vehicleRepository = vehicleRepository;
  }

  public async execute({
    ownerId,
    licensePlate,
    make,
    model,
    series,
    color,
    type,
    images,
    stickerNumber,
    status = "REGISTERED",
  }: IVehicleFactoryProps): Promise<IVehicleDTO> {
    await this._ensureVehicleDoesNotExist(licensePlate);

    const vehicle = this._createVehicleDomain({
      ownerId,
      licensePlate,
      make,
      model,
      series,
      color,
      type,
      images,
      stickerNumber,
      status,
    });

    const savedVehicle = await this._saveVehicleToDatabase(vehicle);

    return this._vehicleMapper.toDTO(savedVehicle);
  }

  private async _ensureVehicleDoesNotExist(licensePlate: string): Promise<void> {
    const existingVehicle = await this._vehicleRepository.getVehicleByProperty({ licensePlate });
    if (existingVehicle) {
      throw new ConflictError("A vehicle with this license plate already exists.");
    }
  }

  private _createVehicleDomain({
    ownerId,
    licensePlate,
    make,
    model,
    series,
    color,
    type,
    images,
    stickerNumber,
    status,
  }: IVehicleFactoryProps): IVehicle {
    const vehicleOrError = VehicleFactory.create({
      ownerId,
      licensePlate,
      make,
      model,
      series,
      color,
      type,
      images,
      stickerNumber,
      status,
    });

    if (vehicleOrError.isFailure) {
      throw new BadRequest(vehicleOrError.getErrorMessage()!);
    }

    return vehicleOrError.getValue();
  }

  private async _saveVehicleToDatabase(vehicle: IVehicle): Promise<IVehicle> {
    const savedVehicle = await this._vehicleRepository.createVehicle(vehicle);
    if (!savedVehicle) {
      throw new UnexpectedError("Failed to save vehicle to database.");
    }

    return savedVehicle;
  }
}
