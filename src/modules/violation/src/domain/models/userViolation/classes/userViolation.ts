export interface IUserViolation {
  id: string;
  userId: string;
  reportedById: string;
  violationId: string;
  vehicleId: string;
}

export class UserViolation implements IUserViolation {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _reportedById: string;
  private readonly _violationId: string;
  private readonly _vehicleId: string;

  private constructor({
    id,
    userId,
    reportedById,
    violationId,
    vehicleId
  }: {
    id: string;
    userId: string;
    reportedById: string;
    violationId: string;
    vehicleId: string;
  }) {
    this._id = id;
    this._userId = userId;
    this._reportedById = reportedById;
    this._violationId = violationId;
    this._vehicleId = vehicleId;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get reportedById(): string {
    return this._reportedById;
  }

  get violationId(): string {
    return this._violationId;
  }

  get vehicleId(): string {
    return this._vehicleId;
  }

  public static create({
    id,
    userId,
    reportedById,
    violationId,
    vehicleId
  }: {
    id: string;
    userId: string;
    reportedById: string;
    violationId: string;
    vehicleId: string;
  }): IUserViolation {
    return new UserViolation({ id, userId, reportedById, violationId, vehicleId });
  }
}