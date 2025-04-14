import type { IUserDTO } from "../../../user/src/dtos/userDTO";

export interface IAuditLogDTO {
  id: string;
  actionType: string;
  details: string;
  createdAt: Date;
  updatedAt: Date;
  actorId: string;
  actor?: IUserDTO | null;
  objectId: string;
}

export interface CreateAuditLogParams {
  actionType: string;
  details: string;
  objectId: string;
  actorId: string;
}

export interface GetAuditLogParams {
  objectId?: string;
  actorId?: string;
  actionType?: string;
  /**
   * Defines the sorting order for the audit logs.
   *
   * - `1`: Sort by date in descending order (newest to oldest).
   * - `2` (default): Sort by date in ascending order (oldest to newest).
   *
   * This field determines the order in which audit logs are returned, based on the date field.
   * If not provided, the logs will be sorted by date in ascending order by default.
   *
   * Example:
   * If sort = 1, the results will be returned from the most recent to the oldest based on the date.
   * If sort = 2, the results will be returned from the oldest to the most recent.
   */
  sort?: 1 | 2;
  /**
   * The search key to find partial matches in the objectId and actorId.
   *
   * When provided, the `searchKey` will override the strict matching of `objectId`
   * and `actorId`, and instead, the query will search for records where either `objectId`
   * or `actorId` contains the value of the `searchKey`. This allows for more flexible,
   * partial matching, instead of exact matches.
   *
   * Example use case:
   * If searchKey = "user123", it will find logs where objectId or actorId contains "user123".
   *
   * If this field is not provided, the query will strictly match the values of `objectId` and `actorId`.
   */
  searchKey?: string;
  count: number;
  page: number;
}

export interface AuditLogsWhereClauseParams {
  objectId?: string;
  actorId?: string;
  actionType?: string;
  searchKey?: string;
}

export interface GetAuditLogResponse {
  auditLogs: IAuditLogDTO[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
}
