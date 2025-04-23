import { defaultTo } from "rambda";
import { v4 as uuid } from "uuid";
import { Result } from "../../../../../../shared/core/result";
import { type IViolation, Violation } from "./classes/violation";

export interface IViolationFactoryProps {
  id?: string;
  category: string;
  violationName: string;
  penalty: number;
  isDeleted?: boolean;
}

export class ViolationFactory {
  public static create(violationFactoryProps: IViolationFactoryProps): Result<IViolation> {
    return Result.ok<IViolation>(
      Violation.create({
        ...violationFactoryProps,
        id: defaultTo(uuid(), violationFactoryProps.id),
        isDeleted: defaultTo(false, violationFactoryProps.isDeleted)
      })
    );
  }
}
