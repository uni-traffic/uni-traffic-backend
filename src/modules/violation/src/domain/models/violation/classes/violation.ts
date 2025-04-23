export interface IViolation {
  id: string;
  category: string;
  violationName: string;
  penalty: number;
  isDeleted: boolean;
  updateCategory(category: string): void;
  updateViolationName(violationName: string): void;
  updatePenalty(penalty: number): void;
  softDelete(): void;
}

export class Violation implements IViolation {
  private readonly _id: string;
  private _category: string;
  private _violationName: string;
  private _penalty: number;
  private _isDeleted: boolean;

  private constructor({
    id,
    category,
    violationName,
    penalty,
    isDeleted
  }: {
    id: string;
    category: string;
    violationName: string;
    penalty: number;
    isDeleted: boolean;
  }) {
    this._id = id;
    this._category = category;
    this._violationName = violationName;
    this._penalty = penalty;
    this._isDeleted = isDeleted;
  }

  get id(): string {
    return this._id;
  }

  get category(): string {
    return this._category;
  }

  get violationName(): string {
    return this._violationName;
  }

  get penalty(): number {
    return this._penalty;
  }

  get isDeleted(): boolean {
    return this._isDeleted;
  }

  public updateCategory(category: string): void {
    this._category = category;
  }

  public updateViolationName(violationName: string): void {
    this._violationName = violationName;
  }

  public updatePenalty(penalty: number): void {
    this._penalty = penalty;
  }

  public softDelete(): void {
    this._isDeleted = true;
  }

  public static create(props: {
    id: string;
    category: string;
    violationName: string;
    penalty: number;
    isDeleted: boolean;
  }): IViolation {
    return new Violation(props);
  }
}
