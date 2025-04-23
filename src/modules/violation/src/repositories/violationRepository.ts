import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolation } from "../domain/models/violation/classes/violation";
import type { IViolationMapper } from "../domain/models/violation/mapper";
import { ViolationMapper } from "../domain/models/violation/mapper";

export interface IViolationRepository {
  getAllViolations(): Promise<IViolation[]>;
  getViolationById(violationId: string): Promise<IViolation | null>;
  createViolation(violation: IViolation): Promise<IViolation | null>;
  updateViolation(violationId: IViolation): Promise<IViolation | null>;
  deleteViolation(violationId: string): Promise<IViolation | null>;
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
      where: {
        id: violationId,
        isDeleted: false
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

  public async deleteViolation(violationId: string): Promise<IViolation | null> {
    try {
      const existingViolation = await this._database.violation.findUnique({
        where: {
          id: violationId,
          isDeleted: false
        }
      });

      if (!existingViolation) {
        return null;
      }

      const updatedViolation = await this._database.violation.update({
        where: { id: violationId },
        data: { isDeleted: true }
      });

      return this._violationMapper.toDomain(updatedViolation);
    } catch (error) {
      console.error("Error deleting violation:", error);
      return null;
    }
  }
}
