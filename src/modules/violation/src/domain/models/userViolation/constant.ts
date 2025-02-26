import type { Prisma, User, UserViolation, Vehicle, Violation } from "@prisma/client";
import { IUserDTO } from "../../../../../user/src/dtos/userDTO";
import { IViolationDTO } from "../../../dtos/violationDTO";
import { IVehicleDTO } from "../../../../../vehicle/src/dtos/vehicleDTO";

export type IUserViolationRawObject = UserViolation & {
    reporter: IUserDTO;
    violation: IViolationDTO;
    vehicle: IVehicleDTO;
  };  
export type IUserViolationSchema = Prisma.UserViolationUncheckedCreateInput;