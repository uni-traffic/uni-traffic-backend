import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolation } from "../domain/models/violation/classes/violation";
import type { IViolationMapper } from "../domain/models/violation/mapper";
import { ViolationMapper } from "../domain/models/violation/mapper";
import type { IViolationDTO } from "../dtos/violationDTO";
import {
  type UpdateViolationCreateRequest,
  UpdateViolationRequestSchema
} from "../dtos/violationRequestSchema";

export interface IViolationRepository {
  getAllViolations(): Promise<IViolation[]>;
  getViolationById(violationId: string): Promise<IViolation | null>;
  createViolation(violation: IViolation): Promise<IViolation | null>;
  updateViolation(violationId: UpdateViolationCreateRequest): Promise<IViolationDTO | null>;
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
    const violationsRaw = await this._database.violation.findMany();

    return violationsRaw.map((violation) => this._violationMapper.toDomain(violation));
  }

  public async getViolationById(violationId: string): Promise<IViolation | null> {
    const violation = await this._database.violation.findUnique({
      where: { id: violationId }
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

  public async updateViolation(
    violation: UpdateViolationCreateRequest
  ): Promise<IViolationDTO | null> {
    try {
      const validatedViolation = UpdateViolationRequestSchema.parse(violation);

      const updatedViolation = await this._database.violation.update({
        where: { id: validatedViolation.id },
        data: {
          category: validatedViolation.category,
          violationName: validatedViolation.violationName,
          penalty: validatedViolation.penalty
        }
      });

      return this._violationMapper.toDomain(updatedViolation);
    } catch {
      return null;
    }
  }
}
