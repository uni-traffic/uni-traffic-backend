import { PaymentStatus } from "@prisma/client";
import { IUserDTO } from "../../../../../../user/src/dtos/userDTO";
import { IViolationDTO } from "../../../../dtos/violationDTO";
import { IVehicleDTO } from "../../../../../../vehicle/src/dtos/vehicleDTO";

export interface IUserViolation {
  id: string;
  userId: string;
  reportedById: string;
  violationId: string;
  vehicleId: string;
  status: PaymentStatus;
  reporter: IUserDTO;
  violation: IViolationDTO;
  vehicle: IVehicleDTO;
}

export class UserViolation implements IUserViolation {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _reportedById: string;
  private readonly _violationId: string;
  private readonly _vehicleId: string;
  private readonly _status: PaymentStatus;
  private readonly _reporter: IUserDTO;
  private readonly _violation: IViolationDTO;
  private readonly _vehicle: IVehicleDTO;

  private constructor({
    id,
    userId,
    reportedById,
    violationId,
    vehicleId,
    status,
    reporter,
    violation,
    vehicle
  }: IUserViolation) {
    this._id = id;
    this._userId = userId;
    this._reportedById = reportedById;
    this._violationId = violationId;
    this._vehicleId = vehicleId;
    this._status = status;
    this._reporter = reporter;
    this._violation = violation;
    this._vehicle = vehicle;
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

  get status(): PaymentStatus {
    return this._status;
  }

  get reporter(): IUserDTO {
    return this._reporter;
  }

  get violation(): IViolationDTO {
    return this._violation;
  }

  get vehicle(): IVehicleDTO {
    return this._vehicle;
  }

  public static create(props: IUserViolation): IUserViolation {
    return new UserViolation(props);
  }
}