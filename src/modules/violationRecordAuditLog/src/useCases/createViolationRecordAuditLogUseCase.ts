import { BadRequest } from "../../../../shared/core/errors";
import type { IViolationRecordAuditLog } from "../domain/models/violationRecordAuditLog/classes/violationRecordAuditLog";
import { ViolationRecordAuditLogFactory } from "../domain/models/violationRecordAuditLog/factory";
import type { ICreateViolationRecordAuditLogProps } from "../dtos/violationRecordAuditLogDTO";
import {
  type IViolationRecordAuditLogRepository,
  ViolationRecordAuditLogRepository
} from "../repositories/violationRecordAuditLogRepository";

export class CreateViolationRecordAuditLogUseCase {
  private _violationRecordAuditLogRepository: IViolationRecordAuditLogRepository;

  public constructor(
    roleAuditLogRepository: IViolationRecordAuditLogRepository = new ViolationRecordAuditLogRepository()
  ) {
    this._violationRecordAuditLogRepository = roleAuditLogRepository;
  }

  public async execute(
    params: ICreateViolationRecordAuditLogProps
  ): Promise<IViolationRecordAuditLog | null> {
    const violationRecordAuditLogOrError = ViolationRecordAuditLogFactory.create(params);
    if (violationRecordAuditLogOrError.isFailure) {
      throw new BadRequest(violationRecordAuditLogOrError.getErrorMessage()!);
    }

    return await this._violationRecordAuditLogRepository.createViolationRecordAuditLog(
      violationRecordAuditLogOrError.getValue()
    );
  }
}
