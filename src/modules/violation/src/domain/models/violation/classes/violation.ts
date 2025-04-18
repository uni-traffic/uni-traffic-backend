import type { UpdateViolationCreateRequest } from "../../../../dtos/violationRequestSchema";

export interface IViolation {
  id: string;
  category: string;
  violationName: string;
  penalty: number;
  updateViolation(params: UpdateViolationCreateRequest): void;
}

export class Violation implements IViolation {
  private _id: string;
  private _category: string;
  private _violationName: string;
  private _penalty: number;

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

  public updateViolation(params: UpdateViolationCreateRequest): void {
    this._id = params.id;
    this._category = params.category!;
    this._violationName = params.violationName!;
    this._penalty = params.penalty!;
  }

  public static create(props: {
    id: string;
    category: string;
    violationName: string;
    penalty: number;
  }): IViolation {
    return new Violation(props);
  }
}
