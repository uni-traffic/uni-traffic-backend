import { UnexpectedError } from "../../../../shared/core/errors";
import { AuditLogFactory } from "../domain/models/auditLog/factory";
import { AuditLogMapper, type IAuditLogMapper } from "../domain/models/auditLog/mapper";
import type { CreateAuditLogParams, IAuditLogDTO } from "../dtos/auditLogDTO";
import { AuditLogRepository, type IAuditLogRepository } from "../repositories/auditLogRepository";

export interface IAuditLogService {
  createAndSaveAuditlog(params: CreateAuditLogParams): Promise<IAuditLogDTO>;
}

export class AuditLogService implements IAuditLogService {
  private _auditLogRepository: IAuditLogRepository;
  private _auditLogMapper: IAuditLogMapper;

  public constructor(
    auditLogRepository: IAuditLogRepository = new AuditLogRepository(),
    auditLogMapper: IAuditLogMapper = new AuditLogMapper()
  ) {
    this._auditLogRepository = auditLogRepository;
    this._auditLogMapper = auditLogMapper;
  }

  public async createAndSaveAuditlog(params: CreateAuditLogParams): Promise<IAuditLogDTO> {
    const auditLogOrError = AuditLogFactory.create({
      actionType: params.actionType,
      details: params.details,
      objectId: params.objectId,
      actorId: params.actorId
    });
    if (auditLogOrError.isFailure) {
      throw new UnexpectedError(auditLogOrError.getErrorMessage()!);
    }

    const savedAuditLog = await this._auditLogRepository.createAndSaveAuditLog(
      auditLogOrError.getValue()
    );
    if (!savedAuditLog) {
      throw new UnexpectedError("Failed to save audit log.");
    }

    return this._auditLogMapper.toDTO(savedAuditLog);
  }
}
