import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolationRecord } from "../domain/models/violationRecord/classes/violationRecord";
import { ViolationRecordMapper } from "../domain/models/violationRecord/mapper";
import type { ViolationRecordRequest } from "../dtos/violationRecordRequestSchema";

export interface IViolationRecordRepository {
  createViolationRecord(violationRecord: IViolationRecord): Promise<IViolationRecord | null>;
  getViolationRecordById(userViolationId: string): Promise<IViolationRecord | null>;
  getViolationRecordByIds(userViolationId: string[]): Promise<IViolationRecord[]>;
  getViolationsRecordByUserId(userId: string): Promise<IViolationRecord[]>;
  getViolationsRecordByReporterId(reportedById: string): Promise<IViolationRecord[]>;
  getViolationsRecordByVehicleId(vehicleId: string): Promise<IViolationRecord[]>;
  getViolationsRecordByStatus(status: "UNPAID" | "PAID"): Promise<IViolationRecord[]>;
  getViolationRecordByProperty(params: ViolationRecordRequest): Promise<IViolationRecord[]>;
}

export class ViolationRecordRepository implements IViolationRecordRepository {
  private _database;
  private _violationRecordMapper: ViolationRecordMapper;

  public constructor(database = db, violationRecordMapper = new ViolationRecordMapper()) {
    this._database = database;
    this._violationRecordMapper = violationRecordMapper;
  }

  public async createViolationRecord(
    violationRecord: IViolationRecord
  ): Promise<IViolationRecord | null> {
    try {
      const violationRecordPersistence = this._violationRecordMapper.toPersistence(violationRecord);

      const newViolationRecord = await this._database.violationRecord.create({
        data: violationRecordPersistence
      });

      return this._violationRecordMapper.toDomain(newViolationRecord);
    } catch {
      return null;
    }
  }

  public async getViolationRecordById(userViolationId: string): Promise<IViolationRecord | null> {
    const violationRecord = await this.getViolationRecordByIds([userViolationId]);

    if (violationRecord.length === 0) {
      return null;
    }

    return violationRecord[0];
  }

  public async getViolationRecordByIds(userViolationId: string[]): Promise<IViolationRecord[]> {
    const violationRecordRaw = await this._database.violationRecord.findMany({
      where: {
        id: {
          in: userViolationId
        }
      },
      include: { reporter: true, user: true, vehicle: true, violation: true }
    });

    return violationRecordRaw.map((violationRecord) =>
      this._violationRecordMapper.toDomain(violationRecord)
    );
  }

  public async getViolationsRecordByReporterId(reportedById: string): Promise<IViolationRecord[]> {
    const violationRecordRaw = await this._database.violationRecord.findMany({
      where: {
        reportedById: reportedById
      },
      include: { reporter: true, user: true, vehicle: true, violation: true }
    });

    return violationRecordRaw.map((violationRecord) =>
      this._violationRecordMapper.toDomain(violationRecord)
    );
  }

  public async getViolationsRecordByUserId(userId: string): Promise<IViolationRecord[]> {
    const violationRecordRaw = await this._database.violationRecord.findMany({
      where: {
        userId: userId
      },
      include: { reporter: true, user: true, vehicle: true, violation: true }
    });

    return violationRecordRaw.map((violationRecord) =>
      this._violationRecordMapper.toDomain(violationRecord)
    );
  }

  public async getViolationsRecordByStatus(status: "UNPAID" | "PAID"): Promise<IViolationRecord[]> {
    const violationRecordRaw = await this._database.violationRecord.findMany({
      where: {
        status: status
      },
      include: { reporter: true, user: true, vehicle: true, violation: true }
    });

    return violationRecordRaw.map((violationRecord) =>
      this._violationRecordMapper.toDomain(violationRecord)
    );
  }

  public async getViolationsRecordByVehicleId(vehicleId: string): Promise<IViolationRecord[]> {
    const violationRecordRaw = await this._database.violationRecord.findMany({
      where: {
        vehicleId: vehicleId
      },
      include: { reporter: true, user: true, vehicle: true, violation: true }
    });

    return violationRecordRaw.map((violationRecord) =>
      this._violationRecordMapper.toDomain(violationRecord)
    );
  }

  public async getViolationRecordByProperty(
    params: ViolationRecordRequest
  ): Promise<IViolationRecord[]> {
    const { id, userId, violationId, reportedById, vehicleId } = params;
    if (!id && !userId && !violationId && !reportedById && !vehicleId) {
      return [];
    }

    try {
      const violationRecordRaw = await this._database.violationRecord.findMany({
        where: {
          ...{ id: id || undefined },
          ...{ userId: userId || undefined },
          ...{ violationId: violationId || undefined },
          ...{ reportedById: reportedById || undefined },
          ...{ vehicleId: vehicleId || undefined }
        },
        include: { reporter: true, user: true, vehicle: true, violation: true }
      });

      return violationRecordRaw.map((record) => this._violationRecordMapper.toDomain(record));
    } catch {
      return [];
    }
  }
}
