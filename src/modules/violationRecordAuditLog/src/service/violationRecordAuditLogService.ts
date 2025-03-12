import type { IViolationRecordAuditLog } from "../domain/models/violationRecordAuditLog/classes/violationRecordAuditLog";
import type { ICreateViolationRecordAuditLogProps } from "../dtos/violationRecordAuditLogDTO";
import { CreateViolationRecordAuditLogUseCase } from "../useCases/createViolationRecordAuditLogUseCase";

export interface IViolationRecordAuditLogService {
  createAndSaveViolationRecordAuditLog(
    params: ICreateViolationRecordAuditLogProps
  ): Promise<IViolationRecordAuditLog | null>;
}

export class ViolationRecordAuditLogService implements IViolationRecordAuditLogService {
  private readonly _createViolationRecordAuditLogUseCase: CreateViolationRecordAuditLogUseCase;

  public constructor(
    createViolationRecordAuditLogUseCase: CreateViolationRecordAuditLogUseCase = new CreateViolationRecordAuditLogUseCase()
  ) {
    this._createViolationRecordAuditLogUseCase = createViolationRecordAuditLogUseCase;
  }

  public async createAndSaveViolationRecordAuditLog(
    params: ICreateViolationRecordAuditLogProps
  ): Promise<IViolationRecordAuditLog | null> {
    return await this._createViolationRecordAuditLogUseCase.execute(params);
  }
}
