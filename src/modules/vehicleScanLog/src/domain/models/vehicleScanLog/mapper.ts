import { VehicleScanLog } from "./classes/vehicleScanLog";
import type { IVehicleScanLog } from "./classes/vehicleScanLog";
import type { IVehicleScanLogRawObject, IVehicleScanLogSchema } from "./constant";
import type { IVehicleScanLogDTO } from "../../../dtos/vehicleScanLogDTO";

export interface IVehicleScanLogMapper {
  toPersistence(vehicleScanLog: IVehicleScanLog): IVehicleScanLogSchema;
  toDomain(raw: IVehicleScanLogRawObject): IVehicleScanLog;
  toDTO(vehicleScanLog: IVehicleScanLog): IVehicleScanLogDTO;
}

export class VehicleScanLogMapper implements IVehicleScanLogMapper {
  public toPersistence(vehicleScanLog: IVehicleScanLog): IVehicleScanLogSchema {
    return {
      id: vehicleScanLog.id,
      securityId: vehicleScanLog.securityId,
      licensePlate: vehicleScanLog.licensePlate,
      time: vehicleScanLog.time
    };
  }

  public toDomain(raw: IVehicleScanLogRawObject): IVehicleScanLog {
    return VehicleScanLog.create({
      id: raw.id,
      securityId: raw.securityId,
      licensePlate: raw.licensePlate,
      time: raw.time,
      security: raw.security
    });
  }

  public toDTO(vehicleScanLog: IVehicleScanLog): IVehicleScanLogDTO {
    return {
      id: vehicleScanLog.id,
      securityId: vehicleScanLog.securityId,
      licensePlate: vehicleScanLog.licensePlate,
      time: vehicleScanLog.time,
      security: vehicleScanLog.security
    };
  }
}
