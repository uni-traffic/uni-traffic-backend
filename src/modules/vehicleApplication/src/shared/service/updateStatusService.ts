import type { UseCaseActorInfo } from "../../../../../shared/lib/types";
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
    params: IUpdateVehicleApplicationProps & UseCaseActorInfo
  ): Promise<IVehicleApplicationDTO> {
    return this._updateVehicleApplicationStatusUseCase.execute(params);
  }
}
