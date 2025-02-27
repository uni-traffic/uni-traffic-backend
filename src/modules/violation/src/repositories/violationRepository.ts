import { db } from "../../../../shared/infrastructure/database/prisma";
import type { IViolation } from "../domain/models/violation/classes/violation";
import type { IViolationMapper } from "../domain/models/violation/mapper";
import { ViolationMapper } from "../domain/models/violation/mapper";

export interface IViolationRepository {
  getAllViolations(): Promise<IViolation[]>;
}

export class ViolationRepository implements IViolationRepository {
  private _database;
  private _violationMapper: IViolationMapper;

  public constructor(database = db, violationMapper = new ViolationMapper()) {
    this._database = database;
    this._violationMapper = violationMapper;
  }

  public async getAllViolations(): Promise<IViolation[]> {
    const violationsRaw = await this._database.violation.findMany();
    return violationsRaw.map((violation) => this._violationMapper.toDomain(violation));
  }
}
