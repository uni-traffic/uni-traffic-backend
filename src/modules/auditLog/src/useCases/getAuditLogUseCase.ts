import { NotFoundError } from "../../../../shared/core/errors";
import type { IAuditLog } from "../domain/models/auditLog/classes/auditLog";
import { AuditLogMapper, type IAuditLogMapper } from "../domain/models/auditLog/mapper";
import type { GetAuditLogParams, GetAuditLogResponse } from "../dtos/auditLogDTO";
import type { GetAuditLogRequest } from "../dtos/auditLogRequestSchema";
import { AuditLogRepository, type IAuditLogRepository } from "../repositories/auditLogRepository";

export class GetAuditLogUseCase {
  private _auditLogRepository: IAuditLogRepository;
  private _auditLogMapper: IAuditLogMapper;

  public constructor(
    auditLogRepository: IAuditLogRepository = new AuditLogRepository(),
    auditLogMapper: IAuditLogMapper = new AuditLogMapper()
  ) {
    this._auditLogRepository = auditLogRepository;
    this._auditLogMapper = auditLogMapper;
  }

  public async execute(params: GetAuditLogRequest): Promise<GetAuditLogResponse> {
    const refinedParams = this._refineParams(params);
    const auditLogs = await this._getAuditLogs(refinedParams);
    const totalAuditLogs = await this._getTotalAuditLogs(refinedParams);
    const hasNextPage = this._hasNextPage(refinedParams.count, refinedParams.page, totalAuditLogs);

    return {
      auditLogs: auditLogs.map((auditLog) => this._auditLogMapper.toDTO(auditLog)),
      hasNextPage: hasNextPage,
      hasPreviousPage: refinedParams.page > 1
    };
  }

  private _refineParams(params: GetAuditLogRequest): GetAuditLogParams {
    return {
      ...params,
      sort: params.sort ? (params.sort === "1" ? 1 : 2) : params.sort,
      count: Number(params.count),
      page: Number(params.page)
    };
  }

  private async _getAuditLogs(params: GetAuditLogParams): Promise<IAuditLog[]> {
    const auditLogs = await this._auditLogRepository.getAuditLog(params);
    if (auditLogs.length < 1) {
      throw new NotFoundError("No Audit Logs found");
    }

    return auditLogs;
  }

  private _getTotalAuditLogs(params: GetAuditLogParams): Promise<number> {
    return this._auditLogRepository.countTotalAuditLogs(params);
  }

  private _hasNextPage(count: number, page: number, totalAuditLog: number): boolean {
    return count * page < totalAuditLog;
  }
}
