import type { AuditLogType } from "@prisma/client";
import type { IVehicleAuditLogDTO } from "../../../dtos/vehicleAuditLog";
import type { IVehicleAuditLog } from "./classes/vehicleAuditLog";
import type { IVehicleAuditLogRawObject, IVehicleAuditLogSchema } from "./constant";
import { VehicleAuditLogFactory } from "./factory";
import { defaultTo } from "rambda";

export interface IVehicleAuditLogMapper {
  toPersistence(vehicleAuditLog: IVehicleAuditLog): IVehicleAuditLogSchema;
  toDomain(raw: IVehicleAuditLogRawObject): IVehicleAuditLog;
  toDTO(vehicleAuditLog: IVehicleAuditLog): IVehicleAuditLogDTO;
}

export class VehicleAuditLogMapper implements IVehicleAuditLogMapper {
  public toPersistence(vehicleAuditLog: IVehicleAuditLog): IVehicleAuditLogSchema {
    return {
      id: vehicleAuditLog.id,
      actorId: vehicleAuditLog.actorId,
      vehicleId: vehicleAuditLog.vehicleId,
      auditLogType: vehicleAuditLog.auditLogType.value as AuditLogType,
      details: vehicleAuditLog.details,
      createdAt: vehicleAuditLog.createdAt
    };
  }

  public toDomain(raw: IVehicleAuditLogRawObject): IVehicleAuditLog {
    return VehicleAuditLogFactory.create(raw).getValue();
  }

  public toDTO(vehicleAuditLog: IVehicleAuditLog): IVehicleAuditLogDTO {
    return {
      id: vehicleAuditLog.id,
      actorId: vehicleAuditLog.actorId,
      vehicleId: vehicleAuditLog.vehicleId,
      auditLogType: vehicleAuditLog.auditLogType.value,
      details: vehicleAuditLog.details,
      createdAt: vehicleAuditLog.createdAt,
      actor: defaultTo(null, vehicleAuditLog.actor),
      vehicle: defaultTo(null, vehicleAuditLog.vehicle)
    };
  }
}
