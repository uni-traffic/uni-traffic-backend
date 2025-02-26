export interface IViolation {
  id: string;
  category: string;
  violationName: string;
  penalty: number;
}

export class Violation implements IViolation {
  private readonly _id: string;
  private readonly _category: string;
  private readonly _violationName: string;
  private readonly _penalty: number;

  private constructor({
    id,
    category,
    violationName,
    penalty
  }: {
    id: string;
    category: string;
    violationName: string;
    penalty: number;
  }) {
    this._id = id;
    this._category = category;
    this._violationName = violationName;
    this._penalty = penalty;
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

  public static create(props: IViolation): IViolation {
    return new Violation(props);
  }
}
