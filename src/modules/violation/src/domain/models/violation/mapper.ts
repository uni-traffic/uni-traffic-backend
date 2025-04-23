import { UnexpectedError } from "../../../../../../shared/core/errors";
import type { IViolationDTO } from "../../../dtos/violationDTO";
import type { IViolation } from "./classes/violation";
import type { IViolationRawObject, IViolationSchema } from "./constant";
import { ViolationFactory } from "./factory";

export interface IViolationMapper {
  toPersistence(violation: IViolation): IViolationSchema;
  toDomain(raw: IViolationRawObject): IViolation;
  toDTO(violation: IViolation): IViolationDTO;
}

export class ViolationMapper implements IViolationMapper {
  public toPersistence(violation: IViolation): IViolationSchema {
    return {
      id: violation.id,
      category: violation.category,
      violationName: violation.violationName,
      penalty: violation.penalty,
      isDeleted: violation.isDeleted
    };
  }

  public toDomain(raw: IViolationRawObject): IViolation {
    const violationOrError = ViolationFactory.create(raw);
    if (violationOrError.isFailure) {
      throw new UnexpectedError(
        `Error occurred mapping persistence data to domain ${violationOrError.getErrorMessage()}`
      );
    }

    return violationOrError.getValue();
  }

  public toDTO(violation: IViolation): IViolationDTO {
    return {
      id: violation.id,
      category: violation.category,
      violationName: violation.violationName,
      penalty: violation.penalty,
      isDeleted: violation.isDeleted
    };
  }
}
