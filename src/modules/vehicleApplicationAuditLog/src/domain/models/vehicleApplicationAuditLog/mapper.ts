import type { AuditLogType } from "@prisma/client";
import type { IVehicleApplicationAuditLogDTO } from "../../../dtos/vehicleApplicationAuditLog";
import type { IVehicleApplicationAuditLog } from "./classes/vehicleApplicationAuditLog";
import type {
  IVehicleApplicationAuditLogRawObject,
  IVehicleApplicationAuditLogSchema
} from "./constant";
import { VehicleApplicationAuditLogFactory } from "./factory";
import { defaultTo } from "rambda";

export interface IVehicleApplicationAuditLogMapper {
  toPersistence(
    vehicleApplicationAuditLog: IVehicleApplicationAuditLog
  ): IVehicleApplicationAuditLogSchema;
  toDomain(raw: IVehicleApplicationAuditLogRawObject): IVehicleApplicationAuditLog;
  toDTO(vehicleApplicationAuditLog: IVehicleApplicationAuditLog): IVehicleApplicationAuditLogDTO;
}

export class VehicleApplicationAuditLogMapper implements IVehicleApplicationAuditLogMapper {
  public toPersistence(
    vehicleApplicationAuditLog: IVehicleApplicationAuditLog
  ): IVehicleApplicationAuditLogSchema {
    return {
      id: vehicleApplicationAuditLog.id,
      actorId: vehicleApplicationAuditLog.actorId,
      vehicleApplicationId: vehicleApplicationAuditLog.vehicleApplicationId,
      auditLogType: vehicleApplicationAuditLog.auditLogType.value as AuditLogType,
      details: vehicleApplicationAuditLog.details,
      createdAt: vehicleApplicationAuditLog.createdAt
    };
  }

  public toDomain(raw: IVehicleApplicationAuditLogRawObject): IVehicleApplicationAuditLog {
    return VehicleApplicationAuditLogFactory.create(raw).getValue();
  }

  public toDTO(
    vehicleApplicationAuditLog: IVehicleApplicationAuditLog
  ): IVehicleApplicationAuditLogDTO {
    return {
      id: vehicleApplicationAuditLog.id,
      actorId: vehicleApplicationAuditLog.actorId,
      vehicleApplicationId: vehicleApplicationAuditLog.vehicleApplicationId,
      auditLogType: vehicleApplicationAuditLog.auditLogType.value,
      details: vehicleApplicationAuditLog.details,
      createdAt: vehicleApplicationAuditLog.createdAt,
      actor: defaultTo(null, vehicleApplicationAuditLog.actor),
      vehicleApplication: defaultTo(null, vehicleApplicationAuditLog.vehicleApplication)
    };
  }
}
