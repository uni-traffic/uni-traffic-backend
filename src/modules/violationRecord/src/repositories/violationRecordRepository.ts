import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolationRecord } from "../domain/models/violationRecord/classes/violationRecord";
import { ViolationRecordMapper } from "../domain/models/violationRecord/mapper";

export interface IViolationRecordRepository {
    createViolationRecord(
        id: string,
        userId: string,
        vehicleId: string,
        violationId: string,
        reportedById: string
    ): Promise<IViolationRecord>;
    isViolationRecordAlreadyExists(
        id: string,
    ): Promise<boolean>; 
}

export class ViolationRecordRepository implements IViolationRecordRepository {
    private _database;
    private _violationRecordMapper: ViolationRecordMapper;

    public constructor(database = db, violationRecordMapper = new ViolationRecordMapper()) {
        this._database = database;
        this._violationRecordMapper = violationRecordMapper;
    }

    public async createViolationRecord(
        id: string,
        userId: string,
        vehicleId: string,
        violationId: string,
        reportedById: string
    ): Promise<IViolationRecord> {
        const newViolationRecord = await this._database.violationRecord.create({
        data: { id, userId, vehicleId, violationId, reportedById, status: "UNPAID" },
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
    
    public async isViolationRecordAlreadyExists(id: string): Promise<boolean> {
        if (!id) return false; 
        const foundRecord = await this._database.violationRecord.findUnique({
            where: { id } 
        });
        return !!foundRecord;
    }
    
}
