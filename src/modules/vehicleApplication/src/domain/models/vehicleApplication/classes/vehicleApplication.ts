import type { IUserDTO } from "../../../../../../user/src/dtos/userDTO";
import type { IVehicleApplicationPaymentDTO } from "../../../../../../vehicleApplicationPayment/src/dtos/vehicleApplicationPaymentDTO";
import type { VehicleApplicationDriver } from "./vehicleApplicationDriver";
import type { VehicleApplicationSchoolMember } from "./vehicleApplicationSchoolMember";
import type { VehicleApplicationStatus } from "./vehicleApplicationStatus";
import type { VehicleApplicationVehicle } from "./vehicleApplicationVehicle";

export interface IVehicleApplication {
  id: string;
  stickerNumber: string | null;
  remarks: string | null;
  createdAt: Date;
  updatedAt: Date;

  driver: VehicleApplicationDriver;
  vehicle: VehicleApplicationVehicle;
  schoolMember: VehicleApplicationSchoolMember;
  status: VehicleApplicationStatus;

  applicantId: string;
  applicant?: IUserDTO;

  payment?: IVehicleApplicationPaymentDTO;
}

export class VehicleApplication implements IVehicleApplication {
  private readonly _id: string;
  private readonly _schoolMember: VehicleApplicationSchoolMember;
  private readonly _driver: VehicleApplicationDriver;
  private readonly _vehicle: VehicleApplicationVehicle;

  private readonly _status: VehicleApplicationStatus;
  private readonly _stickerNumber: string | null;
  private readonly _remarks: string | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private readonly _applicantId: string;
  private readonly _applicant?: IUserDTO;
  private readonly _payment?: IVehicleApplicationPaymentDTO;

  private constructor(props: {
    id: string;

    schoolMember: VehicleApplicationSchoolMember;
    driver: VehicleApplicationDriver;
    vehicle: VehicleApplicationVehicle;

    status: VehicleApplicationStatus;
    stickerNumber: string | null;
    remarks: string | null;
    createdAt: Date;
    updatedAt: Date;

    applicantId: string;
    applicant?: IUserDTO;

    payment?: IVehicleApplicationPaymentDTO;
  }) {
    this._id = props.id;
    this._schoolMember = props.schoolMember;
    this._driver = props.driver;
    this._vehicle = props.vehicle;
    this._status = props.status;
    this._stickerNumber = props.stickerNumber;
    this._remarks = props.remarks;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this._applicantId = props.applicantId;
    this._applicant = props.applicant;

    this._payment = props.payment;
  }

  get id(): string {
    return this._id;
  }

  get schoolMember(): VehicleApplicationSchoolMember {
    return this._schoolMember;
  }

  get driver(): VehicleApplicationDriver {
    return this._driver;
  }

  get vehicle(): VehicleApplicationVehicle {
    return this._vehicle;
  }

  get status(): VehicleApplicationStatus {
    return this._status;
  }

  get stickerNumber(): string | null {
    return this._stickerNumber;
  }

  get remarks(): string | null {
    return this._remarks;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get applicantId(): string {
    return this._applicantId;
  }

  get applicant(): IUserDTO | undefined {
    return this._applicant;
  }

  get payment(): IVehicleApplicationPaymentDTO | undefined {
    return this._payment;
  }

  public static create(props: {
    id: string;

    schoolMember: VehicleApplicationSchoolMember;
    driver: VehicleApplicationDriver;
    vehicle: VehicleApplicationVehicle;

    status: VehicleApplicationStatus;
    stickerNumber: string | null;
    remarks: string | null;
    createdAt: Date;
    updatedAt: Date;

    applicantId: string;
    applicant?: IUserDTO;

    payment?: IVehicleApplicationPaymentDTO;
  }): IVehicleApplication {
    return new VehicleApplication(props);
  }
}
