import { NotFoundError } from "../../../../shared/core/errors";
import type { IViolationRecordAuditLog } from "../domain/models/violationRecordAuditLog/classes/violationRecordAuditLog";
import {
  ViolationRecordAuditLogMapper,
  type IViolationRecordAuditLogMapper
} from "../domain/models/violationRecordAuditLog/mapper";
import type {
  GetViolationRecordAuditLogByPropertyUseCasePayload,
  IViolationRecordAuditLogDTO
} from "../dtos/violationRecordAuditLogDTO";
import type { ViolationRecordAuditLogGetRequest } from "../dtos/violationRecordAuditLogRequestSchema";
import {
  ViolationRecordAuditLogRepository,
  type IViolationRecordAuditLogRepository
} from "../repositories/violationRecordAuditLogRepository";

export class GetViolationRecordAuditLogByPropertyUseCase {
  private _violationRecordAuditLogRepository: IViolationRecordAuditLogRepository;
  private _violationRecordAuditLogMapper: IViolationRecordAuditLogMapper;

  public constructor(
    violationAuditLogRepository: IViolationRecordAuditLogRepository = new ViolationRecordAuditLogRepository(),
    violationAuditLogMapper: IViolationRecordAuditLogMapper = new ViolationRecordAuditLogMapper()
  ) {
    this._violationRecordAuditLogRepository = violationAuditLogRepository;
    this._violationRecordAuditLogMapper = violationAuditLogMapper;
  }

  public async execute(
    payload: ViolationRecordAuditLogGetRequest
  ): Promise<IViolationRecordAuditLogDTO[]> {
    const refinedPayload = this._refinePayload(payload);
    const violationRecordAuditLogDetails =
      await this._getViolationRecordAuditLogByPropertyDetails(refinedPayload);

    return violationRecordAuditLogDetails.map((violationRecordAuditLog) =>
      this._violationRecordAuditLogMapper.toDTO(violationRecordAuditLog)
    );
  }

  private async _getViolationRecordAuditLogByPropertyDetails(
    payload: GetViolationRecordAuditLogByPropertyUseCasePayload
  ): Promise<IViolationRecordAuditLog[]> {
    const violationRecordAuditLogDetails =
      await this._violationRecordAuditLogRepository.getViolationRecordAuditLogByProperty(payload);
    if (!violationRecordAuditLogDetails || violationRecordAuditLogDetails.length === 0) {
      throw new NotFoundError("Violation Record Audit Log not found");
    }
    return violationRecordAuditLogDetails;
  }

  private _refinePayload(
    payload: ViolationRecordAuditLogGetRequest
  ): GetViolationRecordAuditLogByPropertyUseCasePayload {
    return {
      id: payload.id,
      actorId: payload.actorId,
      auditLogType: payload.auditLogType,
      violationRecordId: payload.violationRecordId,
      count: Number(payload.count),
      page: Number(payload.page)
    };
  }
}
