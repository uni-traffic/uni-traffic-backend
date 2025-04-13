import type { IUserDTO } from "../../../../../../user/src/dtos/userDTO";

export interface IVehicleScanLog {
  id: string;
  securityId: string;
  licensePlate: string;
  time: Date;
  security?: IUserDTO;
}

export class VehicleScanLog implements IVehicleScanLog {
  private readonly _id: string;
  private readonly _securityId: string;
  private readonly _licensePlate: string;
  private readonly _time: Date;
  private readonly _security?: IUserDTO;

  private constructor({ id, securityId, licensePlate, time, security }: IVehicleScanLog) {
    this._id = id;
    this._securityId = securityId;
    this._licensePlate = licensePlate;
    this._time = time;
    this._security = security;
  }

  get id(): string {
    return this._id;
  }

  get securityId(): string {
    return this._securityId;
  }

  get licensePlate(): string {
    return this._licensePlate;
  }

  get time(): Date {
    return this._time;
  }

  get security(): IUserDTO | undefined {
    return this._security;
  }

  public static create(props: IVehicleScanLog): IVehicleScanLog {
    return new VehicleScanLog(props);
  }
}
