import type { Prisma } from "@prisma/client";
import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolation } from "../domain/models/violation/classes/violation";
import type { IViolationMapper } from "../domain/models/violation/mapper";
import { ViolationMapper } from "../domain/models/violation/mapper";
import type { GetViolation, ViolationWhereClauseParams } from "../dtos/violationDTO";

export interface IViolationRepository {
  getAllViolations(): Promise<IViolation[]>;
  getViolationById(violationId: string): Promise<IViolation | null>;
  createViolation(violation: IViolation): Promise<IViolation | null>;
  updateViolation(violationId: IViolation): Promise<IViolation | null>;
  getTotalViolation(params: GetViolation): Promise<number>;
  getViolation(params: GetViolation): Promise<IViolation[]>;
}

export class ViolationRepository implements IViolationRepository {
  private _database;
  private _violationMapper: IViolationMapper;

  public constructor(database = db, violationMapper = new ViolationMapper()) {
    this._database = database;
    this._violationMapper = violationMapper;
  }

  /** TODO:
   * 1. Implement a getViolationByProperty
   */

  public async getAllViolations(): Promise<IViolation[]> {
    const violationsRaw = await this._database.violation.findMany({
      where: {
        isDeleted: false
      }
    });

    return violationsRaw.map((violation) => this._violationMapper.toDomain(violation));
  }

  public async getViolationById(violationId: string): Promise<IViolation | null> {
    const violation = await this._database.violation.findUnique({
      where: {
        id: violationId
      }
    });

    return violation ? this._violationMapper.toDomain(violation) : null;
  }

  public async createViolation(violation: IViolation): Promise<IViolation | null> {
    try {
      const violationRaw = this._violationMapper.toPersistence(violation);
      const newViolation = await this._database.violation.create({
        data: violationRaw
      });
      return this._violationMapper.toDomain(newViolation);
    } catch {
      return null;
    }
  }

  public async updateViolation(violation: IViolation): Promise<IViolation | null> {
    try {
      const violationRaw = this._violationMapper.toPersistence(violation);

      const updatedViolation = await this._database.violation.update({
        where: { id: violation.id },
        data: violationRaw
      });

      return this._violationMapper.toDomain(updatedViolation);
    } catch {
      return null;
    }
  }

  public async getTotalViolation(params: GetViolation): Promise<number> {
    return this._database.violation.count({
      where: this._generateWhereClause(params)
    });
  }

  public async getViolation(params: GetViolation): Promise<IViolation[]> {
    try {
      const violations = await this._database.violation.findMany({
        skip: params.count * (params.page - 1),
        take: params.count,
        where: this._generateWhereClause(params),
        orderBy: {
          category: params.sort === 2 ? "desc" : "asc"
        }
      });

      return violations.map((violation) => this._violationMapper.toDomain(violation));
    } catch {
      return [];
    }
  }

  private _generateWhereClause(params: ViolationWhereClauseParams): Prisma.ViolationWhereInput {
    return params.searchKey
      ? {
          OR: [
            { id: { contains: params.searchKey, mode: "insensitive" } },
            { category: { contains: params.searchKey, mode: "insensitive" } },
            { violationName: { contains: params.searchKey, mode: "insensitive" } }
          ],
          isDeleted: params.isDeleted
        }
      : {
          id: params.id,
          category: params.category,
          violationName: params.violationName,
          isDeleted: params.isDeleted
        };
  }
}
