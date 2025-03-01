import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolationRecord } from "../domain/models/violationRecord/classes/violationRecord";
import { ViolationRecordMapper } from "../domain/models/violationRecord/mapper";

export interface IViolationRecordRepository {
    createViolationRecord(
        userId: string,
        vehicleId: string,
        violationId: string,
        reportedById: string
    ): Promise<IViolationRecord>;
}

export class ViolationRecordRepository implements IViolationRecordRepository {
    private _database;
    private _violationRecordMapper: ViolationRecordMapper;

    public constructor(database = db, violationRecordMapper = new ViolationRecordMapper()) {
        this._database = database;
        this._violationRecordMapper = violationRecordMapper;
    }

    public async createViolationRecord(
        userId: string,
        vehicleId: string,
        violationId: string,
        reportedById: string
    ): Promise<IViolationRecord> {
        const newViolationRecord = await this._database.violationRecord.create({
        data: { userId, vehicleId, violationId, reportedById, status: "UNPAID" },
        include: {
            user: true,
            reporter: true,
            violation: true,
            vehicle: true
        }
        });
        const domainRecord = this._violationRecordMapper.toDomain(newViolationRecord);
        return domainRecord;
    }
    
}
