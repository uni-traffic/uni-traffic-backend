import type { IUserDTO } from "../../../../../../user/src/dtos/userDTO";
import type { IVehicleDTO } from "../../../../../../vehicle/src/dtos/vehicleDTO";
import type { IViolationDTO } from "../../../../../../violation/src/dtos/violationDTO";
import type { IViolationRecordPaymentDTO } from "../../../../../../violationRecordPayment/src/dtos/violationRecordPaymentDTO";
import type { ViolationRecordRemarks } from "./violationRecordRemarks";
import type { ViolationRecordStatus } from "./violationRecordStatus";

export interface IViolationRecord {
  id: string;
  userId: string;
  reportedById: string;
  violationId: string;
  vehicleId: string;
  createdAt: Date;
  penalty: number;
  remarks: ViolationRecordRemarks;
  status: ViolationRecordStatus;
  user: IUserDTO | undefined;
  reporter: IUserDTO | undefined;
  violation: IViolationDTO | undefined;
  vehicle: IVehicleDTO | undefined;
  payment: IViolationRecordPaymentDTO | undefined;
  updateStatus(newStatus: ViolationRecordStatus): void;
}

export class ViolationRecord implements IViolationRecord {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _reportedById: string;
  private readonly _violationId: string;
  private readonly _vehicleId: string;
  private readonly _remarks: ViolationRecordRemarks;
  private readonly _penalty: number;
  private readonly _createdAt: Date;
  private _status: ViolationRecordStatus;
  private readonly _user: IUserDTO | undefined;
  private readonly _reporter: IUserDTO | undefined;
  private readonly _violation: IViolationDTO | undefined;
  private readonly _vehicle: IVehicleDTO | undefined;
  private readonly _payment: IViolationRecordPaymentDTO | undefined;

  private constructor(props: {
    id: string;
    userId: string;
    reportedById: string;
    violationId: string;
    vehicleId: string;
    createdAt: Date;
    remarks: ViolationRecordRemarks;
    penalty: number;
    status: ViolationRecordStatus;
    user?: IUserDTO;
    reporter?: IUserDTO;
    violation?: IViolationDTO;
    vehicle?: IVehicleDTO;
    payment?: IViolationRecordPaymentDTO;
  }) {
    this._id = props.id;
    this._userId = props.userId;
    this._reportedById = props.reportedById;
    this._violationId = props.violationId;
    this._vehicleId = props.vehicleId;
    this._remarks = props.remarks;
    this._penalty = props.penalty;
    this._createdAt = props.createdAt;
    this._status = props.status;
    this._user = props.user;
    this._reporter = props.reporter;
    this._violation = props.violation;
    this._vehicle = props.vehicle;
    this._payment = props.payment;
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

  get penalty(): number {
    return this._penalty;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get status(): ViolationRecordStatus {
    return this._status;
  }

  get remarks(): ViolationRecordRemarks {
    return this._remarks;
  }

  get user(): IUserDTO | undefined {
    return this._user;
  }

  get reporter(): IUserDTO | undefined {
    return this._reporter;
  }

  get violation(): IViolationDTO | undefined {
    return this._violation;
  }

  get vehicle(): IVehicleDTO | undefined {
    return this._vehicle;
  }

  get payment(): IViolationRecordPaymentDTO | undefined {
    return this._payment;
  }

  public updateStatus(newStatus: ViolationRecordStatus): void {
    this._status = newStatus;
  }

  public static create(props: {
    id: string;
    userId: string;
    reportedById: string;
    violationId: string;
    vehicleId: string;
    penalty: number;
    createdAt: Date;
    remarks: ViolationRecordRemarks;
    status: ViolationRecordStatus;
    user?: IUserDTO;
    reporter?: IUserDTO;
    violation?: IViolationDTO;
    vehicle?: IVehicleDTO;
    payment?: IViolationRecordPaymentDTO;
  }): ViolationRecord {
    return new ViolationRecord(props);
  }
}
