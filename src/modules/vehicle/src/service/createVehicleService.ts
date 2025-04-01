import type { IVehicleFactoryProps } from "../domain/models/vehicle/factory";
import { CreateVehicleUseCase } from "../useCases/createVehicleUseCase";
import { IVehicleDTO } from "../dtos/vehicleDTO";

export interface IVehicleService {
  createVehicle(params: IVehicleFactoryProps): Promise<IVehicleDTO>;
}

export class VehicleService implements IVehicleService {
  private _createVehicleUseCase: CreateVehicleUseCase;

  public constructor(
    createVehicleUseCase: CreateVehicleUseCase = new CreateVehicleUseCase()
  ) {
    this._createVehicleUseCase = createVehicleUseCase;
  }

  public async createVehicle(params: IVehicleFactoryProps): Promise<IVehicleDTO> {
    return this._createVehicleUseCase.execute(params);
  }
}
