import { db } from "../../../../shared/infrastructure/database/prisma";
import { type IViolationRecordDTO } from "../dtos/violationRecordDTO";
import { ViolationRecordMapper } from "../domain/models/violationRecord/mapper";
import { ViolationRecordStatus } from "../domain/models/violationRecord/classes/violationRecordStatus";

export class CreateViolationRecordUseCase {
    private _violationRecordMapper: ViolationRecordMapper;

    public constructor(violationRecordMapper = new ViolationRecordMapper()) {
        this._violationRecordMapper = violationRecordMapper;
    }

    public async execute(
        userId: string,
        vehicleId: string,
        violationId: string,
        reportedById: string,
    ): Promise<IViolationRecordDTO> {
        const newViolationRecord = await db.violationRecord.create({
        data: { userId, vehicleId, violationId, reportedById}
        });

        return this._violationRecordMapper.toDTO({
            ...newViolationRecord,
            status: ViolationRecordStatus.create(newViolationRecord.status).getValue(),
            user: undefined,
            reporter: undefined,
            violation: undefined,
            vehicle: undefined
        });
    }
}