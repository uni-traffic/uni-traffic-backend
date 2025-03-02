import type { ViolationRecordStatus } from "@prisma/client";
import { defaultTo } from "rambda";
import type { IViolationRecordDTO } from "../../../dtos/violationRecordDTO";
import type { IViolationRecord } from "./classes/violationRecord";
import type { IViolationRecordRawObject, IViolationRecordSchema } from "./constant";
import { ViolationRecordFactory } from "./factory";

export interface IViolationRecordMapper {
  toPersistence(violationRecord: IViolationRecord): IViolationRecordSchema;
  toDomain(raw: IViolationRecordRawObject): IViolationRecord;
  toDTO(violationRecord: IViolationRecord): IViolationRecordDTO;
}

export class ViolationRecordMapper implements IViolationRecordMapper {
  public toPersistence(violationRecord: IViolationRecord): IViolationRecordSchema {
    return {
      id: violationRecord.id,
      userId: violationRecord.userId,
      reportedById: violationRecord.reportedById,
      violationId: violationRecord.violationId,
      vehicleId: violationRecord.vehicleId,
      remarks: violationRecord.remarks.value,
      createdAt: violationRecord.createdAt,
      status: violationRecord.status.value as ViolationRecordStatus
    };
  }

  public toDomain(raw: IViolationRecordRawObject): IViolationRecord {
    return ViolationRecordFactory.create(raw).getValue();
  }

  public toDTO(violationRecord: IViolationRecord): IViolationRecordDTO {
    return {
      id: violationRecord.id,
      userId: violationRecord.userId,
      reportedById: violationRecord.reportedById,
      violationId: violationRecord.violationId,
      vehicleId: violationRecord.vehicleId,
      status: violationRecord.status.value,
      remarks: violationRecord.remarks.value,
      date: violationRecord.createdAt.toISOString(),
      user: defaultTo(null, violationRecord.user),
      reporter: defaultTo(null, violationRecord.reporter),
      violation: defaultTo(null, violationRecord.violation),
      vehicle: defaultTo(null, violationRecord.vehicle)
    };
  }
}
