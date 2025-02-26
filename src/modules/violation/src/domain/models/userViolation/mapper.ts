import { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import type { IUserViolationDTO } from "../../../dtos/userViolationDTO";
import type { IUserViolation } from "./classes/userViolation";
import type { IUserViolationRawObject } from "./constant";
import { UserViolationFactory } from "./factory";

export interface IUserViolationMapper {
  toPersistence(userViolation: IUserViolation): IUserViolationRawObject;
  toDomain(raw: IUserViolationRawObject): IUserViolation;
  toDTO(userViolation: IUserViolation): IUserViolationDTO;
}

export class UserViolationMapper implements IUserViolationMapper {
  public toPersistence(userViolation: IUserViolation): IUserViolationRawObject {
    return {
      id: userViolation.id,
      userId: userViolation.userId,
      reportedById: userViolation.reportedById,
      violationId: userViolation.violationId,
      vehicleId: userViolation.vehicleId,
      status: userViolation.status,
      reporter: userViolation.reporter,
      violation: userViolation.violation,
      vehicle: userViolation.vehicle,
    };
  }

  public toDomain(raw: IUserViolationRawObject): IUserViolation {
    const userViolationOrError = UserViolationFactory.create({
      id: raw.id,
      userId: raw.userId,
      reportedById: raw.reportedById,
      violationId: raw.violationId,
      vehicleId: raw.vehicleId,
      status: raw.status,
      reporter: raw.reporter,
      violation: raw.violation,
      vehicle: raw.vehicle,
    });

    return userViolationOrError.getValue();
  }

  public toDTO(userViolation: IUserViolation): IUserViolationDTO {
    return {
      id: userViolation.id,
      userId: userViolation.userId,
      reportedById: userViolation.reportedById,
      violationId: userViolation.violationId,
      vehicleId: userViolation.vehicleId,
      status: userViolation.status,
      reporter: userViolation.reporter,
      violation: userViolation.violation,
      vehicle: userViolation.vehicle,
    };
  }
}