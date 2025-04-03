import type {
  IUpdateVehicleApplicationProps,
  IVehicleApplicationDTO
} from "../../dtos/vehicleApplicationDTO";
import { UpdateVehicleApplicationStatusUseCase } from "../../useCases/updateVehicleApplicationStatusUseCase";

export interface IVehicleApplicationService {
  updateStatus(
    vehicleApplicationId: IUpdateVehicleApplicationProps
  ): Promise<IVehicleApplicationDTO>;
}

export class VehicleApplicationService implements IVehicleApplicationService {
  private _updateVehicleApplicationStatusUseCase: UpdateVehicleApplicationStatusUseCase;

  public constructor(
    updateVehicleApplicationStatusUseCase: UpdateVehicleApplicationStatusUseCase = new UpdateVehicleApplicationStatusUseCase()
  ) {
    this._updateVehicleApplicationStatusUseCase = updateVehicleApplicationStatusUseCase;
  }

  public async updateStatus(
    params: IUpdateVehicleApplicationProps
  ): Promise<IVehicleApplicationDTO> {
    return this._updateVehicleApplicationStatusUseCase.execute(params);
  }
}
