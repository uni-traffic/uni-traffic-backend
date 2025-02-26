import { defaultTo } from "rambda";
import { v4 as uuid } from "uuid";
import { Result } from "../../../../../../shared/core/result";
import { type IUserViolation, UserViolation } from "./classes/userViolation";
import { PaymentStatus } from "@prisma/client";
import { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import { IVehicleDTO } from "../../../../../vehicle/src/dtos/vehicleDTO";
import { IViolationDTO } from "../../../dtos/violationDTO";

export interface IUserViolationFactoryProps {
  id?: string;
  userId: string;
  reportedById: string;
  violationId: string;
  vehicleId: string;
  status?: PaymentStatus;
  reporter: IUserDTO;
  violation: IViolationDTO;
  vehicle: IVehicleDTO;
}

export class UserViolationFactory {
  public static create(
    userViolationFactoryProps: IUserViolationFactoryProps
  ): Result<IUserViolation> {
    return Result.ok<IUserViolation>(
      UserViolation.create({
        ...userViolationFactoryProps,
        id: defaultTo(uuid(), userViolationFactoryProps.id),
        status: defaultTo(PaymentStatus.UNPAID, userViolationFactoryProps.status),
      })
    );
  }
}